package main

import (
	"log"
	"net/http"

	"github.com/rs/cors"
	"cloud-storage/storage/internal/handler"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("/upload", handler.UploadHandler)
	mux.HandleFunc("/download", handler.GetFileHandler)

	handlerWithCors := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173"},
		AllowedMethods:   []string{"POST", "GET", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
	}).Handler(mux)

	log.Println("server running on :8081")
	http.ListenAndServe(":8081", handlerWithCors)
}