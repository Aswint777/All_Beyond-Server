import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

interface MongoConfig {
  url: string;
  options: mongoose.ConnectOptions;
}

export class MongoDBConnection {
  private static instance: MongoDBConnection;
  private retryAttempts = 3;
  private retryDelay = 5000; // 5 seconds

  private config: MongoConfig = {
    url: process.env.MONGODB_URL || "",
    options: {
      serverSelectionTimeoutMS: 5000,
      retryWrites: true,
      w: "majority",
      ssl: true,
      tls: true,
      // Removed conflicting TLS options for the error of whitelisted!!!
      // tlsInsecure: false,
      // tlsAllowInvalidCertificates: false,
      // tlsAllowInvalidHostnames: false,
      authSource: "admin",
      maxPoolSize: 10,
      minPoolSize: 1,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4  // Force IPv4
    }
  };

  private constructor() {
    this.setupEventHandlers();
    this.setupShutdownHandler();
  }

  public static getInstance(): MongoDBConnection {
    if (!MongoDBConnection.instance) {
      MongoDBConnection.instance = new MongoDBConnection();
    }
    return MongoDBConnection.instance;
  }

  private setupEventHandlers(): void {
    mongoose.connection.on("connected", () => {
      console.log(`MongoDB connected successfully to ${mongoose.connection.name}`);
    });

    mongoose.connection.on("error", (err: Error) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
    });
  }

  private setupShutdownHandler(): void {
    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed through app termination");
        process.exit(0);
      } catch (err) {
        console.error("Error during shutdown:", err);
        process.exit(1);
      }
    });
  }

  private validateConnectionString(url: string): void {
    if (!url.startsWith('mongodb+srv://')) {
      throw new Error('Invalid MongoDB connection string. Must use mongodb+srv:// protocol for Atlas connections');
    }
  }

  private async attemptConnection(attempt: number = 1): Promise<void> {
    try {
      if (!this.config.url) {
        throw new Error("MONGODB_URL environment variable is not defined");
      }

      this.validateConnectionString(this.config.url);
      
      console.log(`Connection attempt ${attempt} of ${this.retryAttempts}...`);
      
      // Ensure URL is properly trimmed and encoded
      const cleanUrl = this.config.url.trim();
      await mongoose.connect(cleanUrl, this.config.options);

    } catch (error) {
      if (attempt === this.retryAttempts) {
        this.handleConnectionError(error);
        return;
      }

      console.log(`Connection failed. Retrying in ${this.retryDelay / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      await this.attemptConnection(attempt + 1);
    }
  }

  private handleConnectionError(error: unknown): void {
    console.error("MongoDB connection failed after all retry attempts:");
    
    if (error instanceof Error) {
      console.error(`Error Name: ${error.name}`);
      console.error(`Error Message: ${error.message}`);
      
      if (error instanceof mongoose.Error) {
        console.error(`Mongoose Error Details: ${error}`);
      }
    } else {
      console.error("Unknown error type:", error);
    }
    
    process.exit(1);
  }

  public async connect(): Promise<void> {
    console.log("Initializing MongoDB connection...");
    await this.attemptConnection();
  }
}

// Usage
export const connectMongoDB = async (): Promise<void> => {
  const mongoConnection = MongoDBConnection.getInstance();
  await mongoConnection.connect();
};