from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.dependencies.auth import CurrentUser, DB
from app.models.job import Job, JobStatus
from app.models.user import UserRole
from app.schemas.job import JobCreate, JobRead, JobSummary


async def create_job(payload: JobCreate, current_user: CurrentUser, db: DB) -> JobRead:
    if current_user.role != UserRole.CLIENT:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only clients can create jobs")

    job = Job(
        client_id=current_user.id,
        title=payload.title,
        description=payload.description,
        budget=payload.budget,
        currency=payload.currency,
        deadline=payload.deadline,
        status=JobStatus.OPEN,
    )

    db.add(job)
    await db.commit()

    result = await db.execute(
        select(Job)
        .where(Job.id == job.id)
        .options(selectinload(Job.client))
    )

    job = result.scalar_one()

    return JobRead.model_validate(job)


async def get_jobs(db: DB, limit: int = 20, offset: int = 0) -> list[JobSummary]:
    result = await db.execute(
        select(Job)
        .where(Job.status == JobStatus.OPEN)
        .order_by(Job.created_at.desc())
        .limit(limit)
        .offset(offset)
    )

    jobs = result.scalars().all()

    return [JobSummary.model_validate(job) for job in jobs]