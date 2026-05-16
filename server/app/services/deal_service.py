from decimal import Decimal
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.dependencies.auth import CurrentUser, DB
from app.models.deal import Deal, DealStatus
from app.models.user import UserRole
from app.models.milestone import Milestone
from app.schemas.deal import DealCreate, DealRead, DealSummary


async def create_deal(payload: DealCreate, current_user: CurrentUser, db: DB) -> DealRead:
    if current_user.role != UserRole.CLIENT:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only clients can create deals")

    if payload.freelancer_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Client and freelancer cannot be the same user")

    platform_fee = payload.amount * Decimal("0.05")

    deal = Deal(
        client_id=current_user.id,
        freelancer_id=payload.freelancer_id,
        title=payload.title,
        description=payload.description,
        amount=payload.amount,
        currency=payload.currency,
        platform_fee=platform_fee,
        deadline=payload.deadline,
        milestone_based=payload.milestone_based,
        status=DealStatus.CREATED,
    )

    db.add(deal)
    await db.flush()

    if payload.milestone_based:
        for index, milestone_payload in enumerate(payload.milestones, start=1):
            milestone = Milestone(
                deal_id=deal.id,
                title=milestone_payload.title,
                description=milestone_payload.description,
                amount=milestone_payload.amount,
                order=index,
            )
            db.add(milestone)

    await db.commit()

    result = await db.execute(
        select(Deal)
        .where(Deal.id == deal.id)
        .options(
            selectinload(Deal.client),
            selectinload(Deal.freelancer),
            selectinload(Deal.milestones),
        )
    )

    deal = result.scalar_one()

    return DealRead.model_validate(deal)


async def get_deals(db: DB, status_: str | None = None, limit: int = 20, offset: int = 0) -> list[DealSummary]:
    query = select(Deal).order_by(Deal.created_at.desc()).limit(limit).offset(offset)

    if status_:
        try:
            deal_status = DealStatus(status_)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid deal status")

        query = query.where(Deal.status == deal_status)

    result = await db.execute(query)
    deals = result.scalars().all()

    return [DealSummary.model_validate(deal) for deal in deals]