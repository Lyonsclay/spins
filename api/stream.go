package spins

import (
	"log"
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

// Log the typeform payload and redirect url
func logRequestPayload(proxyURL string) {
	log.Printf("proxy_url: %s\n", proxyURL)
}



// Given a request send it to the appropriate url
func StreamHandler(res http.ResponseWriter, req *http.Request) {
	url := "http://s7.viastreaming.net:8310/;?_=0.6459343524616199"

	logRequestPayload(url)

	serveReverseProxy(url, res, req)
}
