from datetime import datetime, timedelta, timezone
from uuid import UUID
import jwt
import bcrypt
from app.core.config import settings


def _now() -> datetime:
    return datetime.now(timezone.utc)


def create_access_token(user_id: UUID, role: str) -> str:
    payload = {
        "sub": str(user_id),
        "role": role,
        "type": "access",
        "iat": _now(),
        "exp": _now() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    }

    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_refresh_token(user_id: UUID) -> str:
    payload = {
        "sub": str(user_id),
        "type": "refresh",
        "iat": _now(),
        "exp": _now() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    }

    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_token(token: str) -> dict:
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())
