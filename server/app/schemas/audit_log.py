import uuid
from datetime import datetime

from .base import AppSchema
from .user import UserPreview


class AuditLogRead(AppSchema):
    id: uuid.UUID
    entity_type: str
    entity_id: uuid.UUID
    action: str
    meta: dict | None
    ip_address: str | None
    created_at: datetime
    actor: UserPreview


class AuditLogList(AppSchema):
    items: list[AuditLogRead]
    total: int
    