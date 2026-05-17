from fastapi import APIRouter

from app.dependencies.auth import CurrentUser
from app.schemas.currency import CurrencyRead
from app.services import currency_service

router = APIRouter(prefix="/currencies", tags=["currencies"])


@router.get("/", response_model=list[CurrencyRead])
async def get_available_currencies(current_user: CurrentUser) -> list[CurrencyRead]:
    return await currency_service.get_available_currencies()