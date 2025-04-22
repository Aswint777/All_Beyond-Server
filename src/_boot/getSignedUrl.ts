import { Request, Response } from "express";
import { S3Client, HeadObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { httpStatusCode } from "../_lib/common/HttpStatusCode";
import dotenv from "dotenv";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { CloudFront } from "aws-sdk";

// import httpStatusCode from "http-status-codes";

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

  return getSignedUrl(s3, command, { expiresIn: 3600 }); // 5 minutes expiry
};

// Function for fetching signed URLs for videos
export const getSignedUrlForS3Videos = async (fileKey: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `course_assets/videos/${fileKey}`,
  });

  return getSignedUrl(s3, command, { expiresIn: 3600 }); // 5 minutes expiry
};


const cloudFront = new CloudFront();
const signer = new CloudFront.Signer(
  process.env.CLOUDFRONT_KEY_PAIR_ID!,
  process.env.CLOUDFRONT_PRIVATE_KEY!
);

export async function getSignedUrlForCloudFront(videoKey: string, userId: string): Promise<string> {
  try {
    const url = `https://${process.env.CLOUDFRONT_DOMAIN}/${videoKey}`;
    const expires = Math.floor((Date.now() + 60 * 60 * 1000) / 1000); // 1 hour from now

    return new Promise((resolve, reject) => {
      signer.getSignedUrl(
        {
          url,
          expires,
        },
        (err, signedUrl) => {
          if (err) {
            console.error("Error generating signed URL for CloudFront:", err);
            reject(err);
          } else {
            resolve(signedUrl);
          }
        }
      );
    });
  } catch (error: any) {
    console.error(`Error generating CloudFront URL for ${videoKey}:`, error);
    throw new Error("Failed to generate CloudFront URL");
  }
}

