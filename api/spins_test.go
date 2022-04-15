package spins

import (
	"fmt"
	"github.com/anaskhan96/soup"
	"log"
	"testing"
	"time"
	"os"
)

func TestSpinsParse(t *testing.T) {
	url := os.Getenv("NEXT_PUBLIC_SPINS_URL")
	res, err := soup.Get(url)
	doc := soup.HTMLParse(res)
	body := doc.Find("body")
	// rows := doc.Find("table").FindAll("tr")
	// output := rows[0].Attrs()
	output := body.HTML()
	expected := err
	if fmt.Sprintf("%v", output) != fmt.Sprintf("%v", expected) {
		t.Errorf("Expected: %v \n Received: %v \n", expected, output)
	}
}

func TestPlayListParse(t *testing.T) {
	path := "pl/15375723/Mythic-Beat"
	u := os.Getenv("SPINS_URL") +path
	res, err := soup.Get(u)
	if err != nil {
		log.Fatal(err)
	}
	doc := soup.HTMLParse(res)
	body := doc.Find("body")
	playlist := body.Find("div", "class", "playlist")
	image := playlist.Find("div", "class", "image").Find("img")
	output := image.Attrs()["src"]
	expected := err
	if fmt.Sprintf("%v", output) != fmt.Sprintf("%v", expected) {
		t.Errorf("Expected: %v \n Received: %v \n", expected, output)
	}
}

func TestDescriptionParse(t *testing.T) {
	path := "pl/15375723/Mythic-Beat"
	u := os.Getenv("SPINS_URL") +path
	res, err := soup.Get(u)
	if err != nil {
		log.Fatal(err)
	}
	doc := soup.HTMLParse(res)
	body := doc.Find("body")
	data := body.Find("div", "class", "data")
	description := data.Find("div", "class", "description")
	output := description.Text()

	expected := err
	if fmt.Sprintf("%v", output) != fmt.Sprintf("%v", expected) {
		t.Errorf("Expected: %v \n Received: %v \n", expected, output)
	}
}


func TestCalendar(t *testing.T) {
	path := "calendar-feed?timeslot=15&start=2022-02-20T00:00:00&end=2022-02-27T06:59:59&_=1645467101614"
	url := os.Getenv("SPINS_URL") + path
	res, err := soup.Get(url)
	doc := soup.HTMLParse(res)
	body := doc.Find("body")
	output := body.HTML()
	expected := err
	if fmt.Sprintf("%v", output) != fmt.Sprintf("%v", expected) {
		t.Errorf("Expected: %v \n Received: %v \n", expected, output)
	}
}

func TestGetOneShow(t *testing.T) {
	path := "pl/15379281/Winterlude"
	u := os.Getenv("SPINS_URL") + path
	out := GetShow(u)
	output := out
	expected := "out"
	if fmt.Sprintf("%v", output) != fmt.Sprintf("%v", expected) {
		t.Errorf("Expected: %v \n Received: %v \n", expected, output)
	}
}

func TestGetCurrentSpin(t *testing.T) {
	s := GetCurrentSpin()
	output := s
	expected := ""
	if fmt.Sprintf("%v", output) != fmt.Sprintf("%v", expected) {
		t.Errorf("Expected: %v \n Received: %v \n", expected, output)
	}
}

func TestGetShows(t *testing.T) {
	s := GetCalendar()
	output := s
	expected := ""
	if fmt.Sprintf("%v", output) != fmt.Sprintf("%v", expected) {
		t.Errorf("Expected: %v \n Received: %v \n", expected, output)
	}
}

// [TODO] add getTimeRange
func TestTimeFormat(t *testing.T) {
	// q := "start=2022-02-20T00:00:00&end=2022-02-27T06:59:59"
	now := time.Now()
	st := now.Format("2006-01-02T15:04:05")
	s := now.AddDate(0, 0, -7).Format("2006-01-02T15:04:05")
	output := fmt.Sprintf("%v::%v", s, st)
	expected := ""
	if fmt.Sprintf("%v", output) != fmt.Sprintf("%v", expected) {
		t.Errorf("Expected: %v \n Received: %v \n", expected, output)
	}
}

