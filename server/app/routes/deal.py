from uuid import UUID
from fastapi import APIRouter, Query

from app.dependencies.auth import CurrentUser, DB
from app.schemas.deal import DealSummary, DealRead
from app.services import deal_service
from app.models.deal import DealStatus
from app.schemas.message import DealWorkSubmit, MessageRead

router = APIRouter(prefix="/deals", tags=["deals"])


@router.get("/me", response_model=list[DealSummary])
async def get_my_deals(
        current_user: CurrentUser, db: DB,status: DealStatus | None = Query(default=None),
        limit: int = Query(default=20, ge=1, le=100), offset: int = Query(default=0, ge=0)
) -> list[DealSummary]:
    return await deal_service.get_my_deals(
        include_all=True,
        current_user=current_user,
        db=db,
        status=status,
        limit=limit,
        offset=offset
    )


@router.get("/completed", response_model=list[DealSummary])
async def get_my_deals(
        current_user: CurrentUser, db: DB,status: DealStatus | None = Query(default=None),
        limit: int = Query(default=20, ge=1, le=100), offset: int = Query(default=0, ge=0)
) -> list[DealSummary]:
    return await deal_service.get_my_deals(
        include_all=False,
        current_user=current_user,
        db=db,
        status=status,
        limit=limit,
        offset=offset
    )

@router.get("/{deal_id}", response_model=DealRead)
async def get_deal_detail(deal_id: UUID, current_user: CurrentUser, db: DB) -> DealRead:
    return await deal_service.get_deal_detail(
        deal_id=deal_id,
        current_user=current_user,
        db=db
    )


@router.patch("/{deal_id}/start", response_model=DealRead)
async def start_deal_work(deal_id: UUID, current_user: CurrentUser, db: DB) -> DealRead:
    return await deal_service.start_deal_work(
        deal_id=deal_id,
        current_user=current_user,
        db=db
    )


@router.post("/{deal_id}/submit", response_model=MessageRead, status_code=201)
async def submit_deal_work(deal_id: UUID, payload: DealWorkSubmit, current_user: CurrentUser, db: DB) -> MessageRead:
    return await deal_service.submit_deal_work(
        deal_id=deal_id,
        payload=payload,
        current_user=current_user,
        db=db
    )


@router.patch("/{deal_id}/approve", response_model=DealRead)
async def approve_deal_work(deal_id: UUID, current_user: CurrentUser, db: DB) -> DealRead:
    return await deal_service.approve_deal_work(
        deal_id=deal_id,
        current_user=current_user,
        db=db
    )