import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multerS3 from "multer-s3";
import cloudinary from "./cloudinaryConfig"; 
import s3 from "./s3";


// Set up Cloudinary storage for Multer
const cloudinaryStorage  = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "instructor_profiles",  // Cloudinary folder for the uploaded files
    format: file.mimetype.split("/")[1], // Automatically extract format
    public_id: `${Date.now()}-${file.originalname}`, // Generate unique file names
  }),
});

// ✅ AWS S3 Storage for Thumbnails and Videos
const s3Storage = multerS3({
  
  s3, // ✅ Uses configured S3Client
  bucket: process.env.AWS_S3_BUCKET_NAME as string, // ✅ Ensure env variable is correct
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });    
  },
  key: (req, file, cb) => {
    // cb(null, `course_assets/${Date.now()}-${file.originalname}`);
    const fileType = file.fieldname.startsWith('video_') ? 'videos' : 'thumbnails';
    cb(null, `course_assets/${fileType}/${Date.now()}-${file.originalname}`);
  },
});

// ✅ Export correctly
export const uploadCloudinary = multer({ storage: cloudinaryStorage });
export const uploadS3 = multer({ storage: s3Storage });


// Create a Multer upload instance
// const uploadCloudinary = multer({ storage: cloudinaryStorage });

// const uploadS3 = multer({ storage: s3Storage });

// export { uploadCloudinary, uploadS3 };