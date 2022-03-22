package spinitron

import (
	"encoding/json"
	"fmt"
	"github.com/anaskhan96/soup"
	"log"
	"net/http"
	"net/url"
	"strings"
)

type Show struct {
	Title    string `json:"title"`
	Timeslot string `json:"timeslot"`
	Category string `json:"category"`
	DJ       string `json:"dj"`
}

func GetShow(path string) string {
	res, err := soup.Get(path)
	if err != nil {
		log.Fatal(err)
	}
	//We Read the response body on the line below.
	doc := soup.HTMLParse(res)

	body := doc.Find("body")
	data := body.Find("div", "class", "data")
	title := data.Find("h3", "class", "show-title").Find("a")
	timeslot := data.Find("p", "class", "timeslot")
	category := data.Find("p", "class", "show-categoty")
	dj := data.Find("p", "class", "dj-name").Find("a")
	var out Show
	if title.NodeValue != "" {
		out.Title = title.Text()
	}
	if timeslot.NodeValue != "" {
		out.Timeslot = strings.Trim(timeslot.Text(), "\n ")
	}
	if category.NodeValue != "" {
		out.Category = category.Text()
	}
	if dj.NodeValue != "" {
		out.DJ = dj.Text()
	}

	// blob, err := json.MarshalIndent(out, "", "\t")
	blob, err := json.Marshal(out)
	if err != nil {
		log.Fatalf("Error marshaling json: %v \n", err)
	}
	return string(blob)
}

func SusuHandler(w http.ResponseWriter, r *http.Request) {
	u := r.URL.RawQuery
	p, err := url.ParseQuery(u)
	if err != nil {
		log.Fatal(err)
	}
	path := "https://spinitron.com" + p["path"][0]
	out := GetShow(path)
	fmt.Println(path, out)

	fmt.Fprintf(w, "%v", out)
}
