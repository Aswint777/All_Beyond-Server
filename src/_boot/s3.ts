import { S3Client } from "@aws-sdk/client-s3";
import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION as string, // ✅ Correct region variable
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY as string,
    },
  });

export default s3;
