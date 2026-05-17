from __future__ import annotations

import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import Field

from .base import AppSchema
from .user import UserPreview
from .currency import Currency
from app.models.job import JobStatus

class JobCreate(AppSchema):
    title: str = Field(min_length=5, max_length=255)
    description: str | None = Field(default=None, max_length=5000)
    budget: Decimal = Field(gt=0, decimal_places=6)
    currency: Currency = Currency.USD
    deadline: datetime | None = None


class JobUpdate(AppSchema):
    """Only client owner can update while job is OPEN."""
    title: str | None = Field(default=None, min_length=5, max_length=255)
    description: str | None = Field(default=None, max_length=5000)
    budget: Decimal | None = Field(default=None, gt=0, decimal_places=6)
    currency: Currency | None = None
    deadline: datetime | None = None


class JobStatusUpdate(AppSchema):
    status: JobStatus


class JobRead(AppSchema):
    id: uuid.UUID
    title: str
    description: str | None
    budget: Decimal
    currency: Currency
    deadline: datetime | None
    status: JobStatus
    created_at: datetime
    updated_at: datetime

    client: UserPreview


class JobSummary(AppSchema):
    id: uuid.UUID
    title: str
    budget: Decimal
    currency: Currency
    deadline: datetime | None
    status: JobStatus
    created_at: datetime

    client_id: uuid.UUID