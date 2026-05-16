from fastapi import APIRouter, Query

from app.dependencies.auth import CurrentUser, DB
from app.schemas.job import JobCreate, JobRead, JobSummary
from app.services import job_service

router = APIRouter(prefix="/job", tags=["jobs"])

@router.post("/", response_model=JobRead, status_code=201)
async def create_job(payload: JobCreate, current_user: CurrentUser, db: DB) -> JobRead:
    return await job_service.create_job(payload=payload, current_user=current_user, db=db)

@router.get("/", response_model=list[JobSummary])
async def get_jobs(db: DB, limit: int = Query(default=20, ge=1, le=100), offset: int = Query(default=0, ge=0)) -> list[JobSummary]:
    return await job_service.get_jobs(db=db, limit=limit, offset=offset)