from .base import AppSchema


class CheckoutSessionRead(AppSchema):
    checkout_url: str