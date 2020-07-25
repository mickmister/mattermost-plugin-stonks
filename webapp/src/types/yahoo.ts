export interface Quote {
    language: string;
    region: string;
    quoteType: string;
    quoteSourceName: string;
    triggerable: boolean;
    currency: string;
    exchange: string;
    shortName: string;
    longName: string;
    messageBoardId: string;
    exchangeTimezoneName: string;
    exchangeTimezoneShortName: string;
    gmtOffSetMilliseconds: number;
    market: string;
    esgPopulated: boolean;
    tradeable: boolean;
    firstTradeDateMilliseconds: number;
    priceHint: number;
    postMarketChangePercent: number;
    postMarketTime: number;
    postMarketPrice: number;
    postMarketChange: number;
    regularMarketChange: number;
    regularMarketChangePercent: number;
    regularMarketTime: number;
    regularMarketPrice: number;
    regularMarketDayHigh: number;
    regularMarketDayRange: string;
    regularMarketDayLow: number;
    regularMarketVolume: number;
    regularMarketPreviousClose: number;
    bid: number;
    ask: number;
    bidSize: number;
    askSize: number;
    fullExchangeName: string;
    financialCurrency: string;
    regularMarketOpen: number;
    averageDailyVolume3Month: number;
    averageDailyVolume10Day: number;
    fiftyTwoWeekLowChange: number;
    fiftyTwoWeekLowChangePercent: number;
    fiftyTwoWeekRange: string;
    fiftyTwoWeekHighChange: number;
    fiftyTwoWeekHighChangePercent: number;
    fiftyTwoWeekLow: number;
    fiftyTwoWeekHigh: number;
    dividendDate: number;
    earningsTimestamp: number;
    earningsTimestampStart: number;
    earningsTimestampEnd: number;
    trailingAnnualDividendRate: number;
    trailingAnnualDividendYield: number;
    epsTrailingTwelveMonths: number;
    epsForward: number;
    sharesOutstanding: number;
    bookValue: number;
    fiftyDayAverage: number;
    fiftyDayAverageChange: number;
    fiftyDayAverageChangePercent: number;
    twoHundredDayAverage: number;
    twoHundredDayAverageChange: number;
    twoHundredDayAverageChangePercent: number;
    marketCap: number;
    forwardPE: number;
    priceToBook: number;
    sourceInterval: number;
    exchangeDataDelayedBy: number;
    marketState: string;
    displayName: string;
    symbol: string;
}

export interface PercentChange {
    raw: number;
    fmt: string;
}

export interface OpenInterest {
    raw: number;
    fmt: string;
    longFmt: string;
}

export interface Strike {
    raw: number;
    fmt: string;
}

export interface Change {
    raw: number;
    fmt: string;
}

export interface ImpliedVolatility {
    raw: number;
    fmt: string;
}

export interface Ask {
    raw: number;
    fmt: string;
}

export interface LastTradeDate {
    raw: number;
    fmt: string;
    longFmt: string;
}

export interface Expiration {
    raw: number;
    fmt: string;
    longFmt: string;
}

export interface Bid {
    raw: number;
    fmt: string;
}

export interface LastPrice {
    raw: number;
    fmt: string;
}

export interface Volume {
    raw: number;
    fmt: string;
    longFmt: string;
}

export interface Call {
    percentChange: PercentChange;
    openInterest: OpenInterest;
    strike: Strike;
    change: Change;
    inTheMoney: boolean;
    impliedVolatility: ImpliedVolatility;
    ask: Ask;
    contractSymbol: string;
    lastTradeDate: LastTradeDate;
    currency: string;
    expiration: Expiration;
    contractSize: string;
    bid: Bid;
    lastPrice: LastPrice;
    volume: Volume;
}

export interface Put {
    percentChange: PercentChange;
    openInterest: OpenInterest;
    strike: Strike;
    change: Change;
    inTheMoney: boolean;
    impliedVolatility: ImpliedVolatility;
    ask: Ask;
    contractSymbol: string;
    lastTradeDate: LastTradeDate;
    currency: string;
    expiration: Expiration;
    contractSize: string;
    bid: Bid;
    lastPrice: LastPrice;
    volume: Volume;
}

export interface Option {
    expirationDate: number;
    hasMiniOptions: boolean;
    calls: Call[];
    puts: Put[];
}

export interface Result {
    underlyingSymbol: string;
    expirationDates: number[];
    strikes: number[];
    hasMiniOptions: boolean;
    quote: Quote;
    options: Option[];
}

export interface OptionChain {
    result: Result[];
    error?: any;
}

export interface YahooResponse {
    optionChain: OptionChain;
}
