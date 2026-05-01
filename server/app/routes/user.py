from fastapi import APIRouter, Form, UploadFile, File
from app.schemas.user import UserRead
from app.dependencies.auth import CurrentUser, DB
from app.services import user_service

router = APIRouter(prefix="/user", tags=["user"])

@router.get("/me", response_model=UserRead)
async def fetch_me(current_user: CurrentUser) -> UserRead:
    return UserRead.model_validate(current_user)

@router.patch("/me", response_model=UserRead)
async def update_me(
    current_user: CurrentUser, db: DB, username: str | None = Form(None),
    full_name: str | None = Form(None), avatar: UploadFile | None = File(None)
) -> UserRead:
    return await user_service.update_user(
        username=username,
        full_name=full_name,
        avatar=avatar,
        current_user=current_user,
        db=db
    )