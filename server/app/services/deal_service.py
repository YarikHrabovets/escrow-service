from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload

from app.dependencies.auth import CurrentUser, DB
from app.models.deal import Deal, DealStatus
from app.models.message import Message
from app.schemas.deal import DealRead, DealSummary


async def get_my_deals(current_user: CurrentUser, db: DB, status: DealStatus | None = None, limit: int = 20, offset: int = 0) -> list[DealSummary]:
    query = (
        select(Deal)
        .where(
            or_(
                Deal.client_id == current_user.id,
                Deal.freelancer_id == current_user.id
            )
        )
        .order_by(Deal.created_at.desc())
        .limit(limit)
        .offset(offset)
    )

    if status is not None:
        query = query.where(Deal.status == status)

    result = await db.execute(query)
    deals = result.scalars().all()

    return [DealSummary.model_validate(deal) for deal in deals]


async def get_deal_detail(deal_id: UUID, current_user: CurrentUser, db: DB) -> DealRead:
    result = await db.execute(
        select(Deal)
        .where(Deal.id == deal_id)
        .options(
            selectinload(Deal.client),
            selectinload(Deal.freelancer),
            selectinload(Deal.milestones),
            selectinload(Deal.messages).selectinload(Message.sender),
            selectinload(Deal.transactions)
        )
    )

    deal = result.scalar_one_or_none()

    if not deal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")

    if deal.client_id != current_user.id and deal.freelancer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this deal")

    return DealRead.model_validate(deal)