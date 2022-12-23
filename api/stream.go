package spins

import (
	"net/http"
	"net/http/httputil"
	"net/url"
)



// Serve a reverse proxy for a given url
func serveReverseProxy(target string, res http.ResponseWriter, req *http.Request) {
	// parse the url
	url, _ := url.Parse(target)

	// create the reverse proxy
	proxy := httputil.NewSingleHostReverseProxy(url)

	// Note that ServeHttp is non blocking and uses a go routine under the hood
	proxy.ServeHTTP(res, req)
}


// Given a request send it to the appropriate url
func StreamHandler(res http.ResponseWriter, req *http.Request) {
	url := "http://s7.viastreaming.net:8310/;"


	serveReverseProxy(url, res, req)
}
