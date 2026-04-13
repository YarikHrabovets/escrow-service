from enum import Enum
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, Integer, DateTime, ForeignKey, Numeric, func, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid

from server.app.core.database import Base


class MilestoneStatus(str, Enum):
    PENDING = "PENDING"
    FUNDED = "FUNDED"
    COMPLETED = "COMPLETED"
    REFUNDED = "REFUNDED"


class Milestone(Base):
    __tablename__ = "milestones"
    __table_args__ = (
        # Enforce unique ordering per deal at DB level
        UniqueConstraint("deal_id", "order", name="uq_milestone_deal_order"),
    )

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    deal_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("deals.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # order column critical for milestone sequencing
    order: Mapped[int] = mapped_column(Integer, nullable=False)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(String(1000))
    amount: Mapped[Decimal] = mapped_column(Numeric(18, 6), nullable=False)
    status: Mapped[MilestoneStatus] = mapped_column(String(20), nullable=False, default=MilestoneStatus.PENDING)
    due_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    deal: Mapped["Deal"] = relationship("Deal", back_populates="milestones")  # noqa: F821
    transactions: Mapped[list["Transaction"]] = relationship("Transaction", back_populates="milestone") # noqa: F821

    def __repr__(self) -> str:
        return f"<Milestone id={self.id} order={self.order} status={self.status} amount={self.amount}>"
    