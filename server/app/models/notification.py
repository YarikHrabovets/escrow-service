from enum import Enum
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid

from server.app.core.database import Base


class NotificationType(str, Enum):
    DEAL_CREATED = "deal.created"
    DEAL_FUNDED = "deal.funded"
    DEAL_STATUS_CHANGED = "deal.status_changed"
    DEAL_AUTO_RELEASE_SOON = "deal.auto_release_soon"
    MILESTONE_COMPLETED = "milestone.completed"
    DISPUTE_OPENED = "dispute.opened"
    DISPUTE_RESOLVED = "dispute.resolved"
    MESSAGE_RECEIVED = "message.received"
    PAYMENT_CONFIRMED = "payment.confirmed"


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    type: Mapped[NotificationType] = mapped_column(String(50), nullable=False, index=True)
    # Flexible payload: {"deal_id": "...", "message": "Your deal was funded"}
    payload: Mapped[dict | None] = mapped_column(JSONB)

    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="notifications")  # noqa: F821

    @property
    def is_read(self) -> bool:
        return self.read_at is not None

    def __repr__(self) -> str:
        return f"<Notification id={self.id} type={self.type} user={self.user_id}>"
