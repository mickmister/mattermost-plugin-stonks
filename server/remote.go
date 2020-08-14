package main

type RemoteAPI interface {
	FetchYahoo(symbol, expiration string) (*YahooResponse, error)
	FetchEtradeSharePricePictureURL(symbol, duration, frequency string) (string, error)
}

type remote struct {
	conf configuration
}
