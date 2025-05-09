import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import { SocketServiceImpl } from "./socketServiceImpl";
import { ChatGroupModel } from "../../infrastructure/database/model/chatGroupModel";
import { generateAccessToken } from "../../_lib/jwt";

interface UserPayload {
  _id: string;
  email: string;
  role: string;
  username?: string; // Add if available
}

export class SocketManager {
  private io: Server;
  private socketService: SocketServiceImpl;

  constructor(server: any) {
    console.log('Initializing SocketManager...');
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
    console.log('Socket.IO server initialized');
    this.socketService = new SocketServiceImpl(this.io);
    this.initialize();
  }

  private async authenticateSocket(socket: Socket, next: (err?: Error) => void): Promise<void> {
    try {
      // Parse cookies from socket handshake
      const cookieHeader = socket.handshake.headers.cookie;
      if (!cookieHeader) {
        return next(new Error("Authentication error: No cookies provided"));
      }
      const cookies = parse(cookieHeader);
      const accessToken = cookies.access_token;
      const refreshToken = cookies.refresh_token;

      let user: UserPayload | null = null;

      // Verify access token
      if (accessToken) {
        try {
          user = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET || "your-access-secret"
          ) as UserPayload;
          console.log("Access token valid:", user);
        } catch (error) {
          console.log("Access token expired or invalid. Checking refresh token...");
        }
      }

      // If access token is invalid, try refresh token
      if (!user && refreshToken) {
        try {
          const refreshUser = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret"
          ) as UserPayload;

          // Generate new access token
          const newAccessToken = generateAccessToken(refreshUser);
          // Note: Cannot set cookie here; client must handle refresh via API
          console.log("New access token generated from refresh token:", newAccessToken);

          user = refreshUser;
        } catch (refreshError) {
          console.log("Invalid or expired refresh token:", refreshError);
          return next(new Error("Authentication error: Invalid refresh token"));
        }
      }

      // If no valid token, reject
      if (!user) {
        return next(new Error("Authentication error: No valid token provided"));
      }

      socket.data.userId = user._id;
      next();
    } catch (error) {
      console.error("Socket authentication error:", error);
      return next(new Error("Authentication error: Invalid token"));
    }
  }

  private async initialize(): Promise<void> {
    this.io.use(this.authenticateSocket.bind(this));
    console.log('Socket.IO middleware initialized');

    this.io.on("connection", (socket: Socket) => {
      console.log("User connected:", socket.id, "User ID:", socket.data.userId);

      socket.on("register", (userId: string) => {
        console.log('111111111');
        
        if (userId === socket.data.userId) {
          this.socketService.registerUser(userId, socket);
        } else {
          socket.emit("error", "Unauthorized registration");
        }
      });

      socket.on("joinChat", async ({ userId, chatGroupId }: { userId: string; chatGroupId: string }) => {
        console.log('2222222222');
        
        console.log('Join chat request:', { userId, chatGroupId });
        if (userId !== socket.data.userId) {
          socket.emit("error", "Unauthorized");
          return;
        }
        try {
          console.log('3333333333333333333');
          
          const chat = await ChatGroupModel.findById(chatGroupId);
          if (!chat ) {
            socket.emit("error", "Not authorized to join chat");
            return;
          }
          this.socketService.joinRoom(userId, chatGroupId); 
          console.log(`${userId} joined chat ${chatGroupId}`); 
        } catch (error) {
          console.error("Error joining chat:", error);
          socket.emit("error", "Failed to join chat");
        }
      });

      socket.on("typing", ({ userId, chatGroupId }: { userId: string; chatGroupId: string; }) => {
        console.log('44444444444444444');
        
        if (userId === socket.data.userId && this.socketService.isInRoom(userId, chatGroupId)) {
          this.socketService.emitToRoom(chatGroupId, "typing", { userId, chatGroupId });
        }
      }); 
 
      socket.on("stopTyping", ({ userId, chatGroupId }: { userId: string; chatGroupId: string }) => {
        if (userId === socket.data.userId && this.socketService.isInRoom(userId, chatGroupId)) {
          this.socketService.emitToRoom(chatGroupId, "stopTyping", { userId, chatGroupId });
        }
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id, "User ID:", socket.data.userId);
        this.socketService.unregisterUser(socket.data.userId);
      });
    });
  }

  getSocketService(): SocketServiceImpl {
    return this.socketService;
  }
}



