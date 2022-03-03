package spinitron

import (
	"encoding/json"
	"fmt"
	"github.com/anaskhan96/soup"
	"log"
	"net/http"
	"time"
	"strings"
)


type Spin struct {
	Artist    string `json:"artist"`
	Song      string `json:"song"`
	Composer  string `json:"composer"`
	Release   string `json:"release"`
	Label     string `json:"label"`
	ImageUrl  string `json:"imageUrl"`
	Timestamp string `json:"timestamp"`
}

func GetCurrentSpin() string {
	res, err := soup.Get("https://spinitron.com/WXOX/")
	if err != nil {
		log.Fatal(err)
	}

	doc := soup.HTMLParse(res)

	body := doc.Find("body")
	// return "oof"

	sp := body.FindStrict("div", "id", "public-spins-0")
	if sp.Error != nil {
		return ""

	}
	spins := sp.Find("table").FindAll("tr")[0]


	art := spins.Find("td", "class", "spin-art").Find("img").Attrs()
	imageUrl := art["src"]
	imageUrl = strings.Replace(imageUrl, "170x170","600x600", 1)
	s := spins.FindAll("td")[2]
	var artist string
	a := s.Find("span", "class", "artist")
	if a.NodeValue != "" {
		artist = a.Text()
	}
	var song string
	so := s.Find("span", "class", "song")
	if so.NodeValue != "" {
		song = so.Text()
	}
	var composer string
	c := s.Find("span", "class", "composer")
	if c.NodeValue != "" {
		composer = c.Text()
	}
	var release string
	r := s.Find("span", "class", "release")
	if r.NodeValue != "" {
		release = r.Text()
	}
	var label string
	l := s.Find("span", "class", "label")
	if l.NodeValue != "" {
		label = l.Text()
	}
	spin := Spin{
		ImageUrl: imageUrl,
		Artist:   artist,
		Song:     song,
		Composer: composer,
		Release:  release,
		Label:    label,
		Timestamp: time.Now().UTC().String(),
	}
	blob, err := json.MarshalIndent(spin, "", "\t")
	if err != nil {
		log.Fatalf("Error marshaling json: %v \n", err)
	}

	return string(blob)
}

var resources = []string{
	"https://spinitron.com/WXOX/",
	"https://spinitron.com/WXOX/dj/103719/Ben-Zoeller",
	"https://spinitron.com/WXOX/show/222061/World-Workout-w-The-Dream-Team",
	"https://spinitron.com/WXOX/pl/15396116/Hello-Goodbye",
	"https://spinitron.com/WXOX/calendar",
	"https://spinitron.com/WXOX/calendar-feed?timeslot=15&start=2022-02-20T00:00:00&end=2022-02-27T06:59:59&_=1645467101614",
	"https://spinitron.com/WXOX/calendar-feed?start=2022-02-20T00:00:00&end=2022-02-27T06:59:59",
	"http://widgets.spinitron.com/widget/now-playing-v2?callback=_spinitron04669496113876874164549461312&station=wxox&num=1&sharing=0&player=0&cover=0",
}

func SpinsHandler(w http.ResponseWriter, r *http.Request) {
	spin := GetCurrentSpin()
	fmt.Fprintf(w, "%v", spin)
}
