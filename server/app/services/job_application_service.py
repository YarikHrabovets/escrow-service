from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload

from app.dependencies.auth import CurrentUser, DB
from app.models.job import Job, JobStatus
from app.models.job_application import JobApplication, JobApplicationStatus
from app.models.user import UserRole
from app.schemas.job_application import JobApplicationCreate, JobApplicationRead


async def get_job_applications(job_id: UUID, current_user: CurrentUser, db: DB) -> list[JobApplicationRead]:
    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()

    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    if job.client_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the client who created this job can view applications")

    result = await db.execute(
        select(JobApplication)
        .where(JobApplication.job_id == job_id)
        .options(selectinload(JobApplication.freelancer))
        .order_by(JobApplication.created_at.desc())
    )

    applications = result.scalars().all()

    return [JobApplicationRead.model_validate(application) for application in applications]


async def apply_for_job(job_id: UUID, payload: JobApplicationCreate, current_user: CurrentUser, db: DB) -> JobApplicationRead:
    if current_user.role != UserRole.FREELANCER:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only freelancers can apply for jobs")

    result = await db.execute(select(Job).where(Job.id == job_id))
    job = result.scalar_one_or_none()

    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    if job.status != JobStatus.OPEN:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Job is not open for applications")

    if job.client_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot apply to your own job")

    application = JobApplication(
        job_id=job.id,
        freelancer_id=current_user.id,
        cover_letter=payload.cover_letter,
        proposed_amount=payload.proposed_amount,
        status=JobApplicationStatus.PENDING,
    )

    db.add(application)

    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="You have already applied for this job")

    result = await db.execute(
        select(JobApplication)
        .where(JobApplication.id == application.id)
        .options(selectinload(JobApplication.freelancer))
    )

    application = result.scalar_one()

    return JobApplicationRead.model_validate(application)