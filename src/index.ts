// import express, { Application } from "express";
// import dotenv from "dotenv";
// import { routers } from "./presentation/routes/authRoutes";
// import cors, { CorsOptions } from "cors";
// import cookieParser from "cookie-parser";
// import { dependencies, initializeSocketService } from "./_boot/dependency/dependencies";
// import { connectMongoDB } from "./infrastructure/database/dbConnection";
// import { instructorRoutes } from "./presentation/routes/instructorRoutes";
// import { adminRouters } from "./presentation/routes/adminRoutes";
// import { studentRoutes } from "./presentation/routes/studentRoutes";
// import { createServer } from "http";
// import { SocketManager } from "./_lib/socket/socketManager";

// dotenv.config();
  
// const app: Application = express();

// const httpServer = createServer(app); 
// const socketManager = new SocketManager(httpServer); 
 

// app.use((req, res, next) => {
//   res.removeHeader("Cross-Origin-Opener-Policy"); 
//   res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups"); 
//   // res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
//   res.setHeader("Referrer-Policy", "no-referrer-when-downgrade"); 
//   next();
// });

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// const corsOptions: CorsOptions = {
//   origin: (process.env.REACT_APP_URL as string) || "http://localhost:5173",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
//   allowedHeaders: ["Content-Type", "Authorization"], 
// };


// initializeSocketService(httpServer);
  
// // Use CORS middleware with the options 
// app.use(cors(corsOptions));
// app.use("/auth", routers(dependencies));
// app.use("/admin", adminRouters(dependencies));
// app.use("/instructor", instructorRoutes(dependencies)); 
// app.use("/student",studentRoutes(dependencies));

// // Health check endpoint
// app.get("/health", (req, res) => {
//   res.status(200).json({ status: "Server is running" });
// });

// (async () => {
//   try {
//     // Connect to MongoDB
//     await connectMongoDB();

//     const PORT = process.env.PORT || 5000;

//     httpServer.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//       console.log(`Socket.IO initialized and listening on http://localhost:${PORT}/socket.io`);
//     });
//   } catch (error) {
//     console.error(
//       "Failed to start the application:",
//       error instanceof Error ? error.message : String(error)
//     );
//     process.exit(1); 
//   }
// })();













// import express, { Application } from "express";
// import dotenv from "dotenv";
// import { routers } from "./presentation/routes/authRoutes";
// import cors, { CorsOptions } from "cors";
// import cookieParser from "cookie-parser";
// import { dependencies, initializeSocketService } from "./_boot/dependency/dependencies";
// import { connectMongoDB } from "./infrastructure/database/dbConnection";
// import { instructorRoutes } from "./presentation/routes/instructorRoutes";
// import { adminRouters } from "./presentation/routes/adminRoutes";
// import { studentRoutes } from "./presentation/routes/studentRoutes";
// import { createServer } from "http";

// dotenv.config();

// const app: Application = express();
// const httpServer = createServer(app);

// // Security headers
// app.use((req, res, next) => {
//   res.removeHeader("Cross-Origin-Opener-Policy");
//   res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
//   res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
//   next();
// });

// // Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// // CORS configuration
// const corsOptions: CorsOptions = {
//   origin: process.env.REACT_APP_URL || "http://localhost:5173",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// // Initialize Socket.IO
// initializeSocketService(httpServer);

// // Apply CORS and routes
// app.use(cors(corsOptions));
// app.use("/auth", routers(dependencies));
// app.use("/admin", adminRouters(dependencies));
// app.use("/instructor", instructorRoutes(dependencies));
// app.use("/student", studentRoutes(dependencies));

// // Health check
// app.get("/health", (req, res) => {
//   res.status(200).json({ status: "Server is running" });
// });

// // Start server
// (async () => {
//   try {
//     await connectMongoDB();
//     const PORT = process.env.PORT || 5000;
//     httpServer.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//       console.log(`Socket.IO listening on http://localhost:${PORT}/socket.io`);
//     });
//   } catch (error) {
//     console.error("Failed to start application:", error instanceof Error ? error.message : String(error));
//     process.exit(1);
//   }
// })();




















import express, { Application } from "express";
import dotenv from "dotenv";
import { routers } from "./presentation/routes/authRoutes";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import { dependencies, initializeSocketService } from "./_boot/dependency/dependencies";
import { connectMongoDB } from "./infrastructure/database/dbConnection";
import { instructorRoutes } from "./presentation/routes/instructorRoutes";
import { adminRouters } from "./presentation/routes/adminRoutes";
import { studentRoutes } from "./presentation/routes/studentRoutes";
import { createServer } from "http";

dotenv.config();

const app: Application = express();
const httpServer = createServer(app);

// Security headers
app.use((req, res, next) => {
  res.removeHeader("Cross-Origin-Opener-Policy");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const corsOptions: CorsOptions = {
  origin: process.env.REACT_APP_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Upgrade",
    "Sec-WebSocket-Key",
    "Sec-WebSocket-Version",
    "Sec-WebSocket-Protocol",
  ],
};

// Initialize Socket.IO
initializeSocketService(httpServer);

// Apply CORS and routes
app.use(cors(corsOptions));
app.use("/auth", routers(dependencies));
app.use("/admin", adminRouters(dependencies));
app.use("/instructor", instructorRoutes(dependencies));
app.use("/student", studentRoutes(dependencies));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

// Start server
(async () => {
  try {
    await connectMongoDB();
    const PORT = process.env.PORT || 5000;
    httpServer.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Socket.IO listening on http://localhost:${PORT}/socket.io`);
    });
  } catch (error) {
    console.error("Failed to start application:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
})();