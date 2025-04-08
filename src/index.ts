import express, { Application } from "express";
import dotenv from "dotenv";
import { routers } from "./presentation/routes/authRoutes";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import { dependencies } from "./_boot/dependency/dependencies";
import { connectMongoDB } from "./infrastructure/database/dbConnection";
import { instructorRoutes } from "./presentation/routes/instructorRoutes";
import { adminRouters } from "./presentation/routes/adminRoutes";
import { studentRoutes } from "./presentation/routes/studentRoutes";

dotenv.config();

const app: Application = express();
// ✅ Remove or Adjust COOP Headers to Fix Google OAuth Issues
app.use((req, res, next) => {
  res.removeHeader("Cross-Origin-Opener-Policy"); // ✅ Remove COOP to allow OAuth
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups"); // ✅ Allow OAuth popups
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Referrer-Policy", "no-referrer-when-downgrade"); // ✅ Allows proper OAuth communication
  next();
});

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Define routes

const corsOptions: CorsOptions = {
  origin: (process.env.REACT_APP_URL as string) || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"], // ✅ Allow necessary methods
  allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow required headers
};

// Use CORS middleware with the options
app.use(cors(corsOptions));
app.use("/auth", routers(dependencies));
app.use("/admin", adminRouters(dependencies));
app.use("/instructor", instructorRoutes(dependencies));
app.use("/student",studentRoutes(dependencies));

(async () => {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Start the Express server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(
      "Failed to start the application:",
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1); // Exit the process with failure code
  }
})();
