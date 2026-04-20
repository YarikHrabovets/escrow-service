from fastapi import APIRouter, Request
from app.schemas.auth import LoginRequest, RefreshRequest, TokenResponse, TokenRefreshResponse
from app.schemas.user import UserCreate, UserRead
from app.dependencies.auth import CurrentUser, DB
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
async def register(data: UserCreate, request: Request, db: DB) -> TokenResponse:
    return await auth_service.register_user(
        data=data,
        db=db,
        request_ip=request.client.host if request.client else None
    )


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, request: Request, db: DB) -> TokenResponse:
    return await auth_service.login_user(
        data=data,
        db=db,
        request_ip=request.client.host if request.client else None
    )


@router.post("/refresh", response_model=TokenRefreshResponse)
async def refresh(data: RefreshRequest, db: DB) -> TokenRefreshResponse:
    return await auth_service.refresh_tokens(data=data, db=db)
