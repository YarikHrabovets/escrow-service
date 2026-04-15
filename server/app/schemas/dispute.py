import uuid
from datetime import datetime

from pydantic import Field

from .base import AppSchema
from .user import UserPreview
from .dispute_evidence import DisputeEvidenceRead
from server.app.models.dispute import DisputeStatus, DisputeResolution


class DisputeCreate(AppSchema):
    """Raised by either client or freelancer."""
    reason: str = Field(min_length=20, max_length=3000)


class DisputeResolve(AppSchema):
    """Admin only — resolves a dispute."""
    resolution: DisputeResolution
    # Optional admin note stored as a system message on the deal
    admin_note: str | None = Field(default=None, max_length=2000)


class DisputeRead(AppSchema):
    id: uuid.UUID
    deal_id: uuid.UUID
    reason: str
    status: DisputeStatus
    resolution: DisputeResolution | None
    created_at: datetime
    resolved_at: datetime | None
    # Nested
    raiser: UserPreview
    resolver: UserPreview | None
    evidence: list[DisputeEvidenceRead] = []


class DisputeSummary(AppSchema):
    """For admin dispute queue."""
    id: uuid.UUID
    deal_id: uuid.UUID
    status: DisputeStatus
    resolution: DisputeResolution | None
    created_at: datetime
    raiser_id: uuid.UUID