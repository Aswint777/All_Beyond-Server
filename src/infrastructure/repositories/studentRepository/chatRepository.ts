import mongoose, { isValidObjectId, Types } from "mongoose";
import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { AddMemberData, ChatGroup, ChatGroupDocument, Message, PopulatedCourse, TextMessage, UserChatList } from "../../../domain/entities/chatEntity";
import { ChatGroupModel } from "../../database/model/chatGroupModel";
import { MessageModel } from "../../database/model/MessageModel";

export class ChatRepository
  implements Pick<IRepositories, "createChatRepository">
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
// create chat
  async createChatRepository(data: ChatGroup): Promise<ChatGroup | null> {
    try {
      // Validate input data
      if (!data.courseId || !data.adminId || !data.members?.length) {
        throw new Error(
          "courseId, adminId, and at least one member are required"
        );
      }

      // Convert string IDs to Types.ObjectId
      const courseId = new Types.ObjectId(data.courseId);
      const adminId = new Types.ObjectId(data.adminId);
      const members = data.members.map((id) => new Types.ObjectId(id));

      // Generate unique id if not provided
      const chatGroupId = data.id || new Types.ObjectId().toString();

      // Create chat group document
      const chatGroup = new ChatGroupModel({
        id: chatGroupId,
        title:data.title,
        courseId,
        adminId,
        members,
        createdAt: data.createdAt || new Date(),
      });

      // Save to database
      const savedChatGroup = await chatGroup.save();
      if (!savedChatGroup) return null;

      // Return ChatGroup with string IDs
      return savedChatGroup;
    } catch (error: constant) {
      throw new Error(error.message || "Failed to create chat group");
    }
  }

  // Add members
  async addMemberRepository(data: AddMemberData): Promise<ChatGroup | null> {
    try {
      if (!data.courseId || !data.userId) {
        throw new Error("courseId and userId are required");
      }
  
      const courseId =
        typeof data.courseId === "string"
          ? new Types.ObjectId(data.courseId)
          : data.courseId;
  
      const userId =
        typeof data.userId === "string"
          ? new Types.ObjectId(data.userId)
          : data.userId;
  
      if (!isValidObjectId(courseId) || !isValidObjectId(userId)) {
        throw new Error("Invalid courseId or userId format");
      }
  
      const chatGroup = await ChatGroupModel.findOneAndUpdate(
        { courseId: { $eq: courseId } },
        { $addToSet: { members: userId } },
        { new: true, lean: true }
      );
  
      if (!chatGroup) {
        return null;
      }
  
      return chatGroup;
    } catch (error: any) {
      throw new Error(error.message || "Failed to add member to chat group");
    }
  }


  async  getUserChatsRepository(userId: string): Promise<UserChatList[] | null> {
    try {
      // Validate userId
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
      }
  
      // Convert userId to ObjectId
      const userObjectId = new mongoose.Types.ObjectId(userId);
  
      // Find chat groups where user is a member
      const chatGroups = await ChatGroupModel.find({ members: userObjectId })
        .populate<{ courseId: PopulatedCourse }>("courseId", "courseTitle user enrolledStudents")
        .lean() as ChatGroupDocument[];
  
      // Map to UserChatList interface
      const formattedChats: UserChatList[] = chatGroups
        .filter((chat) => chat.courseId && chat.courseId.courseTitle)
        .map((chat) => ({
          id: chat._id.toString(),
          title: chat.courseId.courseTitle,
          instructorId: chat.courseId.user?.toString(),
          chatGroupId: chat._id.toString(),
          enrolledStudents: chat.courseId.enrolledStudents?.map((id: Types.ObjectId) => id.toString()) || [],
        }));
      //  console.log(formattedChats,';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;');
       
      return formattedChats;
    } catch (error: any) {
      console.error("Error in getUserChatsRepository:", error);
      if (error.message.includes("Invalid")) {
        throw new Error(error.message);
      }
      throw new Error(error.message || "Failed to fetch user chats");
    }
  }

  // get all messages
  async getChatMessagesRepository(chatId:string): Promise<Message[] | null> {
    try {
      const chatMessage = await MessageModel.find({chatGroupId:chatId})
      // console.log(chatMessage,'active now !!!!!!!!!!!!!!!!!');
      
      return chatMessage
    } catch (error: any) {
      console.error("Error :", error);
      if (error.message.includes("Invalid")) {
        throw new Error(error.message);
      }
      throw new Error(error.message || "Failed to fetch user chats");
    }
  }

 // send messages 
async  sendMessagesRepository(data: TextMessage): Promise<Message | null> {
  try {
    // console.log("sendMessagesRepository");

    const chatMessage = await MessageModel.create(data);
    if (!chatMessage) return null;

    // Convert Mongoose document to plain Message object
    const message: Message = {
      id: chatMessage._id.toString(),
      chatGroupId: chatMessage.chatGroupId,
      senderId: chatMessage.senderId,
      content: chatMessage.content,
      username:chatMessage.username,
      fileUrl: chatMessage.fileUrl,
      createdAt: chatMessage.createdAt, // Date
    };

    // Return with createdAt as ISO string for frontend
    return {
      ...message,
      createdAt: message.createdAt,
    };
  } catch (error: any) {
    console.error("Error:", error);
    if (error.message.includes("Invalid")) {
      throw new Error(error.message);
    }
    throw new Error(error.message || "Failed to create message");
  }
}

}
