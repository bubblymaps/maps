import { s3Client } from "@/lib/minio"
import {
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3"

export async function uploadFile(
  key: string,
  file: Buffer | Uint8Array | Blob | string,
  mimeType: string
) {
  const { s3, bucket } = s3Client()
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file,
        ContentType: mimeType,
      })
    )

    const publicUrl = getFileUrl(key)
    return { success: true, url: publicUrl }
  } catch (err) {
    console.error("Error:", err)
    return { success: false, error: err }
  }
}

export async function deleteFile(key: string) {
  try {
    const { s3, bucket } = s3Client()
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    )
    return { success: true }
  } catch (err) {
    console.error("Error:", err)
    return { success: false, error: err }
  }
}

export async function getFileInfo(key: string) {
  try {
    const { s3, bucket } = s3Client()
    const res = await s3.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      })
    )
    return { success: true, metadata: res }
  } catch (err) {
    console.error("Error:", err)
    return { success: false, error: err }
  }
}

export function getFileUrl(key: string) {
  const { s3, bucket } = s3Client()
  const base = process.env.MINIO_URL!.replace(/\/$/, "")
  return `${base}/${bucket}/${key}`
}