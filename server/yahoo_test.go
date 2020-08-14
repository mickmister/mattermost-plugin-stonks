package main

import (
	"io/ioutil"
	"os"
	"path/filepath"
)

func getTestData(filename string) ([]byte, error) {
	f, err := os.Open(filepath.Join("testdata", filename))

	if err != nil {
		panic(err)
	}

	defer f.Close()
	return ioutil.ReadAll(f)
}

// This test is old and the code it's testing doesn't exist anymore. Logic has moved to frontend.
/*
func TestPadSymbol(t *testing.T) {
	for _, tc := range []struct {
		name string
		file string
	}{
		{
			name: "TUP",
			file: "TUP.json",
		},
	} {
		t.Run(tc.name, func(t *testing.T) {
			b, err := getTestData(tc.file)
			require.Nil(t, err)

			data := &YahooResponse{}
			err = json.Unmarshal(b, data)
			require.Nil(t, err)
			require.NotNil(t, data)

			symbol := "TUP"
			cs := "TUP201016C00007500"

			expected := "https://optchart.etrade.com/graphs/NOW.TUP---201016C00007500.d43.t2.s1.v0.png"
			actual := getPngUrl(symbol, cs, "d43")
			require.Equal(t, expected, actual)
		})
	}
}
*/
