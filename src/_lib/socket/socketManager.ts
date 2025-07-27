import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import { ChatGroupModel } from "../../infrastructure/database/model/chatGroupModel";
import { generateAccessToken } from "../../_lib/jwt";
import { User } from "../../infrastructure/database/model/userModel";
import { SocketServiceImpl } from "./socketServiceImpl";
import { MessageModel } from "../../infrastructure/database/model";

interface UserPayload {
  _id: string;
  email: string;
  role: string;
  username?: string;
}

export class SocketManager {
  private io: Server;
  private socketService: SocketServiceImpl;

  constructor(server: any) {
    console.log("Initializing SocketManager...");
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: [
          "Content-Type",
          "Authorization",
          "Upgrade",
          "Sec-WebSocket-Key",
          "Sec-WebSocket-Version",
          "Sec-WebSocket-Protocol",
        ],
      },
    });
    console.log("Socket.IO server initialized");
    this.socketService = new SocketServiceImpl(this.io);
    this.initialize();
  }

  private async authenticateSocket(
    socket: Socket,
    next: (err?: Error) => void
  ): Promise<void> {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      console.log("Cookies:", cookieHeader || "None");
      if (!cookieHeader) {
        return next(new Error("No cookies provided"));
      }
      const cookies = parse(cookieHeader);
      const accessToken = cookies.access_token;
      const refreshToken = cookies.refresh_token;
      console.log("Tokens:", {
        accessToken: !!accessToken,
        refreshToken: !!refreshToken,
      });

      let user: UserPayload | null = null;
      if (accessToken) {
        try {
          user = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET || "your-access-secret"
          ) as UserPayload;
          console.log("Access token valid:", user._id);
        } catch (error) {
          console.log("Access token error:", error);
        }
      }

      if (!user && refreshToken) {
        try {
          const refreshUser = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret"
          ) as UserPayload;
          const newAccessToken = generateAccessToken(refreshUser);
          console.log("New access token generated for:", refreshUser._id);
          user = refreshUser;
        } catch (error) {
          console.log("Refresh token error:", error);
          return next(new Error("Invalid refresh token"));
        }
      }

      if (!user) {
        return next(new Error("No valid token provided"));
      }

      const sendingUser = await User.updateOne(
        { _id: user._id },
        { online: true }
      );
      console.log(
        user.username,
        "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh"
      );

      socket.data.userId = user._id;
      socket.data.username = user.username || "Unknown";
      this.io.emit("user-status", { userId: user._id, online: true });
      console.log("Emitted user-status:", { userId: user._id, online: true });
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      return next(new Error("Invalid token"));
    }
  }

  private async initialize(): Promise<void> {
    this.io.use(this.authenticateSocket.bind(this));
    console.log("Socket.IO middleware initialized");

    this.io.on("connection", (socket: Socket) => {
      console.log("User connected:", socket.id, "User ID:", socket.data.userId);

      socket.on("register", (userId: string) => {
        if (userId === socket.data.userId) {
          this.socketService.registerUser(userId, socket);
          console.log("User registered:", userId, "Socket ID:", socket.id);
          console.log(
            "userSocketMap:",
            Array.from(this.socketService.getUserSocketMap())
          );
        } else {
          socket.emit("error", "Unauthorized registration");
          console.log("Unauthorized registration attempt:", userId);
        }
      });

      socket.on(
        "joinChat",
        async ({
          userId,
          chatGroupId,
        }: {
          userId: string;
          chatGroupId: string;
        }) => {
          console.log("Join chat:", { userId, chatGroupId });
          if (userId !== socket.data.userId) {
            socket.emit("error", "Unauthorized");
            return;
          }
          try {
            const chat = await ChatGroupModel.findById(chatGroupId);
            if (!chat) {
              socket.emit("error", "Chat not found");
              return;
            }
            this.socketService.joinRoom(userId, chatGroupId);
            console.log(`User ${userId} joined chat ${chatGroupId}`);
          } catch (error) {
            console.error("Error joining chat:", error);
            socket.emit("error", "Failed to join chat");
          }
        }
      );

      socket.on(
        "typing",
        ({ userId, chatGroupId }: { userId: string; chatGroupId: string }) => {
          if (
            userId === socket.data.userId &&
            this.socketService.isInRoom(userId, chatGroupId)
          ) {
            this.socketService.emitToRoom(chatGroupId, "typing", {
              userId,
              chatGroupId,
            });
            console.log(`User ${userId} typing in ${chatGroupId}`);
          }
        }
      );

      socket.on(
        "stopTyping",
        ({ userId, chatGroupId }: { userId: string; chatGroupId: string }) => {
          if (
            userId === socket.data.userId &&
            this.socketService.isInRoom(userId, chatGroupId)
          ) {
            this.socketService.emitToRoom(chatGroupId, "stopTyping", {
              userId,
              chatGroupId,
            });
            console.log(`User ${userId} stopped typing in ${chatGroupId}`);
          }
        }
      );

      socket.on(
        "call-invitation",
        async (data: { to: string; fromUsername: string; from: string }) => {
          if (
            !data.to ||
            !socket.data.userId ||
            data.from !== socket.data.userId
          ) {
            console.log("Invalid call-invitation data:", data);
            return;
          }
          if (this.socketService.isUserInCall(data.to)) {
            this.socketService.emitToUser(socket.data.userId, "call-busy", {
              message: "User is currently in a call.",
            });
            console.log("Call rejected: User is busy:", data.to);
            return;
          }
          if (!this.socketService.getUserSocketMap().has(data.to)) {
            this.socketService.emitToUser(socket.data.userId, "call-busy", {
              message: "User is offline or unavailable.",
            });
            console.log("Call rejected: User offline:", data.to);
            return;
          }
          const user = await User.findById(socket.data.userId);
          const fromUsername = user?.username || "Unknown";

          this.socketService.setUserInCall(socket.data.userId); // Mark caller as in-call
          this.socketService.emitToUser(data.to, "call-invitation", {
            from: socket.data.userId,
            to: data.to,
            fromUsername,
          });
          console.log("Emitted call-invitation:", {
            from: socket.data.userId,
            to: data.to,
            fromUsername,
          });
        }
      );

      socket.on(
        "sendMessage",
        async (data: {
          chatId: string;
          senderId: string;
          content: string;
          username: string;
          fileUrl: string;
        }) => {
          const { chatId, senderId } = data;
          try {
            const unreadCount = await MessageModel.countDocuments({
              chatGroupId: chatId,
              readBy: { $ne: senderId },
            });
            this.socketService.emitToRoom(chatId, "unreadCountUpdate", {
              userId: senderId,
              chatGroupId: chatId,
              unreadCount,
            });
            console.log("Emitted unreadCountUpdate:", {
              chatId,
              senderId,
              unreadCount,
            });
          } catch (error) {
            console.error("Error computing unread count:", error);
          }
        }
      );

      socket.on(
        "call-invitation-response",
        (data: { to: string; accepted: boolean }) => {
          if (!data.to || !socket.data.userId) {
            console.log("Invalid call-invitation-response data:", data);
            return;
          }
          if (data.accepted) {
            this.socketService.setUserInCall(data.to); // Mark callee as in-call
          } else {
            this.socketService.clearUserInCall(socket.data.userId);
            this.socketService.clearUserInCall(data.to);
            this.socketService.emitToUser(data.to, "end-call", {
              from: socket.data.userId,
              to: data.to,
            });
            console.log("Emitted end-call on rejection:", data);
          }
          this.socketService.emitToUser(data.to, "call-invitation-response", {
            from: socket.data.userId,
            to: data.to,
            accepted: data.accepted,
          });
          console.log("Emitted call-invitation-response:", {
            from: socket.data.userId,
            to: data.to,
            accepted: data.accepted,
          });
        }
      );

      socket.on(
        "offer",
        async (data: {
          to: string;
          offer: RTCSessionDescriptionInit;
          fromUsername: string;
        }) => {
          if (!data.to || !socket.data.userId) {
            console.log("Invalid offer data:", data);
            this.socketService.emitToUser(socket.data.userId, "call-busy", {
              message: "Invalid offer request.",
            });
            return; 
          }
          console.log(
            "ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss",
            data
          );

          const user = await User.findById(socket.data.userId);
          const fromUsername = user?.username || "Unknown";

          this.socketService.emitToUser(data.to, "offer", {
            from: socket.data.userId,
            to: data.to,
            offer: data.offer,
            fromUsername,
          });
          console.log("Emitted offer:", {
            from: socket.data.userId,
            to: data.to,
          });
        } 
      );

      socket.on("callee-ready", (data: { to: string }) => {
        if (!data.to || !socket.data.userId) {
          console.log("Invalid callee-ready data:", data);
          return;
        }
        this.socketService.emitToUser(data.to, "callee-ready", {
          from: socket.data.userId,
          to: data.to,
        });
        console.log(
          "Emitted callee-ready from",
          socket.data.userId,
          "to",
          data.to
        );
      });

      socket.on(
        "answer",
        (data: { to: string; answer: RTCSessionDescriptionInit }) => {
          if (!data.to || !socket.data.userId) {
            console.log("Invalid answer data:", data);
            return;
          }
          this.socketService.emitToUser(data.to, "answer", {
            from: socket.data.userId,
            to: data.to,
            answer: data.answer,
          });
          console.log("Emitted answer:", {
            from: socket.data.userId,
            to: data.to,
          });
        }
      );

      socket.on(
        "ice-candidate",
        (data: { to: string; candidate: RTCIceCandidateInit }) => {
          if (!data.to || !socket.data.userId) {
            console.log("Invalid ice-candidate data:", data);
            return;
          }
          this.socketService.emitToUser(data.to, "ice-candidate", {
            from: socket.data.userId,
            to: data.to,
            candidate: data.candidate,
          });
          console.log("Emitted ice-candidate:", {
            from: socket.data.userId,
            to: data.to,
          });
        }
      );

      socket.on("end-call", (data: { to: string }) => {
        if (!data.to || !socket.data.userId) {
          console.log("Invalid end-call data:", data);
          return;
        }
        this.socketService.clearUserInCall(socket.data.userId);
        this.socketService.clearUserInCall(data.to);
        this.socketService.emitToUser(data.to, "end-call", {
          from: socket.data.userId,
          to: data.to,
        });
        console.log("Emitted end-call:", {
          from: socket.data.userId,
          to: data.to,
        });
      });

      socket.on("user-in-call", (data: { userId: string }) => {
        this.socketService.setUserInCall(data.userId);
      });

      socket.on("user-left-call", (data: { userId: string }) => {
        this.socketService.clearUserInCall(data.userId);
      });

      socket.on("disconnect", async () => {
        const userId = socket.data.userId;
        this.socketService.unregisterUser(userId);
        this.socketService.clearUserInCall(userId);
        await User.updateOne({ _id: userId }, { online: false });
        this.io.emit("user-status", { userId, online: false });
        console.log("User disconnected:", userId);
        console.log(
          "userSocketMap:",
          Array.from(this.socketService.getUserSocketMap())
        );
      });
    });
  }

  getSocketService(): SocketServiceImpl {
    return this.socketService;
  }

  getUserSocketMap(): Map<string, string> {
    return this.socketService.getUserSocketMap();
  }
}
