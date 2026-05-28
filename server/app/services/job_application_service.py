from decimal import Decimal
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload

from app.dependencies.auth import CurrentUser, DB
from app.models.deal import Deal, DealStatus
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


async def get_my_job_application(job_id: UUID, current_user: CurrentUser, db: DB) -> JobApplicationRead | None:
    if current_user.role != UserRole.FREELANCER:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only freelancers can check their job application")

    job_result = await db.execute(select(Job).where(Job.id == job_id))
    job = job_result.scalar_one_or_none()

    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    result = await db.execute(
        select(JobApplication)
        .where(
            JobApplication.job_id == job_id,
            JobApplication.freelancer_id == current_user.id,
        )
        .options(selectinload(JobApplication.freelancer))
    )

    application = result.scalar_one_or_none()

    if not application:
        return None

    return JobApplicationRead.model_validate(application)


async def accept_job_application(job_id: UUID, application_id: UUID, current_user: CurrentUser, db: DB) -> JobApplicationRead:
    if current_user.role != UserRole.CLIENT:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only clients can accept applications")

    job_result = await db.execute(select(Job).where(Job.id == job_id))
    job = job_result.scalar_one_or_none()

    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")

    if job.client_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the job owner can accept applications")

    if job.status != JobStatus.OPEN:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Job is not open")

    application_result = await db.execute(
        select(JobApplication).where(
            JobApplication.id == application_id,
            JobApplication.job_id == job_id
        )
    )
    application = application_result.scalar_one_or_none()

    if not application:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")

    if application.status != JobApplicationStatus.PENDING:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only pending applications can be accepted")

    deal_amount = application.proposed_amount or job.budget
    platform_fee = deal_amount * Decimal("0.05")

    deal = Deal(
        job_id=job.id,
        client_id=job.client_id,
        freelancer_id=application.freelancer_id,
        title=job.title,
        description=job.description,
        amount=deal_amount,
        currency=job.currency,
        platform_fee=platform_fee,
        deadline=job.deadline,
        milestone_based=False,
        status=DealStatus.CREATED
    )

    application.status = JobApplicationStatus.ACCEPTED
    job.status = JobStatus.CLOSED

    other_applications_result = await db.execute(
        select(JobApplication).where(
            JobApplication.job_id == job_id,
            JobApplication.id != application_id,
            JobApplication.status == JobApplicationStatus.PENDING
        )
    )

    other_applications = other_applications_result.scalars().all()

    for other_application in other_applications:
        other_application.status = JobApplicationStatus.REJECTED

    db.add(deal)

    await db.commit()

    result = await db.execute(
        select(JobApplication)
        .where(JobApplication.id == application_id)
        .options(selectinload(JobApplication.freelancer))
    )

    application = result.scalar_one()

    return JobApplicationRead.model_validate(application)