package spinitron

import (
	"fmt"
	"net/http"
	"net/url"
	"log"
)

type ShowNuff struct {
	Title    string `json:"title"`
	Timeslot string `json:"timeslot"`
	Category string `json:"category"`
	DJ       string `json:"dj"`
}

func Harphandler(w http.ResponseWriter, r *http.Request) {
	u := r.URL.RawQuery
	p, err := url.ParseQuery(u)
	if err != nil {
		log.Fatal(err)
	}
	path := "https://spinitron.com" + p["path"][0]
	fmt.Fprintf(w,"%v", path)
}
