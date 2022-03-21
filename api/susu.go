package spinitron

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"github.com/anaskhan96/soup"
)
func GotPlaylist(path string) string {
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
	// out := title.Text() + timeslot.Text()
	out := fmt.Sprintf("%s %s %s %s", title.Text(), timeslot.Text(), category.Text(), dj.Text())
	fmt.Println(title)
	fmt.Println(timeslot)
	fmt.Println(category)
	fmt.Println(dj)
	return out
}

func SusuHandler(w http.ResponseWriter, r *http.Request) {
	u := r.URL.RawQuery
	p, err := url.ParseQuery(u)
	if err != nil {
		log.Fatal(err)
	}
	path := "https://spinitron.com" + p["path"][0]

	fmt.Fprintf(w, "%v", path)
}
