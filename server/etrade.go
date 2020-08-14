package main

import (
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strings"

	"github.com/mattermost/mattermost-server/v5/plugin"
)

func (r *remote) FetchEtradeSharePricePictureURL(symbol, duration, frequency string) (string, error) {
	template := "https://www.etrade.wallst.com/v1/stocks/charts/update_chart.asp?symbol=%s&duration=%s&frequency=%s&toolbarView=show&scaling=linear&display=mountain&exportData=1&dMin=0&dMax=0&uppers=[]&lowers=[{\"value\":\"volumebyprice\",\"params\":\"\"}]&lastColorUsed=2&action=&action_value=&eventview=undefined&width=920&height=400&cType=inpage&sKey=1&currentTool=zoom&chartsize=sm"
	u := fmt.Sprintf(template, symbol, duration, frequency)

	req, err := http.NewRequest(http.MethodGet, u, nil)
	if err != nil {
		return "", err
	}
	req.Header.Add("Cookie", r.conf.ETradeCookie)
	// req.Header.Add("Cookie", "1432%5F0=3969D54D9E2D0034F6F5ED290A470FB814749A05CEA55AD47401EA88E46A007C;")

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return "", err
	}

	b, err := ioutil.ReadAll(res.Body)
	if err != nil {
		return "", err
	}

	s := string(b)

	i1 := strings.LastIndex(s, "cgi-bin")
	i2 := strings.LastIndex(s, "%22%20width")
	if i1 == -1 || i2 == -1 {
		return "", errors.New("Failed to parse image url. Response: " + s)
	}
	s = s[i1:i2]
	s = strings.ReplaceAll(s, "%3F", "?")

	return "https://www.etrade.wallst.com/" + s, nil
}

func (p *Plugin) httpHandleETrade(c *plugin.Context, w http.ResponseWriter, r *http.Request) {
	symbol := r.URL.Query().Get("symbol")
	duration := r.URL.Query().Get("duration")
	frequency := r.URL.Query().Get("frequency")

	rem := &remote{}
	s, err := rem.FetchEtradeSharePricePictureURL(symbol, duration, frequency)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.Write([]byte(s))
}
