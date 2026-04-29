from fastapi import APIRouter
from app.schemas.user import UserRead
from app.dependencies.auth import CurrentUser

router = APIRouter(prefix="/user", tags=["user"])

@router.get("/me", response_model=UserRead)
async def fetch_me(current_user: CurrentUser) -> UserRead:
    return UserRead.model_validate(current_user)
