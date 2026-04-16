from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import Field, model_validator

from .base import AppSchema
from .user import UserPreview
from .milestone import MilestoneRead
from app.models.deal import DealStatus


class DealCreate(AppSchema):
    freelancer_id: uuid.UUID
    title: str = Field(min_length=5, max_length=255)
    description: str | None = Field(default=None, max_length=5000)
    amount: Decimal = Field(gt=0, decimal_places=6)
    currency: str = Field(default="USD", max_length=10)
    deadline: datetime | None = None
    milestone_based: bool = False
    # If milestone_based=True, milestones must be provided
    milestones: list["MilestoneCreate"] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_milestones(self) -> DealCreate:
        if self.milestone_based and not self.milestones:
            raise ValueError("Milestone-based deals must include at least one milestone")
        if not self.milestone_based and self.milestones:
            raise ValueError("Non-milestone deals should not include milestones")
        if self.milestone_based:
            total = sum(m.amount for m in self.milestones)
            if total != self.amount:
                raise ValueError(
                    f"Milestone amounts ({total}) must sum to deal amount ({self.amount})"
                )
        return self


class DealUpdate(AppSchema):
    """Only allowed before deal is FUNDED."""
    title: str | None = Field(default=None, min_length=5, max_length=255)
    description: str | None = Field(default=None, max_length=5000)
    deadline: datetime | None = None


class DealStatusUpdate(AppSchema):
    """Explicit status transition — validated against state machine in service layer."""
    status: DealStatus


class DealRead(AppSchema):
    id: uuid.UUID
    title: str
    description: str | None
    amount: Decimal
    currency: str
    platform_fee: Decimal
    status: DealStatus
    milestone_based: bool
    deadline: datetime | None
    auto_release_at: datetime | None
    created_at: datetime
    updated_at: datetime
    # Nested
    client: UserPreview
    freelancer: UserPreview
    milestones: list[MilestoneRead] = []


class DealSummary(AppSchema):
    """Lightweight — for dashboard lists."""
    id: uuid.UUID
    title: str
    amount: Decimal
    currency: str
    status: DealStatus
    milestone_based: bool
    deadline: datetime | None
    created_at: datetime
    # Only IDs on summary — no nested objects for performance
    client_id: uuid.UUID
    freelancer_id: uuid.UUID


# Import fix for forward ref
from .milestone import MilestoneCreate
DealCreate.model_rebuild()
