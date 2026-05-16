from fastapi import APIRouter, Query
from app.schemas.deal import DealCreate, DealRead, DealSummary
from app.dependencies.auth import CurrentUser, DB
from app.services import deal_service

router = APIRouter(prefix="/deal", tags=["deal"])

@router.post("/", response_model=DealRead, status_code=201)
async def create_deal(payload: DealCreate, current_user: CurrentUser, db: DB) -> DealRead:
    return await deal_service.create_deal(payload=payload, current_user=current_user, db=db)

@router.get("/", response_model=list[DealSummary])
async def get_deals(
        db: DB, status: str | None = Query(default=None),
        limit: int = Query(default=20, ge=1, le=100),
        offset: int = Query(default=0, ge=0)
) -> list[DealSummary]:
    return await deal_service.get_deals(db=db, status_=status, limit=limit, offset=offset)
