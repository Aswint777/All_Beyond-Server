import { ObjectId, Schema, Types } from "mongoose";
import { Socket, Server } from "socket.io";


export interface CourseChat {
    id: string;
    title: string;
    instructorId: string;
    chatGroupId?: string;
    enrolledStudents: string[];
  }

  export interface Message {
    id: string;
    chatGroupId: string;
    senderId: string;
    content: string;
    fileUrl?: string;
    username:string
    createdAt: Date;
    readBy?: string[];
  }

  export interface ChatGroup {
  chatId: string;
  title: string;
  courseId: string;
  adminId: string;
  members: string[];
  createdAt: Date;
}

export interface AddMemberData {
  chatId: string;
  userId?: string;
  courseId?: string;
}

export interface AddMember {
  courseId?: string;
  userId?: string;
}
  

  export interface UserChatList {
    id: string;
    title: string;
    instructorId?: string;
    chatGroupId?: string;
    enrolledStudents: string[];
  }
  
  export interface PopulatedCourse {
    _id: Types.ObjectId;
    courseTitle: string;
    user: Types.ObjectId;
    enrolledStudents: Types.ObjectId[];
  }
  
  export interface ChatGroupDocument {
    _id: Types.ObjectId;
    courseId: PopulatedCourse;
    adminId: Types.ObjectId;
    members: Types.ObjectId[];
    createdAt: Date;
  }

  export interface TextMessage {
    chatGroupId: string;
    senderId: string;
    content?: string;
    fileUrl?: string;

  }


   export interface ChatGroupInput {
      title: string;
      courseId: string;
      adminId: string;
      members: string[];
    }

  export interface SocketService {
    registerUser(userId: string, socket: Socket): void;
    unregisterUser(userId: string): void;
    emitToRoom(roomId: string, event: string, data: any): void;
    joinRoom(userId: string, roomId: string): void;
    leaveRoom(userId: string, roomId: string): void;
    isInRoom(userId: string, roomId: string): boolean;
  }