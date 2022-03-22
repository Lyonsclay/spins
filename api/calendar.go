package spinitron

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	// "github.com/anaskhan96/soup"
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
	Id    int `json:"id"`
	Title string `json:"title"`
	Text  string `json:"text"`
	Start string `json:"start"`
	End   string `json:"end"`
	Url   string `json:"url"`
}


func GetCalendar() string {
	// base := "https://spinitron.com/WXOX"
	url := "https://spinitron.com/WXOX/calendar-feed?start=2022-02-20T00:00:00&end=2022-02-27T06:59:59"
	// res, err := http.Get(base + url)
	res, err := http.Get(url)
	if err != nil {
		log.Fatal(err)
	}
	defer res.Body.Close()
	//We Read the response body on the line below.
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Fatal(err)
	}
	var shows []Slot
	err = json.Unmarshal(body, &shows)
	if err != nil {
		log.Fatal(err)
	}
	// fmt.Printf("%T - %v", shows, shows[0])
	//Convert the body to type string
	// sb := string(body)
	// log.Println(sb)
	// return sb
	// var results []Show
	// for _, v := range body {
	// 	results = append(results, v)
	// }
	// return results

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
