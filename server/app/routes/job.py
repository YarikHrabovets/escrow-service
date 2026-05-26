from fastapi import APIRouter, Query
from uuid import UUID

from app.dependencies.auth import CurrentUser, DB
from app.schemas.job import JobCreate, JobRead, JobSummary
from app.schemas.job_application import JobApplicationRead, JobApplicationCreate
from app.services import job_service, job_application_service

router = APIRouter(prefix="/jobs", tags=["jobs"])

@router.post("/", response_model=JobRead, status_code=201)
async def create_job(payload: JobCreate, current_user: CurrentUser, db: DB) -> JobRead:
    return await job_service.create_job(payload=payload, current_user=current_user, db=db)

@router.get("/", response_model=list[JobSummary])
async def get_jobs(db: DB, limit: int = Query(default=20, ge=1, le=100), offset: int = Query(default=0, ge=0)) -> list[JobSummary]:
    return await job_service.get_jobs(db=db, limit=limit, offset=offset)

@router.get("/{job_id}", response_model=JobRead)
async def get_job(job_id: UUID, db: DB) -> JobRead:
    return await job_service.get_job(job_id=job_id, db=db)

@router.get("/{job_id}/applications", response_model=list[JobApplicationRead])
async def get_job_applications(job_id: UUID, current_user: CurrentUser, db: DB) -> list[JobApplicationRead]:
    return await job_application_service.get_job_applications(
        job_id=job_id,
        current_user=current_user,
        db=db,
    )

@router.post("/{job_id}/applications", response_model=JobApplicationRead, status_code=201)
async def apply_for_job(job_id: UUID, payload: JobApplicationCreate, current_user: CurrentUser, db: DB) -> JobApplicationRead:
    return await job_application_service.apply_for_job(
        job_id=job_id,
        payload=payload,
        current_user=current_user,
        db=db,
    )

@router.get("/{job_id}/applications/me", response_model=JobApplicationRead | None)
async def get_my_job_application(job_id: UUID, current_user: CurrentUser, db: DB) -> JobApplicationRead | None:
    return await job_application_service.get_my_job_application(
        job_id=job_id,
        current_user=current_user,
        db=db,
    )

@router.patch("/{job_id}/applications/{application_id}/accept", response_model=JobApplicationRead)
async def accept_job_application(job_id: UUID, application_id: UUID, current_user: CurrentUser, db: DB) -> JobApplicationRead:
    return await job_application_service.accept_job_application(
        job_id=job_id,
        application_id=application_id,
        current_user=current_user,
        db=db,
    )