import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
  },
});

// Function for fetching signed URL for thumbnails
export const getSignedUrlForS3thumbnails = async (fileKey: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `course_assets/thumbnails/${fileKey}`,
  });

  return getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes expiry
};

// Function for fetching signed URLs for videos
export const getSignedUrlForS3Videos = async (fileKey: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `course_assets/videos/${fileKey}`,
  });

  return getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes expiry
};
