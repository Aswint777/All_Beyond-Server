"use strict";
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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = require("./presentation/routes/authRoutes");
// import { connectDB } from "./infrastructure/database/dbConnection";
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dependencies_1 = require("./_boot/dependency/dependencies");
// import { adminRouters } from "./presentation/routes/adminRoutes";
const dbConnection_1 = require("./infrastructure/database/dbConnection");
const instructorRoutes_1 = require("./presentation/routes/instructorRoutes");
const adminRoutes_1 = require("./presentation/routes/adminRoutes");
// import { instructorRoutes } from "./presentation/routes/instructorRoutes";
dotenv_1.default.config();
const app = (0, express_1.default)();
// ✅ Remove or Adjust COOP Headers to Fix Google OAuth Issues
app.use((req, res, next) => {
    res.removeHeader("Cross-Origin-Opener-Policy"); // ✅ Remove COOP to allow OAuth
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups"); // ✅ Allow OAuth popups
    res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
    res.setHeader("Referrer-Policy", "no-referrer-when-downgrade"); // ✅ Allows proper OAuth communication
    next();
});
// Middleware to parse JSON requests
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Define routes
const corsOptions = {
    origin: process.env.REACT_APP_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"], // ✅ Allow necessary methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow required headers
};
// Use CORS middleware with the options
app.use((0, cors_1.default)(corsOptions));
app.use('/auth', (0, authRoutes_1.routers)(dependencies_1.dependencies));
app.use('/admin', (0, adminRoutes_1.adminRouters)(dependencies_1.dependencies));
app.use('/instructor', (0, instructorRoutes_1.instructorRoutes)(dependencies_1.dependencies));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to MongoDB
        // await connectDB();
        yield (0, dbConnection_1.connectMongoDB)();
        // Start the Express server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Failed to start the application:", error instanceof Error ? error.message : String(error));
        process.exit(1); // Exit the process with failure code
    }
}))();
// //connect MongoDB
// connectDB()  
// // port
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
