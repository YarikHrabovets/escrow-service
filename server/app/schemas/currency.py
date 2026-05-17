from enum import Enum
from .base import AppSchema

class Currency(str, Enum):
    # Traditional fiat
    USD = "USD"
    EUR = "EUR"
    GBP = "GBP"
    CHF = "CHF"
    CAD = "CAD"
    AUD = "AUD"
    NZD = "NZD"
    JPY = "JPY"
    CNY = "CNY"
    HKD = "HKD"
    SGD = "SGD"
    SEK = "SEK"
    NOK = "NOK"
    DKK = "DKK"
    PLN = "PLN"
    CZK = "CZK"
    HUF = "HUF"
    RON = "RON"
    BGN = "BGN"
    TRY = "TRY"
    UAH = "UAH"
    INR = "INR"
    AED = "AED"
    SAR = "SAR"
    ILS = "ILS"
    ZAR = "ZAR"
    BRL = "BRL"
    MXN = "MXN"

    # Crypto
    BTC = "BTC"
    ETH = "ETH"
    USDT = "USDT"
    USDC = "USDC"
    BNB = "BNB"
    SOL = "SOL"
    XRP = "XRP"
    ADA = "ADA"
    DOGE = "DOGE"
    TRX = "TRX"
    TON = "TON"
    AVAX = "AVAX"
    DOT = "DOT"
    MATIC = "MATIC"
    LTC = "LTC"


class CurrencyType(str, Enum):
    FIAT = "FIAT"
    CRYPTO = "CRYPTO"


class CurrencyRead(AppSchema):
    code: Currency
    name: str
    type: CurrencyType