from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.models.user import User, UserRole
from app.schemas.auth import LoginRequest, TokenRefreshResponse
from app.schemas.user import UserCreate, UserRead, RegisterRole
from app.core.security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password
import jwt
from datetime import datetime, timezone
from uuid import UUID


async def register_user(data: UserCreate, db: AsyncSession, request_ip: str | None = None) -> dict:
    existing = await db.execute(select(User).where(User.email == data.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    if data.username:
        taken = await db.execute(select(User).where(User.username == data.username))
        if taken.scalar_one_or_none():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already taken")

    if data.role == RegisterRole.CLIENT:
        role = UserRole.CLIENT
    elif data.role == RegisterRole.FREELANCER:
        role = UserRole.FREELANCER
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role")

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        role=role,
        username=data.username,
        full_name=data.full_name,
        last_ip=request_ip,
    )

    db.add(user)

    await db.commit()
    await db.refresh(user)

    return {
        "access_token": create_access_token(user.id, user.role),
        "refresh_token": create_refresh_token(user.id),
        "user": UserRead.model_validate(user)
    }


async def login_user(data: LoginRequest, db: AsyncSession, request_ip: str | None = None) -> dict:
    query = await db.execute(select(User).where(User.email == data.email))
    user = query.scalar_one_or_none()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated")

    user.last_ip = request_ip
    user.last_login_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(user)

    return {
        "access_token": create_access_token(user.id, user.role),
        "refresh_token": create_refresh_token(user.id),
        "user": UserRead.model_validate(user)
    }


async def refresh_tokens(refresh_token: str, db: AsyncSession, request_ip: str | None = None) -> TokenRefreshResponse:
    try:
        payload = decode_token(refresh_token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    if payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong token type")

    query = await db.execute(select(User).where(User.id == UUID(payload["sub"])))
    user = query.scalar_one_or_none()

    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")

    return TokenRefreshResponse(access_token=create_access_token(user.id, user.role))
