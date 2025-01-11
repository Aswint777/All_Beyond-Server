import express from "express";
import dotenv from "dotenv";
import router from "./presentation/routes/authRoutes";
import { connectDB } from "./infrastructure/database/dbConnection";
import cors,{ CorsOptions } from "cors";
import cookieParser from "cookie-parser"

dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
// Define routes


// Define the allowed origins
const allowedOrigins: string = "http://localhost:5173";

// Define the CORS options with type checking
const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

// Use CORS middleware with the options
app.use(cors(corsOptions));
app.use('/auth', router);

(async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Start the Express server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the application:", error instanceof Error ? error.message : String(error));
    process.exit(1); // Exit the process with failure code
  }
})();

// //connect MongoDB
// connectDB()  
  
// // port
// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
  