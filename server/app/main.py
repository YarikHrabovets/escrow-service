from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.main import api_router

app = FastAPI(title="api.escrow.net")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)
app.include_router(api_router)

@app.get("/health", tags=["health"])
async def health() -> dict:
    return {"status": "ok", "message": "service is healthy"}
