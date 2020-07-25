package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/mattermost/mattermost-server/v5/plugin"
)

type RemoteAPI interface {
	FetchYahoo(symbol, expiration string) (*YahooResponse, error)
}

type remote struct{}

type YahooShort struct {
	Expiration string    `json:"expiration"`
	Strikes    []float64 `json:"strikes"`
}

func (r *remote) FetchYahoo(symbol string, exp int) (*YahooResponse, error) {
	date := ""
	if exp != 0 {
		date = fmt.Sprintf("&date=%v", exp)
	}

	template := "https://query2.finance.yahoo.com/v7/finance/options/%s?formatted=true&lang=en-US&region=US%s"

	u := fmt.Sprintf(template, symbol, date)
	req, err := http.NewRequest(http.MethodGet, u, nil)
	if err != nil {
		return nil, err
	}

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	b, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	data := &YahooResponse{}
	err = json.Unmarshal(b, data)
	return data, err
}

func convertYahooResToShort(yahooRes *YahooResponse) *YahooShort {
	expiration := yahooRes.OptionChain.Result[0].Options[0].Calls[0].Expiration.Fmt
	strikes := yahooRes.OptionChain.Result[0].Strikes
	return &YahooShort{
		Expiration: expiration,
		Strikes:    strikes,
	}
}

func (p *Plugin) httpHandleYahoo(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	symbol := r.URL.Query().Get("symbol")

	rem := &remote{}
	yahooRes, err := rem.FetchYahoo(symbol, 0)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	res := []*YahooShort{}
	short := convertYahooResToShort(yahooRes)
	res = append(res, short)

	for _, exp := range yahooRes.OptionChain.Result[0].ExpirationDates[1:] {
		yahooRes, err = rem.FetchYahoo(symbol, exp)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte(err.Error()))
			return
		}
		short = convertYahooResToShort(yahooRes)
		res = append(res, short)
	}
	// w.Write(yahooRes)

	b, err := json.Marshal(res)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.Write(b)
}

type Option struct {
	PercentChange struct {
		Raw float64 `json:"raw"`
		Fmt string  `json:"fmt"`
	} `json:"percentChange"`
	OpenInterest struct {
		Raw     float64 `json:"raw"`
		Fmt     string  `json:"fmt"`
		LongFmt string  `json:"longFmt"`
	} `json:"openInterest"`
	Strike struct {
		Raw float64 `json:"raw"`
		Fmt string  `json:"fmt"`
	} `json:"strike"`
	Change struct {
		Raw float64 `json:"raw"`
		Fmt string  `json:"fmt"`
	} `json:"change"`
	InTheMoney        bool `json:"inTheMoney"`
	ImpliedVolatility struct {
		Raw float64 `json:"raw"`
		Fmt string  `json:"fmt"`
	} `json:"impliedVolatility"`
	Ask struct {
		Raw float64 `json:"raw"`
		Fmt string  `json:"fmt"`
	} `json:"ask"`
	ContractSymbol string `json:"contractSymbol"`
	LastTradeDate  struct {
		Raw     float64 `json:"raw"`
		Fmt     string  `json:"fmt"`
		LongFmt string  `json:"longFmt"`
	} `json:"lastTradeDate"`
	Currency   string `json:"currency"`
	Expiration struct {
		Raw     float64 `json:"raw"`
		Fmt     string  `json:"fmt"`
		LongFmt string  `json:"longFmt"`
	} `json:"expiration"`
	ContractSize string `json:"contractSize"`
	Bid          struct {
		Raw float64 `json:"raw"`
		Fmt string  `json:"fmt"`
	} `json:"bid"`
	LastPrice struct {
		Raw float64 `json:"raw"`
		Fmt string  `json:"fmt"`
	} `json:"lastPrice"`
	Volume struct {
		Raw     float64 `json:"raw"`
		Fmt     string  `json:"fmt"`
		LongFmt string  `json:"longFmt"`
	} `json:"volume,omitempty"`
}

