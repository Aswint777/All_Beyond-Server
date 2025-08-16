import { Server, Socket } from "socket.io";
import { SocketService } from "../../domain/entities/chatEntity";

export class SocketServiceImpl implements SocketService {
  private userSocketMap: Map<string, string> = new Map();
  private userInCallMap: Map<string, boolean> = new Map();

  constructor(private io: Server) {}
    
  registerUser(userId: string, socket: Socket): void {
    console.log('Registering user:', userId, 'Socket ID:', socket.id);
    this.userSocketMap.set(userId, socket.id);
    socket.data.userId = userId;
  }

  unregisterUser(userId: string): void {
    console.log('Unregistering user:', userId);
    this.userSocketMap.delete(userId);  
  }

  emitToRoom(roomId: string, event: string, data: any): void {
    console.log('Emitting to room:', roomId, 'Event:', event, 'Data:', data);
    this.io.to(roomId).emit(event, data);
  } 

  emitToUser(userId: string, event: string, data: any): void {
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      console.log(`Emitting to user ${userId} (socket ${socketId}):`, event, data);
      this.io.to(socketId).emit(event, data);
    } else {
      console.log(`User ${userId} not found in userSocketMap`);
    }
  }

  joinRoom(userId: string, roomId: string): void {
    console.log('Joining room:', { userId, roomId });
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket) {
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
      } else {
        console.log(`Socket not found for socketId: ${socketId}`);
      }
    } else {
      console.log(`User ${userId} not found in userSocketMap`);
    }
  }

  leaveRoom(userId: string, roomId: string): void {
    console.log('Leaving room:', { userId, roomId });
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      const socket = this.io.sockets.sockets.get(socketId);
      if (socket) {
        socket.leave(roomId);
        console.log(`User ${userId} left room ${roomId}`);
      }
    }
  }

  isInRoom(userId: string, roomId: string): boolean {
    console.log('Checking if user is in room:', { userId, roomId });
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      const socket = this.io.sockets.sockets.get(socketId);
      const isInRoom = socket?.rooms.has(roomId) ?? false;
      console.log(`User ${userId} is${isInRoom ? '' : ' not'} in room ${roomId}`);
      return isInRoom;
    }
    console.log(`User ${userId} not found in userSocketMap`);
    return false;
  }

  public isUserInCall(userId: string): boolean {
    const inCall = this.userInCallMap.get(userId) || false;
    console.log(`User ${userId} is${inCall ? '' : ' not'} in call`);
    return inCall;
  }

  public setUserInCall(userId: string): void {
    this.userInCallMap.set(userId, true);
    console.log("Marked user as in-call:", userId);
    this.io.emit("user-in-call", { userId }); 
  }

  public clearUserInCall(userId: string): void {
    this.userInCallMap.delete(userId);
    console.log("Marked user as left call:", userId);
    this.io.emit("user-left-call", { userId }); 
  }

  getUserSocketMap(): Map<string, string> {
    return this.userSocketMap;
  }
}