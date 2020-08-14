import React from 'react';

import {YahooShort} from 'types/yahoo_short';
import {Result as YahooResponse} from 'types/yahoo';
import {Theme} from 'mattermost-redux/types/preferences';

import SHORTS_DATA from 'testdata/TUP_shorts';

import {
    TimeFrame,
    yahooResponseToETradeOptionsPicture,
    sharePriceTimeFrames,
    yahooResponseToETradeSharePricePicture,
    timeFrames,
    timeFrameToName,
} from '../../etrade';

import ReactSelectSetting from 'components/react_select_setting';
import FormButton from 'components/form_button';
import {fetchSharePricePictureURL} from 'actions/actions';

export type Props = {
    shorts: YahooShort[];
    theme: Theme;
};

export type State = {
    // shorts: YahooShort[];
    yahooResponse: YahooResponse | null;
    sharePricePictureURL: string;
    symbol: string;
    lastSymbol: string;
    typingSymbol: boolean;
    expiration: string;
    strike: string;
    timeFrame: TimeFrame;
    loading: boolean;
}

export default class OptionsForm extends React.PureComponent<Props, State> {
    static defaultProps = {
        shorts: SHORTS_DATA,
    }

    state = {
        // shorts: [],
        yahooResponse: null,
        sharePricePictureURL: '',
        symbol: 'TUP',
        lastSymbol: 'TUP',
        typingSymbol: false,
        expiration: '2020-08-21',
        strike: '5',
        timeFrame: TimeFrame.ONE_MONTH,
        loading: false,
    } as State;

    componentDidMount() {
        if (this.state.symbol) {
            this.handleSubmit();
        }
    }

    onSymbolInputChange = (symbol: string) => {
        this.setState({symbol, typingSymbol: true});
    }

    handleExpirationChoice = (exp) => {
        this.setState({
            expiration: exp,
        });

        if (!this.state.yahooResponse) {
            return;
        }


        const opt = this.state.yahooResponse.options.find((opt) => opt.calls[0].expiration.fmt === this.state.expiration);
        if (opt) {
            const strike = opt.calls[Math.floor(opt.calls.length / 2)].strike.fmt;
            this.handleStrikeChoice(strike);
        }
    }

    handleStrikeChoice = (strike: string) => {
        this.setState({strike});
    }

    handleTimeFrameChoice = (timeFrame: string) => {
        this.setState({timeFrame}, this.fetchSharePriceURL);
    }

    getEtradeOptionsPictureURL = () => {
        let symbol = this.state.symbol;
        if (this.state.typingSymbol) {
            symbol = this.state.lastSymbol;
        }

        const {expiration, strike, timeFrame} = this.state;
        if (!(symbol && expiration && strike && timeFrame)) {
            return '';
        }

        return yahooResponseToETradeOptionsPicture(symbol, expiration, strike, timeFrame);
    }

    fetchSharePriceURL = async () => {
        let symbol = this.state.symbol;
        if (this.state.typingSymbol) {
            symbol = this.state.lastSymbol;
        }

        const {expiration, strike, timeFrame} = this.state;
        if (!(symbol && expiration && strike && timeFrame)) {
            return '';
        }

        const freq = sharePriceTimeFrames[timeFrame];
        const u = await fetchSharePricePictureURL(symbol, freq, '1day');
        this.setState({sharePricePictureURL: u});
    }

    getExpirations = () => {
        if (!this.state.yahooResponse) {
            return [];
        }

        return this.state.yahooResponse.options.map((opt) => opt.calls[0].expiration.fmt);
    }

    getStrikePrices = () => {
        if (!this.state.yahooResponse) {
            return [];
        }

        const opt = this.state.yahooResponse.options.find((opt) => opt.calls[0].expiration.fmt === this.state.expiration);
        if (!opt) {
            return [];
        }

        return opt.calls.map((c) => c.strike.fmt);
    }

    handleSubmit = async (e?: Event) => {
        if (e) {
            e.preventDefault();
        }

        this.setState({loading: true});
        try {
            const yahooRes: YahooResponse = await fetch(`/plugins/stonks/yahoo?symbol=${this.state.symbol}`).then((r) => r.json());
            this.setState({yahooResponse: yahooRes, typingSymbol: false, loading: false}, this.fetchSharePriceURL);
        } catch (e) {
            alert(e.message);
            this.setState({loading: false});
        }
    }

    render() {
        const expirationOptions = this.getExpirations().map((exp) => (
            {
                label: exp,
                value: exp,
            }
        ));

        const strikeOptions = this.getStrikePrices().map((strike) => (
            {
                label: strike,
                value: strike,
            }
        ));

        const timeFrameOptions = timeFrames.map((tf) => (
            {
                label: timeFrameToName(tf),
                value: tf,
            }
        ));

        const optionsPictureURL = this.getEtradeOptionsPictureURL();
        const sharePricePictureURL = this.state.sharePricePictureURL;

        return (
            <div>
                <div style={{
                    display: 'inline-block',
                    width: '200px',
                }}>
                    {'Symbol'}
                    <input
                        value={this.state.symbol}
                        onChange={(e) => this.onSymbolInputChange(e.target.value)}
                        className={'form-control'}
                    />
                </div>

                <div style={{
                    display: 'inline-block',
                    width: '200px',
                }}>
                    {'Expiration'}
                    <ReactSelectSetting
                        key={'expiration'}
                        name={'expiration'}
                        label={'Expiration'}
                        options={expirationOptions}
                        required={true}
                        onChange={(id, val) => this.handleExpirationChoice(val)}
                        isMulti={false}
                        value={expirationOptions.find((option) => option.value === this.state.expiration)}
                        theme={this.props.theme}
                        isClearable={false}
                    />
                </div>

                <div style={{
                    display: 'inline-block',
                    width: '200px',
                }}>
                    {'Strike'}
                    <ReactSelectSetting
                        key={'strike'}
                        name={'strike'}
                        label={'Strike Price'}
                        options={strikeOptions}
                        required={true}
                        onChange={(id, val) => this.handleStrikeChoice(val)}
                        isMulti={false}
                        value={strikeOptions.find((option) => option.value === this.state.strike)}
                        theme={this.props.theme}
                        isClearable={false}
                    />
                </div>

                <div style={{
                    display: 'inline-block',
                    width: '200px',
                }}>
                    {'Time Frame'}
                    <ReactSelectSetting
                        key={'timeframe'}
                        name={'timeframe'}
                        label={'Time Frame'}
                        options={timeFrameOptions}
                        required={true}
                        onChange={(id, val) => this.handleTimeFrameChoice(val)}
                        isMulti={false}
                        value={strikeOptions.find((option) => option.value === this.state.timeFrame)}
                        theme={this.props.theme}
                        isClearable={false}
                    />
                </div>

                <FormButton
                    type='button'
                    onClick={this.handleSubmit}
                    btnClass='btn-primary'
                    saving={this.state.loading}
                    defaultMessage={'Submit'}
                    savingMessage='Loading...'
                />

                {optionsPictureURL && (
                    <div>
                        <img src={optionsPictureURL} style={{height: '400px'}} />
                    </div>
                )}
                {sharePricePictureURL && (
                    <div>
                        <img src={sharePricePictureURL} style={{height: '400px'}} />
                    </div>
                )}
            </div>
        )
    }
}
