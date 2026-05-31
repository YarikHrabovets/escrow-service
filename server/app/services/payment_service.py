from decimal import Decimal, ROUND_HALF_UP
from uuid import UUID

import stripe
from fastapi import HTTPException, Request, status
from sqlalchemy import select

from app.core.config import settings
from app.dependencies.auth import CurrentUser, DB
from app.models.deal import Deal, DealStatus
from app.models.message import Message, MessageType
from app.models.transaction import Transaction, TransactionStatus, TransactionType
from app.schemas.payment import CheckoutSessionRead

stripe.api_key = settings.STRIPE_SECRET_KEY


STRIPE_CARD_CURRENCIES = {
    "USD",
    "EUR",
    "GBP",
    "CAD",
    "AUD",
    "NZD",
    "CHF",
    "SEK",
    "NOK",
    "DKK",
    "PLN",
    "CZK",
    "HUF",
    "RON",
    "BGN",
    "JPY"
}

ZERO_DECIMAL_CURRENCIES = {
    "JPY"
}


def get_currency_code(currency: object) -> str:
    if hasattr(currency, "value"):
        return str(currency.value).upper()

    return str(currency).upper()


def to_stripe_amount(amount: Decimal, currency: str) -> int:
    if currency in ZERO_DECIMAL_CURRENCIES:
        return int(amount.quantize(Decimal("1"), rounding=ROUND_HALF_UP))

    return int((amount * Decimal("100")).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


async def create_deal_checkout_session(deal_id: UUID, current_user: CurrentUser, db: DB) -> CheckoutSessionRead:
    result = await db.execute(select(Deal).where(Deal.id == deal_id))
    deal = result.scalar_one_or_none()

    if not deal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Deal not found")

    if deal.client_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the client can fund this deal")

    if deal.status != DealStatus.CREATED:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only created deals can be funded")

    currency = get_currency_code(deal.currency)

    if currency not in STRIPE_CARD_CURRENCIES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This currency is not supported for Stripe card checkout")

    session = stripe.checkout.Session.create(
        mode="payment",
        success_url=f"{settings.FRONTEND_URL}/deals/{deal.id}?payment=success",
        cancel_url=f"{settings.FRONTEND_URL}/deals/{deal.id}?payment=cancelled",
        client_reference_id=str(deal.id),
        line_items=[
            {
                "price_data": {
                    "currency": currency.lower(),
                    "product_data": {
                        "name": deal.title
                    },
                    "unit_amount": to_stripe_amount(deal.amount, currency)
                },
                "quantity": 1
            }
        ],
        payment_intent_data={
            "metadata": {
                "deal_id": str(deal.id),
                "client_id": str(current_user.id),
                "type": "deal_funding"
            },
            "transfer_group": f"deal_{deal.id}"
        },
        metadata={
            "deal_id": str(deal.id),
            "client_id": str(current_user.id),
            "type": "deal_funding"
        }
    )

    transaction = Transaction(
        deal_id=deal.id,
        milestone_id=None,
        type=TransactionType.DEPOSIT,
        amount=deal.amount,
        currency=currency,
        provider_ref=session.id,
        status=TransactionStatus.PENDING
    )

    db.add(transaction)
    await db.commit()

    return CheckoutSessionRead(checkout_url=session.url)


async def handle_stripe_webhook(request: Request, db: DB) -> dict:
    payload = await request.body()
    signature = request.headers.get("stripe-signature")

    if not signature:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing Stripe signature")

    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=signature,
            secret=settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid webhook payload")
    except stripe.SignatureVerificationError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid webhook signature")

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        deal_id = session.get("metadata", {}).get("deal_id")
        payment_status = session.get("payment_status")

        if deal_id and payment_status == "paid":
            await confirm_deal_funding(
                deal_id=UUID(deal_id),
                checkout_session_id=session["id"],
                db=db
            )

    if event["type"] == "checkout.session.expired":
        session = event["data"]["object"]

        await mark_checkout_session_failed(
            checkout_session_id=session["id"],
            db=db
        )

    return {"received": True}


async def confirm_deal_funding(deal_id: UUID, checkout_session_id: str, db: DB) -> None:
    deal_result = await db.execute(select(Deal).where(Deal.id == deal_id))
    deal = deal_result.scalar_one_or_none()

    if not deal:
        return

    transaction_result = await db.execute(
        select(Transaction).where(
            Transaction.provider_ref == checkout_session_id,
            Transaction.type == TransactionType.DEPOSIT
        )
    )

    transaction = transaction_result.scalar_one_or_none()

    if not transaction:
        return

    if transaction.status == TransactionStatus.CONFIRMED:
        return

    if deal.status != DealStatus.CREATED:
        return

    transaction.status = TransactionStatus.CONFIRMED
    deal.transition_to(DealStatus.FUNDED)

    db.add(Message(
        deal_id=deal.id,
        sender_id=None,
        type=MessageType.SYSTEM,
        body="Escrow payment was confirmed",
        attachment_url=None
    ))

    await db.commit()


async def mark_checkout_session_failed(checkout_session_id: str, db: DB) -> None:
    result = await db.execute(
        select(Transaction).where(
            Transaction.provider_ref == checkout_session_id,
            Transaction.status == TransactionStatus.PENDING
        )
    )

    transaction = result.scalar_one_or_none()

    if not transaction:
        return

    transaction.status = TransactionStatus.FAILED

    await db.commit()