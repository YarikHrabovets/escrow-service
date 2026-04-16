from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import EmailStr, Field, field_validator, model_validator

from .base import AppSchema
from app.models.user import UserRole


class UserPreview(AppSchema):
    """Lightweight — used inside DealRead, MessageRead, etc."""
    id: uuid.UUID
    username: str | None
    full_name: str | None
    avatar_url: str | None
    role: UserRole
    reputation_score: float
    completed_deals: int


class UserCreate(AppSchema):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    role: UserRole = UserRole.CLIENT
    username: str | None = Field(default=None, min_length=3, max_length=100)
    full_name: str | None = Field(default=None, max_length=255)

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v

    @field_validator("username")
    @classmethod
    def username_no_spaces(cls, v: str | None) -> str | None:
        if v and " " in v:
            raise ValueError("Username cannot contain spaces")
        return v


class UserUpdate(AppSchema):
    """All fields optional — only provided fields are updated."""
    username: str | None = Field(default=None, min_length=3, max_length=100)
    full_name: str | None = Field(default=None, max_length=255)
    avatar_url: str | None = Field(default=None, max_length=500)


class UserUpdatePassword(AppSchema):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)

    @model_validator(mode="after")
    def passwords_differ(self) -> UserUpdatePassword:
        if self.current_password == self.new_password:
            raise ValueError("New password must differ from current password")
        return self


class UserRead(AppSchema):
    id: uuid.UUID
    email: EmailStr
    role: UserRole
    username: str | None
    full_name: str | None
    avatar_url: str | None
    reputation_score: float
    completed_deals: int
    disputed_deals: int
    dispute_rate: float  # @property on the ORM model
    is_active: bool
    is_verified: bool
    created_at: datetime
    updated_at: datetime


class UserSummary(AppSchema):
    """For admin lists and search results."""
    id: uuid.UUID
    email: EmailStr
    role: UserRole
    username: str | None
    reputation_score: float
    completed_deals: int
    is_active: bool
    is_verified: bool
    created_at: datetime
