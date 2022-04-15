package spins

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"
	"os"
)

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
	path := "calendar-feed"
	url := os.Getenv("SPINS_URL") + path
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
