import { S3Client } from "@aws-sdk/client-s3";

export function s3Client() {
  const { MINIO_URL, MINIO_USER, MINIO_PASSWORD, MINIO_BUCKET } = process.env;

  if (!MINIO_URL || !MINIO_USER || !MINIO_PASSWORD || !MINIO_BUCKET) {
    throw new Error("[err][minio] Missing environment variables for MinIO. Check .env");
  }

  return {
    s3: new S3Client({
      region: "au-east-1",
      endpoint: MINIO_URL,
      credentials: {
        accessKeyId: MINIO_USER,
        secretAccessKey: MINIO_PASSWORD,
      },
      forcePathStyle: true,
    }),
    bucket: MINIO_BUCKET,
  };
}