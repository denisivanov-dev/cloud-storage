package handler

import (
	"net/http"
	"cloud-storage/storage/internal/service"
)

func UploadHandler(w http.ResponseWriter, r *http.Request) {
	file, header, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "file required", 400)
		return
	}
	defer file.Close()

	size := header.Size
	contentType := header.Header.Get("Content-Type")

	storageKey := r.FormValue("storage_key")
	if storageKey == "" {
		http.Error(w, "storage_key required", 400)
		return
	}

	err = service.Upload(file, storageKey, size, contentType)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	w.WriteHeader(http.StatusOK)
}