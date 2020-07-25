import React from 'react';
import {YahooShort} from 'src/types/yahoo_short';

import SHORTS_DATA from '../testdata/TUP_shorts';
import {TimeFrame, yahooResponseToETradePicture, timeFrames, timeFrameToName} from '../etrade';

export type Props = {
    shorts: YahooShort[];
};

export type State = {
    shorts: YahooShort[];
    symbol: string;
    expiration: string;
    strike: string;
    timeFrame: TimeFrame;
    disablePicture: boolean;
}

export default class OptionsForm extends React.PureComponent<Props, State> {
    static defaultProps = {
        shorts: SHORTS_DATA,
    }

    state = {
        shorts: [],
        symbol: 'TUP',
        expiration: '2020-08-21',
        strike: '5',
        timeFrame: TimeFrame.ONE_MONTH,
        disablePicture: false,
    } as State;

    componentDidMount() {
        if (this.state.symbol) {
            this.handleSubmit();
        }
    }

    onSymbolInputChange = (symbol: string) => {
        this.setState({symbol, disablePicture: true});
    }

    handleExpirationChoice = (exp) => {
        this.setState({
            expiration: exp,
        });

        const short = this.state.shorts.find((s) => s.expiration === this.state.expiration);
        if (short) {
            const strike = short.strikes[0].toString();
            this.handleStrikeChoice(strike);
        }
    }

    handleStrikeChoice = (strike: string) => {
        this.setState({strike});
    }

    handleTimeFrameChoice = (timeFrame: string) => {
        this.setState({timeFrame});
    }

    getEtradePictureURL = () => {
        if (this.state.disablePicture) {
            return '';
        }

        const {expiration, strike, timeFrame, symbol} = this.state;
        if (!(symbol && expiration && strike && timeFrame)) {
            return '';
        }

        return yahooResponseToETradePicture(symbol, expiration, strike, timeFrame);
    }

    handleSubmit = async (e?: Event) => {
        if (e) {
            e.preventDefault();
        }

        const yahooRes = await fetch(`/plugins/stonks/yahoo?symbol=${this.state.symbol}`).then((r) => r.json());
        this.setState({shorts: yahooRes, disablePicture: false});
    }

    render() {
        const expirationOptions = this.state.shorts.map((s) => (
            <option value={s.expiration}>
                {s.expiration}
            </option>
        ));

        const short = this.state.shorts.find((s) => s.expiration === this.state.expiration);

        let strikeOptions: React.ReactElement[] = [];
        if (short) {
            strikeOptions = short.strikes.map((strike) => (
                <option value={strike.toString()}>
                    {strike.toString()}
                </option>
            ));
        }

        const timeFrameOptions = timeFrames.map((tf) => (
            <option value={tf}>
                {timeFrameToName(tf)}
            </option>
        ))

        const pictureURL = this.getEtradePictureURL();

        return (
            <div>
                {'Symbol'}
                <input value={this.state.symbol} onChange={(e) => this.onSymbolInputChange(e.target.value)}/>

                {'Expiration'}
                <select value={this.state.expiration} onChange={(e) => this.handleExpirationChoice(e.target.value)}>
                    {expirationOptions}
                </select>

                {'Strike'}
                <select value={this.state.strike} onChange={(e) => this.handleStrikeChoice(e.target.value)}>
                    {strikeOptions}
                </select>

                {'Time Frame'}
                <select value={this.state.timeFrame} onChange={(e) => this.handleTimeFrameChoice(e.target.value)}>
                    {timeFrameOptions}
                </select>

                <button onClick={this.handleSubmit}>
                    {'Submit'}
                </button>

                {pictureURL && (
                    <div>
                        <img src={pictureURL} style={{height: '400px'}}/>
                    </div>
                )}
            </div>
        )
    }
}
