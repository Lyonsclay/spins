package spinitron

import (
	"fmt"
	"github.com/anaskhan96/soup"
	"testing"
	"time"
	"net/url"
	// "log"
)

func TestSpinitronParse(t *testing.T) {
	res, err := soup.Get("https://spinitron.com/wxox/")
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


func TestCalendar(t *testing.T) {
	cal := resources[6]
	res, err := soup.Get(cal)
	doc := soup.HTMLParse(res)
	body := doc.Find("body")
	output := body.HTML()
	expected := err
	if fmt.Sprintf("%v", output) != fmt.Sprintf("%v", expected) {
		t.Errorf("Expected: %v \n Received: %v \n", expected, output)
	}
}

func TestGetShow(t *testing.T) {
	u := "https://spinitron.com/WXOX/pl/15379281/Winterlude"
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

func TestParseQuery(t *testing.T) {
	u := "https://google.com/drivers?one=two"
	p, err := url.ParseQuery(u)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	output := p["one"]
	expected := err
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

func TestTimeOut(t *testing.T) {
	now := time.Now()
	s := now.Format("20060102030405")
	output := s
	expected := ""
	if fmt.Sprintf("%v", output) != fmt.Sprintf("%v", expected) {
		t.Errorf("Expected: %v \n Received: %v \n", expected, output)
	}

}

func TestGetPlaylist(t *testing.T) {
	path := "https://spinitron.com" + "/WXOX/pl/15610668/Sun-Revolutions"
	// res := GetPlaylist(path)
	output := path
	expected := "pay"
	if fmt.Sprintf("%v", output) != fmt.Sprintf("%v", expected) {
		t.Errorf("Expected: %v \n Received: %v \n", expected, output)
	}
}
