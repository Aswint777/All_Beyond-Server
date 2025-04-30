// import { Server, Socket } from "socket.io";
// import { SocketServiceImpl } from "../../application/services/SocketServiceImpl";

// export class SocketManager {
//   private io: Server;
//   private socketService: SocketServiceImpl;

//   constructor(server: any) {
//     this.io = new Server(server, {
//       cors: {
//         origin: process.env.CLIENT_URL || "http://localhost:3000",
//         methods: ["GET", "POST"],
//       },
//     });
//     this.socketService = new SocketServiceImpl(this.io);
//     this.initialize();
//   }

//   private initialize(): void {
//     this.io.on("connection", (socket: Socket) => {
//       console.log("User connected:", socket.id);

//       socket.on("register", (userId: string) => {
//         socket.data.userId = userId;
//       });

//       socket.on("joinChat", ({ userId, chatGroupId }: { userId: string; chatGroupId: string }) => {
//         this.socketService.joinRoom(userId, chatGroupId);
//         console.log(`${userId} joined chat ${chatGroupId}`);
//       });

//       socket.on("disconnect", () => {
//         console.log("User disconnected:", socket.id);
//       });
//     });
//   }

//   getSocketService(): SocketServiceImpl {
//     return this.socketService;
//   }
// }