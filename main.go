package main

import (
	"log"
	"net/http"
)

func homeHandler(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("Hello World"))
}

func main() {
	http.Handle("/tictactoe/", http.StripPrefix("/tictactoe/", http.FileServer(http.Dir("./public/tictactoe"))))
	http.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("./public/home"))))
	log.Println("Server is running...")
	log.Fatal(http.ListenAndServe(":8000", nil))
}
