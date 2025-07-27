"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = require("./presentation/routes/authRoutes");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dependencies_1 = require("./_boot/dependency/dependencies");
const dbConnection_1 = require("./infrastructure/database/dbConnection");
const instructorRoutes_1 = require("./presentation/routes/instructorRoutes");
const adminRoutes_1 = require("./presentation/routes/adminRoutes");
const studentRoutes_1 = require("./presentation/routes/studentRoutes");
const http_1 = require("http");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// Security headers
app.use((req, res, next) => {
    res.removeHeader("Cross-Origin-Opener-Policy");
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
    next();
});
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// CORS configuration
const corsOptions = {
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
(0, dependencies_1.initializeSocketService)(httpServer);
// Apply CORS and routes
app.use((0, cors_1.default)(corsOptions));
app.use("/auth", (0, authRoutes_1.routers)(dependencies_1.dependencies));
app.use("/admin", (0, adminRoutes_1.adminRouters)(dependencies_1.dependencies));
app.use("/instructor", (0, instructorRoutes_1.instructorRoutes)(dependencies_1.dependencies));
app.use("/student", (0, studentRoutes_1.studentRoutes)(dependencies_1.dependencies));
// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "Server is running" });
});
// Start server
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, dbConnection_1.connectMongoDB)();
        const PORT = process.env.PORT || 5000;
        httpServer.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Socket.IO listening on http://localhost:${PORT}/socket.io`);
        });
    }
    catch (error) {
        console.error("Failed to start application:", error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}))();
