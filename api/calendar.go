package spins

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"
	"os"
	"sort"
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

func timeSort(s []Slot) {
	sort.Slice(s, func(i, j int) bool {
		return s[i].Start > s[j].Start
	})
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
	timeSort(shows)
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