type Quote struct {
	Language                          string  `json:"language"`
	Region                            string  `json:"region"`
	QuoteType                         string  `json:"quoteType"`
	QuoteSourceName                   string  `json:"quoteSourceName"`
	Triggerable                       bool    `json:"triggerable"`
	Currency                          string  `json:"currency"`
	Exchange                          string  `json:"exchange"`
	ShortName                         string  `json:"shortName"`
	LongName                          string  `json:"longName"`
	MessageBoardID                    string  `json:"messageBoardId"`
	ExchangeTimezoneName              string  `json:"exchangeTimezoneName"`
	ExchangeTimezoneShortName         string  `json:"exchangeTimezoneShortName"`
	GmtOffSetMilliseconds             float64 `json:"gmtOffSetMilliseconds"`
	Market                            string  `json:"market"`
	EsgPopulated                      bool    `json:"esgPopulated"`
	Tradeable                         bool    `json:"tradeable"`
	FirstTradeDateMilliseconds        float64 `json:"firstTradeDateMilliseconds"`
	PriceHint                         float64 `json:"priceHint"`
	PostMarketChangePercent           float64 `json:"postMarketChangePercent"`
	PostMarketTime                    float64 `json:"postMarketTime"`
	PostMarketPrice                   float64 `json:"postMarketPrice"`
	PostMarketChange                  float64 `json:"postMarketChange"`
	RegularMarketChange               float64 `json:"regularMarketChange"`
	RegularMarketChangePercent        float64 `json:"regularMarketChangePercent"`
	RegularMarketTime                 float64 `json:"regularMarketTime"`
	RegularMarketPrice                float64 `json:"regularMarketPrice"`
	RegularMarketDayHigh              float64 `json:"regularMarketDayHigh"`
	RegularMarketDayRange             string  `json:"regularMarketDayRange"`
	RegularMarketDayLow               float64 `json:"regularMarketDayLow"`
	RegularMarketVolume               float64 `json:"regularMarketVolume"`
	RegularMarketPreviousClose        float64 `json:"regularMarketPreviousClose"`
	Bid                               float64 `json:"bid"`
	Ask                               float64 `json:"ask"`
	BidSize                           float64 `json:"bidSize"`
	AskSize                           float64 `json:"askSize"`
	FullExchangeName                  string  `json:"fullExchangeName"`
	FinancialCurrency                 string  `json:"financialCurrency"`
	RegularMarketOpen                 float64 `json:"regularMarketOpen"`
	AverageDailyVolume3Month          float64 `json:"averageDailyVolume3Month"`
	AverageDailyVolume10Day           float64 `json:"averageDailyVolume10Day"`
	FiftyTwoWeekLowChange             float64 `json:"fiftyTwoWeekLowChange"`
	FiftyTwoWeekLowChangePercent      float64 `json:"fiftyTwoWeekLowChangePercent"`
	FiftyTwoWeekRange                 string  `json:"fiftyTwoWeekRange"`
	FiftyTwoWeekHighChange            float64 `json:"fiftyTwoWeekHighChange"`
	FiftyTwoWeekHighChangePercent     float64 `json:"fiftyTwoWeekHighChangePercent"`
	FiftyTwoWeekLow                   float64 `json:"fiftyTwoWeekLow"`
	FiftyTwoWeekHigh                  float64 `json:"fiftyTwoWeekHigh"`
	DividendDate                      float64 `json:"dividendDate"`
	EarningsTimestamp                 float64 `json:"earningsTimestamp"`
	EarningsTimestampStart            float64 `json:"earningsTimestampStart"`
	EarningsTimestampEnd              float64 `json:"earningsTimestampEnd"`
	TrailingAnnualDividendRate        float64 `json:"trailingAnnualDividendRate"`
	TrailingAnnualDividendYield       float64 `json:"trailingAnnualDividendYield"`
	EpsTrailingTwelveMonths           float64 `json:"epsTrailingTwelveMonths"`
	EpsForward                        float64 `json:"epsForward"`
	SharesOutstanding                 float64 `json:"sharesOutstanding"`
	BookValue                         float64 `json:"bookValue"`
	FiftyDayAverage                   float64 `json:"fiftyDayAverage"`
	FiftyDayAverageChange             float64 `json:"fiftyDayAverageChange"`
	FiftyDayAverageChangePercent      float64 `json:"fiftyDayAverageChangePercent"`
	TwoHundredDayAverage              float64 `json:"twoHundredDayAverage"`
	TwoHundredDayAverageChange        float64 `json:"twoHundredDayAverageChange"`
	TwoHundredDayAverageChangePercent float64 `json:"twoHundredDayAverageChangePercent"`
	MarketCap                         float64 `json:"marketCap"`
	ForwardPE                         float64 `json:"forwardPE"`
	PriceToBook                       float64 `json:"priceToBook"`
	SourceInterval                    float64 `json:"sourceInterval"`
	ExchangeDataDelayedBy             float64 `json:"exchangeDataDelayedBy"`
	MarketState                       string  `json:"marketState"`
	DisplayName                       string  `json:"displayName"`
	Symbol                            string  `json:"symbol"`
}

type Options struct {
	ExpirationDate float64  `json:"expirationDate"`
	HasMiniOptions bool     `json:"hasMiniOptions"`
	Calls          []Option `json:"calls"`
	Puts           []Option `json:"puts"`
}

type YahooResponse struct {
	OptionChain struct {
		Result []struct {
			UnderlyingSymbol string    `json:"underlyingSymbol"`
			ExpirationDates  []int     `json:"expirationDates"`
			Strikes          []float64 `json:"strikes"`
			HasMiniOptions   bool      `json:"hasMiniOptions"`
			Quote            Quote     `json:"quote"`
			Options          []Options `json:"options"`
		} `json:"result"`
		Error interface{} `json:"error"`
	} `json:"optionChain"`
}
