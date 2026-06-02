from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select, or_
from sqlalchemy.orm import selectinload

from app.dependencies.auth import CurrentUser, DB
from app.models.deal import Deal, DealStatus
from app.models.message import Message
from app.schemas.deal import DealRead, DealSummary
from app.models.message import Message, MessageType
from app.schemas.message import DealWorkSubmit, MessageRead


async def get_my_deals(include_all: bool, current_user: CurrentUser, db: DB, status: DealStatus | None = None, limit: int = 20, offset: int = 0) -> list[DealSummary]:
    if include_all:
        query = (
            select(Deal)
            .where(
                or_(
                    Deal.client_id == current_user.id,
                    Deal.freelancer_id == current_user.id
                )

            )
            .where(Deal.status != DealStatus.COMPLETED)
            .order_by(Deal.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
    else:
        query = (
            select(Deal)
            .where(
                or_(
                    Deal.client_id == current_user.id,
                    Deal.freelancer_id == current_user.id
                )

            )
            .where(Deal.status == DealStatus.COMPLETED)
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


async def start_deal_work(deal_id: UUID, current_user: CurrentUser, db: DB) -> DealRead:
    result = await db.execute(select(Deal).where(Deal.id == deal_id))
    deal = result.scalar_one_or_none()

    if not deal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")

    if deal.freelancer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the freelancer can start work")

    if deal.status != DealStatus.FUNDED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only funded deals can be started")

    deal.status = DealStatus.IN_PROGRESS

    db.add(Message(
        deal_id=deal.id,
        sender_id=None,
        type=MessageType.SYSTEM,
        body="Freelancer started working on the deal",
        attachment_url=None
    ))

    await db.commit()

    return await get_deal_detail(deal_id=deal_id, current_user=current_user, db=db)


async def submit_deal_work(deal_id: UUID, payload: DealWorkSubmit, current_user: CurrentUser, db: DB) -> MessageRead:
    result = await db.execute(select(Deal).where(Deal.id == deal_id))
    deal = result.scalar_one_or_none()

    if not deal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")

    if deal.freelancer_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the freelancer can submit work")

    if deal.status != DealStatus.IN_PROGRESS:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Work can only be submitted when deal is in progress")

    message = Message(
        deal_id=deal.id,
        sender_id=current_user.id,
        type=MessageType.FILE if payload.attachment_url else MessageType.TEXT,
        body=payload.message,
        attachment_url=payload.attachment_url
    )

    db.add(message)

    db.add(Message(
        deal_id=deal.id,
        sender_id=None,
        type=MessageType.SYSTEM,
        body="Work was submitted for client review",
        attachment_url=None
    ))

    deal.status = DealStatus.SUBMITTED

    await db.commit()

    result = await db.execute(
        select(Message)
        .where(Message.id == message.id)
        .options(selectinload(Message.sender))
    )

    message = result.scalar_one()

    return MessageRead.model_validate(message)


async def approve_deal_work(deal_id: UUID, current_user: CurrentUser, db: DB) -> DealRead:
    result = await db.execute(select(Deal).where(Deal.id == deal_id))
    deal = result.scalar_one_or_none()

    if not deal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")

    if deal.client_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the client can approve work")

    if deal.status != DealStatus.SUBMITTED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only submitted work can be approved")

    deal.status = DealStatus.COMPLETED

    db.add(Message(
        deal_id=deal.id,
        sender_id=None,
        type=MessageType.SYSTEM,
        body="Work was approved by the client and the deal was completed",
        attachment_url=None
    ))

    await db.commit()

    return await get_deal_detail(deal_id=deal_id, current_user=current_user, db=db)


async def reject_deal_work(deal_id: UUID, current_user: CurrentUser, db: DB) -> DealRead:
    result = await db.execute(select(Deal).where(Deal.id == deal_id))
    deal = result.scalar_one_or_none()

    if not deal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")

    if deal.client_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the client can reject work")

    if deal.status != DealStatus.SUBMITTED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only submitted work can be rejected")

    deal.status = DealStatus.IN_PROGRESS

    db.add(Message(
        deal_id=deal.id,
        sender_id=None,
        type=MessageType.SYSTEM,
        body="Work was rejected by the client",
        attachment_url=None
    ))

    await db.commit()

    return await get_deal_detail(deal_id=deal_id, current_user=current_user, db=db)