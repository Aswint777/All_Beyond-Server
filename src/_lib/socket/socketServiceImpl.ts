// import { Server, Socket } from "socket.io";
// import { SocketService } from "../../domain/interfaces/services/SocketService";

// export class SocketServiceImpl implements SocketService {
//   constructor(private io: Server) {}

//   emitToRoom(roomId: string, event: string, data: any): void {
//     this.io.to(roomId).emit(event, data);
//   }

//   joinRoom(userId: string, roomId: string): void {
//     this.io.sockets.sockets.forEach((socket: Socket) => {
//       if (socket.data.userId === userId) {
//         socket.join(roomId);
//       }
//     });
//   }
// }