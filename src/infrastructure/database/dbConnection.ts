import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();

export const connectDB = async (): Promise<void> => {
  
  try {
    // Read MONGO_URI from .env file
    const MONGODB_URI = process.env.MONGO_URI!;
    if (!MONGODB_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    
    console.log(`Connecting to MongoDB at URI: ${MONGODB_URI}`);
    
    // Connect to MongoDB
    
  await mongoose.connect(MONGODB_URI).then(() => {
    console.log("Connected to MongoDB!");
  }).catch((error) => {
    console.error("MongoDB connection error:", error);
  });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error instanceof Error ? error.message : error);
    process.exit(1); // Exit the process with failure code
  }
};

// export const connectDB = async (): Promise<void> => {
//     try {
//       const MONGODB_URI = process.env.MONGO_URI!
//       console.log(MONGODB_URI);
      
//       await mongoose.connect(MONGODB_URI);
//       console.log("MongoDB connected successfully");
//     } catch (error) {
//       console.error("Failed to connect to MongoDB:", error);
//       process.exit(1); // Exit process with failure
//     }
//   };
    

