package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"cloud-storage/storage/internal/storage"
)

func notifyFileUploaded(storageKey string) error {
	size, contentType, err := storage.Stat(storageKey)
	if err != nil {
		return fmt.Errorf("stat error: %w", err)
	}

	payload := map[string]interface{}{
		"storage_key": storageKey,
		"size":         size,
		"content_type": contentType,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}

	client := &http.Client{
		Timeout: 5 * time.Second,
	}

	req, err := http.NewRequest(
		http.MethodPatch,
		"http://localhost:8000/files/status",
		bytes.NewBuffer(body),
	)
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("bad status: %d", resp.StatusCode)
	}

	return nil
}