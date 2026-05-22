import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import Field

from .base import AppSchema
from .user import UserPreview
from app.models.job_application import JobApplicationStatus


class JobApplicationCreate(AppSchema):
    cover_letter: str | None = Field(default=None, max_length=5000)
    proposed_amount: Decimal | None = Field(default=None, gt=0, decimal_places=6)


class JobApplicationRead(AppSchema):
    id: uuid.UUID
    job_id: uuid.UUID
    freelancer_id: uuid.UUID
    cover_letter: str | None
    proposed_amount: Decimal | None
    status: JobApplicationStatus
    created_at: datetime
    updated_at: datetime

    freelancer: UserPreview | None = None


class JobApplicationSummary(AppSchema):
    id: uuid.UUID
    job_id: uuid.UUID
    freelancer_id: uuid.UUID
    proposed_amount: Decimal | None
    status: JobApplicationStatus
    created_at: datetime