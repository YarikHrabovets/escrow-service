from enum import Enum
from datetime import datetime
from sqlalchemy import String, Text, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid

from app.core.database import Base


class DisputeStatus(str, Enum):
    OPEN = "OPEN"
    RESOLVED = "RESOLVED"
    ESCALATED = "ESCALATED"


class DisputeResolution(str, Enum):
    FREELANCER_WINS = "freelancer_wins"
    CLIENT_WINS = "client_wins"
    SPLIT = "split"


class Dispute(Base):
    __tablename__ = "disputes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    deal_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("deals.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    raised_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
    )

    reason: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[DisputeStatus] = mapped_column(String(20), nullable=False, default=DisputeStatus.OPEN, index=True)
    resolution: Mapped[DisputeResolution | None] = mapped_column(String(30), nullable=True)
    resolved_by: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # Relationships
    deal: Mapped["Deal"] = relationship("Deal", back_populates="dispute")  # noqa: F821
    raiser: Mapped["User"] = relationship(  # noqa: F821
        "User",
        foreign_keys=[raised_by],
        back_populates="disputes_raised",
    )
    resolver: Mapped["User | None"] = relationship(  # noqa: F821
        "User",
        foreign_keys=[resolved_by],
        back_populates="disputes_resolved",
    )
    evidence: Mapped[list["DisputeEvidence"]] = relationship(  # noqa: F821
        "DisputeEvidence",
        back_populates="dispute",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Dispute id={self.id} status={self.status} deal_id={self.deal_id}>"
    