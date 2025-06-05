import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { ChatGroupModel } from '../../infrastructure/database/model/chatGroupModel';
import { generateAccessToken } from '../../_lib/jwt';
import { User } from '../../infrastructure/database/model/userModel';
import { SocketServiceImpl } from './socketServiceImpl';
import { MessageModel } from '../../infrastructure/database/model';

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
    console.log('Initializing SocketManager...');
    this.io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
        allowedHeaders: ['Content-Type', 'Authorization', 'Upgrade', 'Sec-WebSocket-Key', 'Sec-WebSocket-Version'],
      },
    });
    console.log('Socket.IO server initialized');
    this.socketService = new SocketServiceImpl(this.io);
    this.initialize();
  }

  private async authenticateSocket(socket: Socket, next: (err?: Error) => void): Promise<void> {
    try {
      const cookieHeader = socket.handshake.headers.cookie;
      console.log('Cookies:', cookieHeader || 'None');
      if (!cookieHeader) {
        return next(new Error('No cookies provided'));
      }
      const cookies = parse(cookieHeader);
      const accessToken = cookies.access_token;
      const refreshToken = cookies.refresh_token;
      console.log('Tokens:', { accessToken: !!accessToken, refreshToken: !!refreshToken });

      let user: UserPayload | null = null;
      if (accessToken) {
        try {
          user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET || 'your-access-secret') as UserPayload;
          console.log('Access token valid:', user._id);
        } catch (error) {
          console.log('Access token error:', error);
        }
      }

      if (!user && refreshToken) {
        try {
          const refreshUser = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret') as UserPayload;
          const newAccessToken = generateAccessToken(refreshUser);
          console.log('New access token generated for:', refreshUser._id);
          user = refreshUser;
        } catch (error) {
          console.log('Refresh token error:', error);
          return next(new Error('Invalid refresh token'));
        }
      }

      if (!user) {
        return next(new Error('No valid token provided'));
      }

      socket.data.userId = user._id;
      await User.updateOne({ _id: user._id }, { online: true });
      this.io.emit('user-status', { userId: user._id, online: true });
      console.log('Emitted user-status:', { userId: user._id, online: true });
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      return next(new Error('Invalid token'));
    }
  }

  private async initialize(): Promise<void> {
    this.io.use(this.authenticateSocket.bind(this));
    console.log('Socket.IO middleware initialized');

    this.io.on('connection', (socket: Socket) => {
      console.log('User connected:', socket.id, 'User ID:', socket.data.userId);

      socket.on('register', (userId: string) => {
        if (userId === socket.data.userId) {
          this.socketService.registerUser(userId, socket);
          console.log('User registered:', userId, 'Socket ID:', socket.id);
          console.log('userSocketMap:', Array.from(this.socketService.getUserSocketMap()));
        } else {
          socket.emit('error', 'Unauthorized registration');
          console.log('Unauthorized registration attempt:', userId);
        }
      });

      socket.on('joinChat', async ({ userId, chatGroupId }: { userId: string; chatGroupId: string }) => {
        console.log('Join chat:', { userId, chatGroupId });
        if (userId !== socket.data.userId) {
          socket.emit('error', 'Unauthorized');
          return;
        }
        try {
          const chat = await ChatGroupModel.findById(chatGroupId);
          if (!chat) {
            socket.emit('error', 'Chat not found');
            return;
          }
          this.socketService.joinRoom(userId, chatGroupId);
        } catch (error) {
          console.error('Error joining chat:', error);
          socket.emit('error', 'Failed to join chat');
        }
      });

      socket.on('typing', ({ userId, chatGroupId }: { userId: string; chatGroupId: string }) => {
        if (userId === socket.data.userId && this.socketService.isInRoom(userId, chatGroupId)) {
          this.socketService.emitToRoom(chatGroupId, 'typing', { userId, chatGroupId });
        }
      });  

      socket.on('stopTyping', ({ userId, chatGroupId }: { userId: string; chatGroupId: string }) => {
        if (userId === socket.data.userId && this.socketService.isInRoom(userId, chatGroupId)) {
          this.socketService.emitToRoom(chatGroupId, 'stopTyping', { userId, chatGroupId });
        }
      });
 
      socket.on('call-invitation', (data: { to: string; fromUsername: string }) => {
        if (data.to && socket.data.userId) {
          this.socketService.emitToUser(data.to, 'call-invitation', {
            from: socket.data.userId,
            to: data.to,
            fromUsername: data.fromUsername,
          });
          console.log('Call invitation sent:', data);
        }
      });

      socket.on(
        'sendMessage',
        async (data: { chatId: string; senderId: string; content: string; username: string; fileUrl: string }) => {
          const { chatId, senderId } = data;
      
          try {
            console.log('yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
            
            const unreadCount = await MessageModel.countDocuments({
              chatGroupId: chatId,
              readBy: { $ne: senderId },
            });
            console.log('kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk!!!!!!!!!!!!!!!!!');

            this.socketService.emitToRoom(chatId, 'unreadCountUpdate', {
              userId: senderId, 
              chatGroupId: chatId,
              unreadCount,
            });
      
            console.log('Call invitation sent:', data);
          } catch (error) {
            console.error('Error computing unread count:', error);
          }
        }
      );
      

      socket.on('call-invitation-response', (data: { to: string; accepted: boolean }) => {
        if (data.to && socket.data.userId) {
          this.socketService.emitToUser(data.to, 'call-invitation-response', {
            from: socket.data.userId,
            to: data.to,
            accepted: data.accepted,
          });
          console.log('Call invitation response sent:', data);
        }
      });

      socket.on('offer', (data: { to: string; offer: RTCSessionDescriptionInit }) => {
        if (data.to && socket.data.userId) {
          this.socketService.emitToUser(data.to, 'offer', {
            from: socket.data.userId,
            to: data.to,
            offer: data.offer,
          });
          console.log('Offer sent:', data);
        }
      });

      socket.on('answer', (data: { to: string; answer: RTCSessionDescriptionInit }) => {
        if (data.to && socket.data.userId) {
          this.socketService.emitToUser(data.to, 'answer', {
            from: socket.data.userId,
            to: data.to,
            answer: data.answer,
          });
          console.log('Answer sent:', data);
        }
      });

      socket.on('ice-candidate', (data: { to: string; candidate: RTCIceCandidateInit }) => {
        if (data.to && socket.data.userId) {
          this.socketService.emitToUser(data.to, 'ice-candidate', {
            from: socket.data.userId,
            to: data.to,
            candidate: data.candidate,
          });
          console.log('ICE candidate sent:', data);
        }
      });

      socket.on('end-call', (data: { to: string }) => {
        if (data.to && socket.data.userId) {
          this.socketService.emitToUser(data.to, 'end-call', {
            from: socket.data.userId,
            to: data.to,
          });
          console.log('End call sent:', data);
        }
      });

      socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id, 'User ID:', socket.data.userId);
        this.socketService.unregisterUser(socket.data.userId);
        await User.updateOne({ _id: socket.data.userId }, { online: false });
        this.io.emit('user-status', { userId: socket.data.userId, online: false });
        console.log('Emitted user-status:', { userId: socket.data.userId, online: false });
        console.log('userSocketMap:', Array.from(this.socketService.getUserSocketMap()));
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