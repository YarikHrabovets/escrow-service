from enum import Enum
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, Text, Boolean, DateTime, ForeignKey, Numeric, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid

from server.app.core.database import Base


class DealStatus(str, Enum):
    CREATED = "CREATED"
    FUNDED = "FUNDED"
    IN_PROGRESS = "IN_PROGRESS"
    SUBMITTED = "SUBMITTED"
    COMPLETED = "COMPLETED"
    DISPUTED = "DISPUTED"
    REFUNDED = "REFUNDED"


# Valid state machine transitions
DEAL_TRANSITIONS: dict[DealStatus, list[DealStatus]] = {
    DealStatus.CREATED: [DealStatus.FUNDED, DealStatus.REFUNDED],
    DealStatus.FUNDED: [DealStatus.IN_PROGRESS, DealStatus.REFUNDED],
    DealStatus.IN_PROGRESS: [DealStatus.SUBMITTED, DealStatus.DISPUTED],
    DealStatus.SUBMITTED: [DealStatus.COMPLETED, DealStatus.DISPUTED],
    DealStatus.COMPLETED: [],
    DealStatus.DISPUTED: [DealStatus.COMPLETED, DealStatus.REFUNDED],
    DealStatus.REFUNDED: [],
}


class Deal(Base):
    __tablename__ = "deals"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Parties
    client_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    freelancer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    # Content
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)

    # Financials
    amount: Mapped[Decimal] = mapped_column(Numeric(18, 6), nullable=False)
    currency: Mapped[str] = mapped_column(String(10), nullable=False, default="USD")
    platform_fee: Mapped[Decimal] = mapped_column(Numeric(18, 6), nullable=False, default=Decimal("0"))

    # milestone_based flag so deal logic knows which payment flow to use
    milestone_based: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    # State
    status: Mapped[DealStatus] = mapped_column(String(20), nullable=False, default=DealStatus.CREATED, index=True)

    # Timing
    deadline: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    auto_release_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    client: Mapped["User"] = relationship(  # noqa: F821
        "User", foreign_keys=[client_id], back_populates="deals_as_client"
    )
    freelancer: Mapped["User"] = relationship(  # noqa: F821
        "User",
        foreign_keys=[freelancer_id],
        back_populates="deals_as_freelancer",
    )
    milestones: Mapped[list["Milestone"]] = relationship(  # noqa: F821
        "Milestone",
        back_populates="deal",
        order_by="Milestone.order",
        cascade="all, delete-orphan",
    )
    transactions: Mapped[list["Transaction"]] = relationship(  # noqa: F821
        "Transaction", back_populates="deal", cascade="all, delete-orphan"
    )
    messages: Mapped[list["Message"]] = relationship(  # noqa: F821
        "Message",
        back_populates="deal",
        order_by="Message.created_at",
        cascade="all, delete-orphan",
    )
    dispute: Mapped["Dispute | None"] = relationship(  # noqa: F821
        "Dispute", back_populates="deal", uselist=False, cascade="all, delete-orphan"
    )

    def can_transition_to(self, new_status: DealStatus) -> bool:
        return new_status in DEAL_TRANSITIONS.get(self.status, [])

    def transition_to(self, new_status: DealStatus) -> None:
        if not self.can_transition_to(new_status):
            raise ValueError(
                f"Invalid transition: {self.status} → {new_status}"
            )
        self.status = new_status

    def __repr__(self) -> str:
        return f"<Deal id={self.id} status={self.status} amount={self.amount}>"