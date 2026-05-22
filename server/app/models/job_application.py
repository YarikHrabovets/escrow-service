from enum import Enum
from datetime import datetime
from decimal import Decimal
import uuid

from sqlalchemy import String, Text, DateTime, ForeignKey, Numeric, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class JobApplicationStatus(str, Enum):
    PENDING = "PENDING"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    WITHDRAWN = "WITHDRAWN"


class JobApplication(Base):
    __tablename__ = "job_applications"

    __table_args__ = (
        UniqueConstraint("job_id", "freelancer_id", name="uq_job_application_job_freelancer"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    job_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("jobs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    freelancer_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    cover_letter: Mapped[str | None] = mapped_column(Text)
    proposed_amount: Mapped[Decimal | None] = mapped_column(Numeric(18, 6))

    status: Mapped[JobApplicationStatus] = mapped_column(
        String(20),
        nullable=False,
        default=JobApplicationStatus.PENDING,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    job: Mapped["Job"] = relationship("Job", back_populates="applications")  # noqa: F821

    freelancer: Mapped["User"] = relationship(  # noqa: F821
        "User",
        foreign_keys=[freelancer_id],
        back_populates="job_applications",
    )

    def __repr__(self) -> str:
        return f"<JobApplication job={self.job_id} freelancer={self.freelancer_id} status={self.status}>"