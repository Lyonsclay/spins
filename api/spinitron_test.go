package spinitron

import (
	"fmt"
	"github.com/anaskhan96/soup"
	"testing"
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

func TestGetCurrentSpin(t *testing.T) {
	s := GetCurrentSpin()
	output := s
	expected := ""
	if fmt.Sprintf("%v", output) != fmt.Sprintf("%v", expected) {
		t.Errorf("Expected: %v \n Received: %v \n", expected, output)
	}
}

func TestGetShows(t *testing.T) {
	s := GetShows()
	output := s
	expected := ""
	if fmt.Sprintf("%v", output) != fmt.Sprintf("%v", expected) {
		t.Errorf("Expected: %v \n Received: %v \n", expected, output)
	}
}
