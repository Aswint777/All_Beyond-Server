import express, { Application } from "express";
import dotenv from "dotenv";
import {routers} from "./presentation/routes/authRoutes";
// import { connectDB } from "./infrastructure/database/dbConnection";
import cors,{ CorsOptions } from "cors";
import cookieParser from "cookie-parser"
import { dependencies } from "./_boot/dependency/authDependencies";
import { adminRouters } from "./presentation/routes/adminRoutes";
import {connectMongoDB} from "./infrastructure/database/dbConnection";
import { instructorRoutes } from "./presentation/routes/instructorRoutes";

dotenv.config();

const app:Application = express();

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
app.use('/auth', routers(dependencies));
app.use('/admin', adminRouters(dependencies));
app.use('/instructor',instructorRoutes(dependencies));



(async () => {
  try {
    // Connect to MongoDB
    // await connectDB();
    await connectMongoDB()


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
  