from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import Field

from .base import AppSchema
from server.app.models.milestone import MilestoneStatus


class MilestoneCreate(AppSchema):
    title: str = Field(min_length=3, max_length=255)
    description: str | None = Field(default=None, max_length=1000)
    amount: Decimal = Field(gt=0, decimal_places=6)
    due_date: datetime | None = None
    # order is assigned automatically by the service layer (1-based index)


class MilestoneUpdate(AppSchema):
    """Only allowed while milestone is PENDING."""
    title: str | None = Field(default=None, min_length=3, max_length=255)
    description: str | None = Field(default=None, max_length=1000)
    due_date: datetime | None = None


class MilestoneRead(AppSchema):
    id: uuid.UUID
    deal_id: uuid.UUID
    order: int
    title: str
    description: str | None
    amount: Decimal
    status: MilestoneStatus
    due_date: datetime | None
    created_at: datetime
    updated_at: datetime
