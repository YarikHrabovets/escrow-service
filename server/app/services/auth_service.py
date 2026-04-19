from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.models.user import User
from app.models.audit_log import AuditLog
from app.schemas.auth import LoginRequest, TokenResponse, RefreshRequest, TokenRefreshResponse
from app.schemas.user import UserCreate, UserRead
from app.core.security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password
import jwt
from datetime import datetime, timezone
from uuid import UUID


async def register_user(data: UserCreate, db: AsyncSession, request_ip: str | None = None) -> TokenResponse:
    existing = await db.execute(select(User).where(User.email == data.email))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    if data.username:
        taken = await db.execute(select(User).where(User.username == data.username))
        if taken.scalar_one_or_none():
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already taken")

    user = User(
        email=data.email,
        password_hash=hash_password(data.password),
        role=data.role,
        username=data.username,
        full_name=data.full_name,
        last_ip=request_ip,
    )

    db.add(user)
    await db.flush()

    db.add(AuditLog(
        actor_id=user.id,
        entity_type="user",
        entity_id=user.id,
        action="user.registered",
        meta={"role": user.role.value},
        ip_address=request_ip,
    ))

    await db.commit()
    await db.refresh(user)

    return TokenResponse(
        access_token=create_access_token(user.id, user.role),
        refresh_token=create_refresh_token(user.id),
        user=UserRead.model_validate(user),
    )


async def login_user(data: UserCreate, db: AsyncSession, request_ip: str | None = None) -> TokenResponse:
    query = await db.execute(select(User).where(User.email == data.email))
    user = query.scalar_one_or_none()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated")

    user.last_ip = request_ip
    user.last_login_at = datetime.now(timezone.utc)

    db.add(AuditLog(
        actor_id=user.id,
        entity_type="user",
        entity_id=user.id,
        action="user.login",
        ip_address=request_ip,
    ))

    await db.commit()
    await db.refresh(user)

    return TokenResponse(
        access_token=create_access_token(user.id, user.role),
        refresh_token=create_refresh_token(user.id),
        user=UserRead.model_validate(user),
    )


async def refresh_tokens(data: UserCreate, db: AsyncSession, request_ip: str | None = None) -> TokenResponse:
    try:
        payload = decode_token(data.refresh_token)
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
