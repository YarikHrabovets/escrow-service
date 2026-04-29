from fastapi import APIRouter, Request, Response, HTTPException, status
from app.schemas.auth import LoginRequest, TokenResponse, TokenRefreshResponse
from app.schemas.user import UserCreate
from app.dependencies.auth import DB
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse)
async def register(data: UserCreate, request: Request, response: Response, db: DB) -> TokenResponse:
    result = await auth_service.register_user(
        data=data,
        db=db,
        request_ip=request.client.host if request.client else None
    )

    response.set_cookie(
        key="refresh_token",
        value=result.get("refresh_token"),
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=7 * 24 * 60 * 60,
        path="/auth/refresh"
    )

    return TokenResponse(
        access_token=result.get("access_token"),
        user=result.get("user")
    )


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, request: Request, response: Response, db: DB) -> TokenResponse:
    result = await auth_service.login_user(
        data=data,
        db=db,
        request_ip=request.client.host if request.client else None
    )

    response.set_cookie(
        key="refresh_token",
        value=result.get("refresh_token"),
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=7 * 24 * 60 * 60,
        path="/auth/refresh"
    )

    return TokenResponse(
        access_token=result.get("access_token"),
        user=result.get("user")
    )



@router.post("/refresh", response_model=TokenRefreshResponse)
async def refresh(request: Request, db: DB) -> TokenRefreshResponse:
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No refresh token")

    return await auth_service.refresh_tokens(refresh_token, db)

@router.post("/logout")
async def logout(response: Response) -> dict:
    response.delete_cookie("refresh_token", path="/auth/refresh")
    return {"detail": "success"}
