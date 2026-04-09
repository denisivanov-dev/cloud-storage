package storage

import (
	"context"
	"io"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

var client *minio.Client

func init() {
	var err error

	client, err = minio.New("localhost:9000", &minio.Options{
		Creds:  credentials.NewStaticV4("minio", "minio123", ""),
		Secure: false,
	})

	if err != nil {
		panic(err)
	}
}

func Put(file io.Reader, key string, size int64, contentType string) error {
	_, err := client.PutObject(
		context.Background(),
		"files",
		key,
		file,
		size,
		minio.PutObjectOptions{
			ContentType: contentType,
		},
	)

	return err
}

func Stat(key string) (int64, string, error) {
	info, err := client.StatObject(
		context.Background(),
		"files",
		key,
		minio.StatObjectOptions{},
	)
	if err != nil {
		return 0, "", err
	}

	return info.Size, info.ContentType, nil
}


func Get(key string) (*minio.Object, error) {
	obj, err := client.GetObject(
		context.Background(),
		"files",
		key,
		minio.GetObjectOptions{},
	)
	if err != nil {
		return nil, err
	}

	return obj, nil
}