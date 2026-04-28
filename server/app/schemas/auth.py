from pydantic import EmailStr

from .base import AppSchema
from .user import UserRead


class LoginRequest(AppSchema):
    email: EmailStr
    password: str


class TokenResponse(AppSchema):
    access_token: str
    token_type: str = "bearer"
    user: UserRead


class TokenRefreshResponse(AppSchema):
    access_token: str
    token_type: str = "bearer"
    