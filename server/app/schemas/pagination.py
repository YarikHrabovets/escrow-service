from typing import Generic, TypeVar
from pydantic import Field

from .base import AppSchema

T = TypeVar("T")


class PaginationParams(AppSchema):
    """Query params for any paginated endpoint."""
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.page_size


class Page(AppSchema, Generic[T]):
    """
    Generic paginated response.
    Usage:
        Page[DealSummary]
        Page[UserSummary]
    """
    items: list[T]
    total: int
    page: int
    page_size: int
    total_pages: int

    @classmethod
    def create(cls, items: list[T], total: int, params: PaginationParams) -> "Page[T]":
        import math
        return cls(
            items=items,
            total=total,
            page=params.page,
            page_size=params.page_size,
            total_pages=math.ceil(total / params.page_size) if total else 0,
        )
