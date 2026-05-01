import cloudinary.uploader

from fastapi import UploadFile, HTTPException, status
from app.core.cloudinary import *


async def upload_file(file: UploadFile, folder: str) -> str:
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File must be an image")

    try:
       result = cloudinary.uploader.upload(
           file.file,
           folder=folder,
           resource_type="image"
       )
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error uploading images")

    return result["secure_url"]