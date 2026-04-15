from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import Field, model_validator

from .base import AppSchema
from .user import UserPreview
from server.app.models.message import MessageType


class MessageCreate(AppSchema):
    body: str | None = Field(default=None, max_length=5000)
    attachment_url: str | None = Field(default=None, max_length=500)
    # type defaults to TEXT; SYSTEM messages are created only by the service layer
    type: MessageType = MessageType.TEXT

    @model_validator(mode="after")
    def body_or_attachment(self) -> MessageCreate:
        if not self.body and not self.attachment_url:
            raise ValueError("Message must have either body or attachment_url")
        if self.type == MessageType.SYSTEM:
            raise ValueError("System messages cannot be created via API")
        return self


class MessageRead(AppSchema):
    id: uuid.UUID
    deal_id: uuid.UUID
    type: MessageType
    body: str | None
    attachment_url: str | None
    read_at: datetime | None
    created_at: datetime
    # None for system messages
    sender: UserPreview | None


class MessageList(AppSchema):
    """Paginated chat history."""
    items: list[MessageRead]
    total: int
    has_more: bool
