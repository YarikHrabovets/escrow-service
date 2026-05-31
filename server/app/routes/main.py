from fastapi import APIRouter
from app.routes import auth, user, deal, job, currency, payment

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(user.router)
api_router.include_router(deal.router)
api_router.include_router(job.router)
api_router.include_router(currency.router)
api_router.include_router(payment.router)