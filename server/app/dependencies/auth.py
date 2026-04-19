from typing import Annotated
from uuid import UUID

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.security import decode_token
from app.models.user import User, UserRole

bearer = HTTPBearer()


async def get_current_user(credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer)], db: Annotated[AsyncSession, Depends(get_session)]) -> User:
    token = credentials.credentials
    try:
        payload = decode_token(token)
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    if payload.get("type") != "access":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Wrong token type")

    user_id: str = payload.get("sub")
    result = await db.execute(select(User).where(User.id == UUID(user_id)))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated")

    return user


def require_role(*roles: UserRole):
    """
    Usage:
        Depends(require_role(UserRole.ADMIN))
        Depends(require_role(UserRole.CLIENT, UserRole.ADMIN))
    """
    async def guard(current_user: Annotated[User, Depends(get_current_user)]) -> User:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires role: {[r.value for r in roles]}",
            )
        return current_user
    return guard


# Typed aliases (cleaner route signatures)
CurrentUser = Annotated[User, Depends(get_current_user)]
DB = Annotated[AsyncSession, Depends(get_session)]
AdminUser = Annotated[User, Depends(require_role(UserRole.ADMIN))]