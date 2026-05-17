from app.schemas.currency import Currency, CurrencyRead, CurrencyType


FIAT_CURRENCIES: dict[Currency, str] = {
    Currency.USD: "US Dollar",
    Currency.EUR: "Euro",
    Currency.GBP: "British Pound",
    Currency.CHF: "Swiss Franc",
    Currency.CAD: "Canadian Dollar",
    Currency.AUD: "Australian Dollar",
    Currency.NZD: "New Zealand Dollar",
    Currency.JPY: "Japanese Yen",
    Currency.CNY: "Chinese Yuan",
    Currency.HKD: "Hong Kong Dollar",
    Currency.SGD: "Singapore Dollar",
    Currency.SEK: "Swedish Krona",
    Currency.NOK: "Norwegian Krone",
    Currency.DKK: "Danish Krone",
    Currency.PLN: "Polish Zloty",
    Currency.CZK: "Czech Koruna",
    Currency.HUF: "Hungarian Forint",
    Currency.RON: "Romanian Leu",
    Currency.BGN: "Bulgarian Lev",
    Currency.TRY: "Turkish Lira",
    Currency.UAH: "Ukrainian Hryvnia",
    Currency.INR: "Indian Rupee",
    Currency.AED: "UAE Dirham",
    Currency.SAR: "Saudi Riyal",
    Currency.ILS: "Israeli Shekel",
    Currency.ZAR: "South African Rand",
    Currency.BRL: "Brazilian Real",
    Currency.MXN: "Mexican Peso",
}

CRYPTO_CURRENCIES: dict[Currency, str] = {
    Currency.BTC: "Bitcoin",
    Currency.ETH: "Ethereum",
    Currency.USDT: "Tether",
    Currency.USDC: "USD Coin",
    Currency.BNB: "BNB",
    Currency.SOL: "Solana",
    Currency.XRP: "XRP",
    Currency.ADA: "Cardano",
    Currency.DOGE: "Dogecoin",
    Currency.TRX: "TRON",
    Currency.TON: "Toncoin",
    Currency.AVAX: "Avalanche",
    Currency.DOT: "Polkadot",
    Currency.MATIC: "Polygon",
    Currency.LTC: "Litecoin",
}


async def get_available_currencies() -> list[CurrencyRead]:
    fiat = [
        CurrencyRead(code=code, name=name, type=CurrencyType.FIAT)
        for code, name in FIAT_CURRENCIES.items()
    ]

    crypto = [
        CurrencyRead(code=code, name=name, type=CurrencyType.CRYPTO)
        for code, name in CRYPTO_CURRENCIES.items()
    ]

    return fiat + crypto