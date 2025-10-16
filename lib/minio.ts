import { S3Client } from "@aws-sdk/client-s3";

const { MINIO_URL, MINIO_USER, MINIO_PASSWORD, MINIO_BUCKET, MINIO_REGION } = process.env;

if (!MINIO_URL || !MINIO_USER || !MINIO_PASSWORD || !MINIO_BUCKET) {
  throw new Error("[err][minio] Missing environment variables for MinIO. These are required. Please check .env");
}

export const s3 = new S3Client(
  {
    region: MINIO_REGION || "au-east-1",
    endpoint: MINIO_URL,
    credentials: {
      accessKeyId: MINIO_USER,
      secretAccessKey: MINIO_PASSWORD,
    },
    forcePathStyle: true,
  }
);

export const bucket = MINIO_BUCKET;
