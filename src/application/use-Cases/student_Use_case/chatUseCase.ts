import { constant } from "../../../_lib/common/constant";
import {
  AddMember,
  AddMemberData,
  ChatGroup,
  ChatGroupInput,
  Message,
  TextMessage,
  UserChatList,
} from "../../../domain/entities/chatEntity";
import { IDependencies } from "../../interfaces/IDependencies";

export class ChatUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async createChatUseCase(data: ChatGroupInput): Promise<ChatGroup | null> {
    try {
      const { createChatRepository } = this.dependencies.repositories;
      return await createChatRepository(data);
    } catch (error: constant) {
      throw new Error("An unexpected error is occurred");
    }
  }

  async addMemberUseCase(data: AddMember): Promise<AddMemberData | null> {
    const { addMemberRepository } = this.dependencies.repositories;
    try {
      if (!data.courseId || !data.userId) {
        throw new Error("chatId and userId are required");
      }

      const result = await addMemberRepository(data);
      if (!result) {
        throw new Error("Failed to add member to chat group");
      }

      return result;
    } catch (error: any) {
      throw new Error(error.message || "Failed to add member");
    }
  }

  async getUserChatsUseCase(userId: string): Promise<UserChatList[] | null> {
    try {
      const { getUserChatsRepository } = this.dependencies.repositories;
      return await getUserChatsRepository(userId);
    } catch (error: constant) {
      throw new Error("An unexpected error is occurred");
    }
  }

  async getChatMessagesUseCase(
    chatId: string,
    userId: string
  ): Promise<Message[] | null> {
    try {
      const { getChatMessagesRepository } = this.dependencies.repositories;
      const messageResult = await getChatMessagesRepository(chatId, userId);
      if (!messageResult) return null;
      return messageResult;
    } catch (error: constant) {
      throw new Error("An unexpected error is occurred");
    }
  }

  async sendMessagesUseCase(data: TextMessage): Promise<Message | null> {
    try {
      const { sendMessagesRepository } = this.dependencies.repositories;
      console.log("sendMessagesUseCase");

      return await sendMessagesRepository(data);
    } catch (error: constant) {
      throw new Error("An unexpected error is occurred");
    }
  }

  async getLastMessageUseCase(
    chatId: string,
    userId: string
  ): Promise<{ lastMessage: Message[] | null; unreadCount: number }> {
    try {
      const { getLastMessageRepository } = this.dependencies.repositories;
      const messageResult = await getLastMessageRepository(chatId, userId);
      return messageResult;
    } catch (error: constant) {
      throw new Error("An unexpected error is occurred");
    }
  }
}
