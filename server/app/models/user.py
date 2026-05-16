from enum import Enum
from datetime import datetime
from sqlalchemy import String, Integer, Float, Boolean, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
import uuid

from app.core.database import Base

class UserRole(str, Enum):
    CLIENT = "client"
    FREELANCER = "freelancer"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(String(50), nullable=False, default=UserRole.CLIENT)

    # Profile
    username: Mapped[str | None] = mapped_column(String(100), unique=True, index=True)
    full_name: Mapped[str | None] = mapped_column(String(255))
    avatar_url: Mapped[str | None] = mapped_column(String(500))

    # Reputation — source of truth counters; dispute_rate is a @property
    reputation_score: Mapped[float] = mapped_column(Float, nullable=False, default=5.0)
    completed_deals: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    disputed_deals: Mapped[int] = mapped_column(Integer, nullable=False, default=0)

    # Security / Anti-fraud
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    is_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    device_fingerprint: Mapped[dict | None] = mapped_column(JSONB)
    last_ip: Mapped[str | None] = mapped_column(String(45))  # IPv6-safe
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    jobs: Mapped[list["Job"]] = relationship( # noqa: F821
        "Job",
        back_populates="client",
        cascade="all, delete-orphan",
    )

    deals_as_client: Mapped[list["Deal"]] = relationship( # noqa: F821
        "Deal",
        foreign_keys="Deal.client_id",
        back_populates="client"
    )
    deals_as_freelancer: Mapped[list["Deal"]] = relationship( # noqa: F821
        "Deal",
        foreign_keys="Deal.freelancer_id",
        back_populates="freelancer"
    )
    messages_sent: Mapped[list["Message"]] = relationship( # noqa: F821
        "Message", back_populates="sender"
    )
    disputes_raised: Mapped[list["Dispute"]] = relationship(  # noqa: F821
        "Dispute",
        foreign_keys="Dispute.raised_by",
        back_populates="raiser"
    )
    disputes_resolved: Mapped[list["Dispute"]] = relationship(  # noqa: F821
        "Dispute",
        foreign_keys="Dispute.resolved_by",
        back_populates="resolver"
    )
    audit_logs: Mapped[list["AuditLog"]] = relationship(  # noqa: F821
        "AuditLog", back_populates="actor"
    )
    notifications: Mapped[list["Notification"]] = relationship(  # noqa: F821
        "Notification", back_populates="user"
    )

    @property
    def dispute_rate(self) -> float:
        if self.completed_deals == 0:
            return 0.0
        return round(self.disputed_deals / self.completed_deals * 100, 1)

    def __repr__(self) -> str:
        return f"<User id={self.id} email={self.email} role={self.role}>"
