from enum import Enum
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, DateTime, ForeignKey, Numeric, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid

from app.core.database import Base


class TransactionType(str, Enum):
    DEPOSIT = "deposit"
    RELEASE = "release"
    REFUND = "refund"
    FEE_COLLECTION = "fee_collection"


class TransactionStatus(str, Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    FAILED = "FAILED"


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    deal_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("deals.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    # milestone_id — links a transaction to a specific milestone
    # NULL means the transaction is for the full deal (non-milestone flow)
    milestone_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("milestones.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    type: Mapped[TransactionType] = mapped_column(String(30), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(18, 6), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="USD")

    # External payment provider reference (Stripe charge ID, crypto tx hash, etc.)
    provider_ref: Mapped[str | None] = mapped_column(String(255), index=True)

    status: Mapped[TransactionStatus] = mapped_column(
        String(20), nullable=False, default=TransactionStatus.PENDING, index=True
    )

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Relationships
    deal: Mapped["Deal"] = relationship("Deal", back_populates="transactions")  # noqa: F821
    milestone: Mapped["Milestone | None"] = relationship("Milestone", back_populates="transactions") # noqa: F821

    def __repr__(self) -> str:
        return f"<Transaction id={self.id} type={self.type} amount={self.amount} status={self.status}>"
