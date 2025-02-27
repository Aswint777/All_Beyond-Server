import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig"; 

// Set up Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "instructor_profiles",  // Cloudinary folder for the uploaded files
    format: file.mimetype.split("/")[1], // Automatically extract format
    public_id: `${Date.now()}-${file.originalname}`, // Generate unique file names
  }),
});

// Create a Multer upload instance
const upload = multer({ storage });

export default upload;
