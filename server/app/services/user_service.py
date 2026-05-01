from fastapi import UploadFile
from app.schemas.user import UserRead, UserUpdate
from app.dependencies.auth import CurrentUser, DB
from .cloudinary import upload_file

ALLOWED_FIELDS = ("username", "full_name", "avatar_url")

async def update_user(
        username: str | None, full_name: str | None, avatar: UploadFile | None,
        current_user: CurrentUser, db: DB
) -> UserRead:
    payload = UserUpdate(
        username=username,
        full_name=full_name,
        avatar_url=None
    )

    update_data = payload.model_dump(exclude_unset=True)

    if avatar:
        update_data["avatar_url"] = await upload_file(avatar, "avatars")

    for field, value in update_data.items():
        if field not in ALLOWED_FIELDS:
            continue
        if value is not None:
            setattr(current_user, field, value)

    await db.commit()
    await db.refresh(current_user)

    return UserRead.model_validate(current_user)