import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import Field

from .base import AppSchema
from app.models.transaction import TransactionType, TransactionStatus


class TransactionCreate(AppSchema):
    """
    Created internally by the service layer — not directly by the user.
    Exposed here for admin/internal use.
    """
    deal_id: uuid.UUID
    milestone_id: uuid.UUID | None = None   # None = full-deal payment
    type: TransactionType
    amount: Decimal = Field(gt=0, decimal_places=6)
    currency: str = Field(default="USD", max_length=10)
    provider_ref: str | None = Field(default=None, max_length=255)


class TransactionRead(AppSchema):
    id: uuid.UUID
    deal_id: uuid.UUID
    milestone_id: uuid.UUID | None
    type: TransactionType
    amount: Decimal
    currency: str
    provider_ref: str | None
    status: TransactionStatus
    created_at: datetime


class TransactionSummary(AppSchema):
    """For deal detail page — shows payment history."""
    id: uuid.UUID
    type: TransactionType
    amount: Decimal
    currency: str
    status: TransactionStatus
    milestone_id: uuid.UUID | None
    created_at: datetime
