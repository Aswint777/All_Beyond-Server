import mongoose, { isValidObjectId, Types } from "mongoose";
import { constant } from "../../../_lib/common/constant";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import {
  AddMember,
  AddMemberData,
  ChatGroup,
  ChatGroupDocument,
  ChatGroupInput,
  Message,
  PopulatedCourse,
  TextMessage,
  UserChatList,
} from "../../../domain/entities/chatEntity";
import { ChatGroupModel } from "../../database/model/chatGroupModel";
import { MessageModel } from "../../database/model/MessageModel";

export class ChatRepository
  implements Pick<IRepositories, "createChatRepository">
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async createChatRepository(data: ChatGroupInput): Promise<ChatGroup | null> {
    try {
      if (!data.courseId || !data.adminId || !data.members?.length) {
        throw new Error(
          "courseId, adminId, and at least one member are required"
        );
      }

      const chatGroupId = new Types.ObjectId().toString();

      const chatGroup = new ChatGroupModel({
        id: chatGroupId,
        title: data.title,
        courseId: data.courseId, 
        adminId: data.adminId, 
        members: data.members, 
        createdAt: new Date(),
      });

      const savedChatGroup = await chatGroup.save();
      if (!savedChatGroup) return null;

      if (
        !savedChatGroup.courseId ||
        !savedChatGroup.adminId ||
        !savedChatGroup.members
      ) {
        throw new Error("Saved chat group is missing required fields");
      }

      return {
        chatId: savedChatGroup.id,
        title: savedChatGroup.title,
        courseId: savedChatGroup.courseId.toString(), 
        adminId: savedChatGroup.adminId.toString(), 
        members: savedChatGroup.members.map((id) => id.toString()), 
        createdAt: savedChatGroup.createdAt,
      };
    } catch (error: any) {
      throw new Error(error.message || "Failed to create chat group");
    }
  }

  async addMemberRepository(data: AddMember): Promise<AddMemberData | null> {
    try {
        if (!data.courseId || !data.userId) {
          throw new Error("chatId and userId are required");
        }

        const chatGroup = await ChatGroupModel.findOneAndUpdate(
          { courseId: data.courseId },
          { $addToSet: { members: data.userId } },
          { new: true }
        );

        if (!chatGroup) {
          throw new Error("Chat group not found");
        }

        return {
          chatId: chatGroup.chatId,
          userId: data.userId,
          courseId: chatGroup.courseId,
        };
      } catch (error: any) {
        throw new Error(error.message || "Failed to add member to chat group");
      }
  }

  async getUserChatsRepository(userId: string): Promise<UserChatList[] | null> {
    try {
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);

      const chatGroups = (await ChatGroupModel.find({ members: userObjectId })
        .populate<{ courseId: PopulatedCourse }>(
          "courseId",
          "courseTitle user enrolledStudents"
        )
        .lean()) as unknown as ChatGroupDocument[];

      const formattedChats: UserChatList[] = chatGroups
        .filter((chat) => chat.courseId && chat.courseId.courseTitle)
        .map((chat) => ({
          id: chat._id.toString(),
          title: chat.courseId.courseTitle,
          instructorId: chat.courseId.user?.toString(),
          chatGroupId: chat._id.toString(),
          enrolledStudents:
            chat.courseId.enrolledStudents?.map((id: Types.ObjectId) =>
              id.toString()
            ) || [],
        }));

      return formattedChats;
    } catch (error: any) {
      console.error("Error in getUserChatsRepository:", error);
      if (error.message.includes("Invalid")) {
        throw new Error(error.message);
      }
      throw new Error(error.message || "Failed to fetch user chats");
    }
  }

  async getChatMessagesRepository(chatId: string): Promise<Message[] | null> {
    try {
        if (!chatId) {
          throw new Error("chatId is required");
        }

        const messages = await MessageModel.find({ chatGroupId: chatId }).lean();

        if (!messages || messages.length === 0) {
          return null;
        }

        return messages.map((msg) => ({
          id: msg._id.toString(),
          chatGroupId: msg.chatGroupId.toString(),
          senderId: msg.senderId.toString(),
          content: msg.content,
          username: msg.username,
          fileUrl: msg.fileUrl,
          createdAt: msg.createdAt,
        }));
      } catch (error: any) {
        throw new Error(error.message || "Failed to fetch chat messages");
      }
  }

  // send messages
  async sendMessagesRepository(data: TextMessage): Promise<Message | null> {
    try {

      const chatMessage = await MessageModel.create(data);
      if (!chatMessage) return null;

      const message: Message = {
        id: chatMessage._id.toString(),
        chatGroupId: chatMessage.chatGroupId,
        senderId: chatMessage.senderId,
        content: chatMessage.content,
        username: chatMessage.username,
        fileUrl: chatMessage.fileUrl,
        createdAt: chatMessage.createdAt, 
      };

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
