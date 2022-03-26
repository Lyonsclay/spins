package spinitron

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

// {"id":15375164,
// 	"title":"4 To The Floor",
// 	"text":"wildbill",
// 	"start":"2022-02-18T20:00:00-0500",
// 	"end":"2022-02-18T22:00:00-0500",
// 	"className":"spin-cal-pl automated category-music",
// 	"url":"/WXOX/pl/15375164/4-To-The-Floor",
// 	"editUrl":"/m/playlist/edit/15375164",
// 	"deleteUrl":null,
// 	"rebroadcastUrl":"/m/playlist/create?playlist_id=15375164",
// 	"retireUrl":"",
// 	"editable":false,"data":{"category":"Music"}}

type Slot struct {
	Id    int    `json:"id"`
	Title string `json:"title"`
	Text  string `json:"text"`
	Start string `json:"start"`
	End   string `json:"end"`
	Url   string `json:"url"`
}

func getTimeRange() string {
	now := time.Now()
	stop := now.Format("2006-01-02T15:04:05")
	start := now.AddDate(0, 0, -7).Format("2006-01-02T15:04:05")
	query := fmt.Sprintf("?start=%v&end=%v", start, stop)
	return query
}

func reverseSlice(s []Slot) []Slot {
	l := len(s)
	rev := make([]Slot,l)
	for i,v := range(s) {
		rev[l - i - 1] = v
	}
	return rev[4:]
}

func GetCalendar() string {
	// base := "https://spinitron.com/WXOX"
	url := "https://spinitron.com/WXOX/calendar-feed"
	q := getTimeRange()
	res, err := http.Get(url + q)
	if err != nil {
		log.Fatal(err)
	}
	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Fatal(err)
	}
	var shows []Slot
	err = json.Unmarshal(body, &shows)
	if err != nil {
		log.Fatal(err)
	}
	shows = reverseSlice(shows)
	blob, err := json.MarshalIndent(shows, "", "\t")
	if err != nil {
		log.Fatalf("Error marshaling json: %v \n", err)
	}

	return string(blob)
}

func CalendarHandler(w http.ResponseWriter, r *http.Request) {
	shows := GetCalendar()
	fmt.Fprintf(w, "%v", shows)
}
