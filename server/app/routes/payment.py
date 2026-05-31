from uuid import UUID

from fastapi import APIRouter, Request

from app.dependencies.auth import CurrentUser, DB
from app.schemas.payment import CheckoutSessionRead
from app.services import payment_service

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/deals/{deal_id}/checkout", response_model=CheckoutSessionRead)
async def create_deal_checkout_session(deal_id: UUID, current_user: CurrentUser, db: DB) -> CheckoutSessionRead:
    return await payment_service.create_deal_checkout_session(
        deal_id=deal_id,
        current_user=current_user,
        db=db
    )


@router.post("/stripe/webhook")
async def stripe_webhook(request: Request, db: DB) -> dict:
    return await payment_service.handle_stripe_webhook(
        request=request,
        db=db
    )