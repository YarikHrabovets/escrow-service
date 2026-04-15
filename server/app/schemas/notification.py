import uuid
from datetime import datetime

from .base import AppSchema
from server.app.models.notification import NotificationType


class NotificationRead(AppSchema):
    id: uuid.UUID
    type: NotificationType
    payload: dict | None
    is_read: bool          # @property on ORM model
    read_at: datetime | None
    created_at: datetime


class NotificationList(AppSchema):
    items: list[NotificationRead]
    unread_count: int
