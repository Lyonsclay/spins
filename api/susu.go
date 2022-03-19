package spinitron

import (
  "fmt"
  "net/http"
)

func SusuHandler(w http.ResponseWriter, r *http.Request) {
  fmt.Fprintf(w, "<h1>Hello from Go!</h1>")
}
