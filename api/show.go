package spinitron

import (
	"fmt"
	// "github.com/anaskhan96/soup"
	"net/http"
	// "net/url"
)

// func GetShow(path string) string {
	// res, err := soup.Get(path)
	// if err != nil {
	// 	panic(err)
	// }
	// doc := soup.HTMLParse(res)
	// body := doc.Find("body")
	// return body.Text()
	// return path
// }

func ShowHandler(w http.ResponseWriter, r *http.Request) {
	// u := r.URL.RawQuery
	// p, err := url.ParseQuery(u)
	// if err != nil {
	// 	panic(err)
	// }
	// path := p["path"]

	fmt.Fprintf(w, "{\"path\": \"%v\"}", "path")
}
