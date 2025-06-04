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
  VideoChatList,
} from "../../../domain/entities/chatEntity";
import { ChatGroupModel } from "../../database/model/chatGroupModel";
import { MessageModel } from "../../database/model/MessageModel";
import { Course, Enrolment, User } from "../../database/model";

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

  async getChatMessagesRepository(
    chatId: string,
    userId: string
  ): Promise<Message[] | null> {
    try {
      if (!chatId) {
        throw new Error("chatId is required");
      }
      const messages = await MessageModel.find({ chatGroupId: chatId }).lean();

      if (!messages || messages.length === 0) {
        return null;
      }

      const messagesToUpdate = messages
        .filter((msg) => !msg.readBy?.includes(userId))
        .map((msg) => msg._id);

      if (messagesToUpdate.length > 0) {
        await MessageModel.updateMany(
          { _id: { $in: messagesToUpdate } },
          { $addToSet: { readBy: userId } }
        );
        // _______________________________________________________________________________________________
        // const unreadCount = await MessageModel.countDocuments({
        //   chatGroupId: chatId,
        //   readBy: { $ne: userId },
        // });

        // this.dependencies.socketService.emitToRoom(
        //   chatId,
        //   "unreadCountUpdate",
        //   {
        //     userId,
        //     chatGroupId: chatId,
        //     unreadCount,
        //   }
        // );
        // ___________________________________________________________________________________________________________
      }
        
      const updatedMessages = await MessageModel.find({
        chatGroupId: chatId,
      }).lean();

      if (!messages || messages.length === 0) {
        return null; 
      }

      return updatedMessages.map((msg) => ({
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
      const messageData = {
        ...data,
        readBy: [data.senderId], // Initialize readBy with the senderId
      };

      const chatMessage = await MessageModel.create(messageData);
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

      // Fetch the chat group to get participants
      const chatGroup = await ChatGroupModel.findById(chatMessage.chatGroupId);
      if (!chatGroup) {
        console.error("Chat group not found:", chatMessage.chatGroupId);
        return message;
      }
      // __________________________________________________________________________________________________
      // Calculate and emit unread counts for each participant (except the sender)
      // const participants = chatGroup.members || [];
      // for (const participantId of participants) {
      //   if (participantId === data.senderId) continue; // Skip the sender

      //   const unreadCount = await MessageModel.countDocuments({
      //     chatGroupId: chatMessage.chatGroupId,
      //     readBy: { $ne: participantId },
      //   });

      //   this.dependencies.socketService.emitToRoom(
      //     chatMessage.chatGroupId,
      //     "unreadCountUpdate",
      //     {
      //       userId: participantId, 
      //       chatGroupId: chatMessage.chatGroupId,
      //       unreadCount,
      //     }
      //   );
      // }

      // // Emit the new message to the chat group
      // this.dependencies.socketService.emitToRoom(
      //   chatMessage.chatGroupId,
      //   "message",
      //   message
      // );
      // _______________________________________________________________________________________________________
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

  // Get last and Unread messages
  async getLastMessageRepository(
    chatId: string,
    userId: string
  ): Promise<{ lastMessage: Message[] | null; unreadCount: number }> {
    try {
      if (!chatId) {
        throw new Error("chatId is required");
      }

      if (!userId) {
        throw new Error("userId is required");
      }

      const messages = await MessageModel.find({ chatGroupId: chatId })
        .sort({ createdAt: -1 })
        .limit(1)
        .lean();

      const unreadCount = await MessageModel.countDocuments({
        chatGroupId: chatId,
        readBy: { $ne: userId },
      });

      if (!messages || messages.length === 0) {
        return { lastMessage: null, unreadCount };
      }

      const lastMessage = messages.map((msg) => ({
        id: msg._id.toString(),
        chatGroupId: msg.chatGroupId.toString(),
        senderId: msg.senderId.toString(),
        content: msg.content,
        username: msg.username,
        fileUrl: msg.fileUrl,
        createdAt: msg.createdAt,
        readBy: msg.readBy,
      }));

      return { lastMessage, unreadCount };
    } catch (error: any) {
      throw new Error(error.message || "Failed to fetch chat messages");
    }
  }

  // get video call userList
  async videoChatListRepository(
    userId: string
  ): Promise<VideoChatList[] | null> {
    try {
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
      }

      const userObjectId = new mongoose.Types.ObjectId(userId);
      const user = await User.findById(userObjectId).lean();

      if (!user) {
        throw new Error("User not found");
      }

      const isStudent = user.role === "student";
      const isInstructor = user.role === "instructor";

      let users: VideoChatList[] = [];

      if (isStudent) {
        // Fetch courses the student is enrolled in
        const enrolments = await Enrolment.find({ userId: userObjectId })
          .populate<{
            courseId: { user: Types.ObjectId; courseTitle: string };
          }>("courseId", "user")
          .lean();

        // Get unique instructor IDs from enrolled courses
        const instructorIds = [
          ...new Set(
            enrolments
              .filter(
                (enrolment) => enrolment.courseId && enrolment.courseId.user
              )
              .map((enrolment) => enrolment.courseId.user.toString())
          ),
        ];

        // Fetch instructor details
        const instructors = await User.find({
          _id: { $in: instructorIds }, 
          role: "instructor",
        }).lean();
        users = instructors
          .filter((instructor) => instructor.username)
          .map((instructor) => ({ 
            id: instructor._id.toString(),
            username: instructor.username as string,
            online: instructor.online ?? false
          }));
      } else if (isInstructor) {
        // Fetch courses created by the instructor
        const courses = await Course.find({ user: userObjectId }).lean();

        // Get course IDs
        const courseIds = courses.map((course) => course._id);

        // Fetch enrolments for these courses
        const enrolments = await Enrolment.find({
          courseId: { $in: courseIds },
        }).lean();

        const studentIds = [
          ...new Set(
            enrolments
              .filter((enrolment) => enrolment.userId)
              .map((enrolment) => enrolment.userId!.toString())
          ),
        ];

        // Fetch student details
        const students = await User.find({
          _id: { $in: studentIds },
          role: "student",
        }).lean();

        users = students
          .filter((student) => student.username)
          .map((student) => ({
            id: student._id.toString(),
            username: student.username as string,
             online: student.online ?? false

          }));
      } else {
        throw new Error("User role must be either student or instructor");
      }

      return users;
    } catch (error: any) {
      console.error("Error in videoChatListRepository:", error);
      if (
        error.message.includes("Invalid") ||
        error.message.includes("not found")
      ) {
        throw new Error(error.message);
      }
      throw new Error("Failed to fetch user chat list");
    }
  }
}
