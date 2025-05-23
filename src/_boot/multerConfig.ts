import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multerS3 from "multer-s3";
import cloudinary from "./cloudinaryConfig";
import s3 from "./s3";

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "instructor_profiles",
    format: file.mimetype.split("/")[1],
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

const s3Storage = multerS3({
  s3,
  bucket: process.env.AWS_S3_BUCKET_NAME as string,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const fileType = file.fieldname.startsWith("video_")
      ? "videos"
      : "thumbnails";
    cb(null, `course_assets/${fileType}/${Date.now()}-${file.originalname}`);
  },
});

export const uploadCloudinary = multer({ storage: cloudinaryStorage });
export const uploadS3 = multer({ storage: s3Storage });
