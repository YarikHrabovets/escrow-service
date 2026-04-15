import uuid
from datetime import datetime
from pydantic import Field

from .base import AppSchema


class DisputeEvidenceCreate(AppSchema):
    file_url: str = Field(max_length=500)
    description: str | None = Field(default=None, max_length=1000)


class DisputeEvidenceRead(AppSchema):
    id: uuid.UUID
    dispute_id: uuid.UUID
    uploaded_by: uuid.UUID
    file_url: str
    description: str | None
    uploaded_at: datetime
