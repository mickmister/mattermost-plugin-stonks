export enum TimeFrame {
    ONE_DAY = 'd40',
    THREE_DAYS = 'd41',
    FIVE_DAYS = 'd42',
    ONE_MONTH = 'd43',
    THREE_MONTHS = 'd44',
    SIX_MONTHS = 'd45',
    NINE_MONTHS = 'd46',
    ONE_YEAR = 'd48',
    TWO_YEARS = 'd49',
    THREE_YEARS = 'd50',
}

export const timeFrames = [
    TimeFrame.ONE_DAY,
    TimeFrame.THREE_DAYS,
    TimeFrame.FIVE_DAYS,
    TimeFrame.ONE_MONTH,
    TimeFrame.THREE_MONTHS,
    TimeFrame.SIX_MONTHS,
    TimeFrame.NINE_MONTHS,
    TimeFrame.ONE_YEAR,
    TimeFrame.TWO_YEARS,
    TimeFrame.THREE_YEARS,
];

const timeFrameNames = {
    [TimeFrame.ONE_DAY]: '1 Day',
    [TimeFrame.THREE_DAYS]: '3 Days',
    [TimeFrame.FIVE_DAYS]: '5 Days',
    [TimeFrame.ONE_MONTH]: '1 Month',
    [TimeFrame.THREE_MONTHS]: '3 Months',
    [TimeFrame.SIX_MONTHS]: '6 Months',
    [TimeFrame.NINE_MONTHS]: '9 Months',
    [TimeFrame.ONE_YEAR]: '1 Year',
    [TimeFrame.TWO_YEARS]: '2 Years',
    [TimeFrame.THREE_YEARS]: '3 Years',
}

export const sharePriceTimeFrames = {
    [TimeFrame.ONE_DAY]: '1',
    [TimeFrame.THREE_DAYS]: '3',
    [TimeFrame.FIVE_DAYS]: '5',
    [TimeFrame.ONE_MONTH]: '31',
    [TimeFrame.THREE_MONTHS]: '90',
    [TimeFrame.SIX_MONTHS]: '180',
    [TimeFrame.NINE_MONTHS]: '270',
    [TimeFrame.ONE_YEAR]: '365',
    [TimeFrame.TWO_YEARS]: '730',
    [TimeFrame.THREE_YEARS]: '1096',
}

export const timeFrameToName = (timeFrame: TimeFrame): string => {
    return timeFrameNames[timeFrame];
}

/*
{
        "expiration": "2020-08-21",
        "strikes": [
            1,
            1.5,
            2.5,
            3,
            3.5,
            4,
            4.5,
            5,
            5.5,
            7.5,
            9,
            10,
            11,
            14
        ]
    },
*/


export const yahooResponseToETradeOptionsPicture = (symbol: string, expiration: string, strike: string, timeframe: TimeFrame) => {
    //https://optchart.etrade.com/graphs/NOW.CLX---201016C00240000.d44.t2.s1.v0.png
    // expiration = '2020-08-21';
    let strikeFormatted = (parseFloat(strike) * 1000).toString();
    const missingZeros = 8 - strikeFormatted.length;
    strikeFormatted = '0'.repeat(missingZeros) + strikeFormatted;

    const missingDashes = 6 - symbol.length;
    const symbolFormatted = symbol + '-'.repeat(missingDashes);

    const expFormatted = expiration.substring(2).replace(/\-/g, '');
    return `https://optchart.etrade.com/graphs/NOW.${symbolFormatted}${expFormatted}C${strikeFormatted}.${timeframe}.t2.s1.v0.png`;
}

export const yahooResponseToETradeSharePricePicture = (symbol: string, expiration: string, strike: string, timeframe: TimeFrame) => {
    //https://optchart.etrade.com/graphs/NOW.CLX---201016C00240000.d44.t2.s1.v0.png
    // expiration = '2020-08-21';
    let strikeFormatted = (parseFloat(strike) * 1000).toString();
    const missingZeros = 8 - strikeFormatted.length;
    strikeFormatted = '0'.repeat(missingZeros) + strikeFormatted;

    const missingDashes = 6 - symbol.length;
    const symbolFormatted = symbol + '-'.repeat(missingDashes);

    const expFormatted = expiration.substring(2).replace(/\-/g, '');
    return `https://optchart.etrade.com/graphs/NOW.${symbolFormatted}${expFormatted}C${strikeFormatted}.${timeframe}.t2.s1.v0.png`;
}
