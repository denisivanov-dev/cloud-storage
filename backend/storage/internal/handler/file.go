package handler

import (
	"fmt"
	"io"
	"net/http"

	"cloud-storage/storage/internal/storage"
)

func GetFileHandler(w http.ResponseWriter, r *http.Request) {
	token := r.URL.Query().Get("token")
	if token == "" {
		http.Error(w, "token required", 400)
		return
	}

	key, err := storage.RedisClient.Get(storage.Ctx, "download:"+token).Result()
	if err != nil {
		http.Error(w, "invalid or expired token", 403)
		return
	}

	storage.RedisClient.Del(storage.Ctx, "download:"+token)

	obj, err := storage.Get(key)
	if err != nil {
		http.Error(w, "not found", 404)
		return
	}
	defer obj.Close()

	size, contentType, err := storage.Stat(key)
	if err != nil {
		http.Error(w, "stat error", 500)
		return
	}

	w.Header().Set("Content-Type", contentType)
	w.Header().Set("Content-Length", fmt.Sprintf("%d", size))

	io.Copy(w, obj)
}