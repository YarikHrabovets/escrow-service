from fastapi import APIRouter
from .auth import router as auth_router
from .user import router as user_router
from .deal import router as deal_router
from .job import router as job_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(user_router)
api_router.include_router(deal_router)
api_router.include_router(job_router)