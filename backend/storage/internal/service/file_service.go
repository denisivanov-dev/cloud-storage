package service

import (
	"io"
	"cloud-storage/storage/internal/storage"
)

func Upload(file io.Reader, storageKey string, size int64, contentType string) error {
	err := storage.Put(file, storageKey, size, contentType)
	if err != nil {
		return err
	}

	go notifyFileUploaded(storageKey)

	return nil
}