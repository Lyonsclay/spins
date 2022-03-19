package spinitron

import (
	"github.com/anaskhan96/soup"

	"fmt"
	"net/http"
	"net/url"
	"time"
	// "io/ioutil"
	"log"
)

type ShowNuff struct {
	Title    string `json:"title"`
	Timeslot string `json:"timeslot"`
	Category string `json:"category"`
	DJ       string `json:"dj"`
}

func GetPlaylist(path string) string {
	res, err := soup.Get(path)
	if err != nil {
		log.Fatal(err)
	}
	//We Read the response body on the line below.
	doc := soup.HTMLParse(res)

	body := doc.Find("body")
	data := body.Find("div", "class", "data")
	title := data.Find("h3", "class", "show-title").Find("a")
	timeslot := data.Find("p", "class", "timeslot").Find("li")
	category := data.Find("p", "class", "show-category")
	dj := data.Find("p", "class", "dj-name").Find("a")
	// out := title.Text() + timeslot.Text()
	out := fmt.Sprintf("%v %v %v %v", title.Text(), timeslot.Text(), category.Text(), dj.Text())
	return out
}

func SnowHandler(w http.ResponseWriter, r *http.Request) {
	u := r.URL.RawQuery
	p, _ := url.ParseQuery(u)
	sp := "https://spinitron.com" + p["path"][0]
	// out := GetPlaylist(sp)


	// fmt.Println(out)
	currentTime := time.Now().Format(time.RFC850)

	fmt.Println(currentTime)
	fmt.Fprintf(w, "%v", sp)

}