import { constant } from "../../../_lib/common/constant";
import { AddMemberData, ChatGroup, Message, TextMessage, UserChatList } from "../../../domain/entities/chatEntity";
import { IDependencies } from "../../interfaces/IDependencies";

export class ChatUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async createChatUseCase (data: ChatGroup): Promise<ChatGroup | null> {
    try {
        const {createChatRepository} = this.dependencies.repositories
        return await createChatRepository(data)
    } catch (error:constant) {
        throw new Error("An unexpected error is occurred");
    }
  }

  async addMemberUseCase (data: AddMemberData): Promise<AddMemberData | null> {
    try {
        const {addMemberRepository} = this.dependencies.repositories
        return await addMemberRepository(data)
    } catch (error:constant) {
        throw new Error("An unexpected error is occurred");
    }
  }

  async getUserChatsUseCase (userId:string): Promise<UserChatList[] | null> {
    try {
        const {getUserChatsRepository} = this.dependencies.repositories
        return await getUserChatsRepository(userId)
    } catch (error:constant) {
        throw new Error("An unexpected error is occurred");
    }
  }

  async getChatMessagesUseCase (chatId:string): Promise<Message[] | null> {
    try {
        const {getChatMessagesRepository} = this.dependencies.repositories
        return await getChatMessagesRepository(chatId)
    } catch (error:constant) {
        throw new Error("An unexpected error is occurred");
    }
  }

  async sendMessagesUseCase (data:TextMessage): Promise<Message | null> {
    try {
        const {sendMessagesRepository} = this.dependencies.repositories
        console.log('sendMessagesUseCase');
        
        return await sendMessagesRepository(data)
    } catch (error:constant) {
        throw new Error("An unexpected error is occurred");
    }
  }

//   async execute(chatGroupId: string, options?: { skip?: number; limit?: number }): Promise<Message[]> {
//     return this.messageRepository.findByChatGroupId(chatGroupId, options);
//   }

//   async execute(
//     chatGroupId: string,
//     senderId: string,
//     content: string,
//     fileUrl?: string
//   ): Promise<Message> {
//     const message: Message = {
//       id: uuidv4(),
//       chatGroupId,
//       senderId,
//       content,
//       fileUrl,
//       createdAt: new Date(),
//     };

//     const savedMessage = await this.messageRepository.create(message);
//     this.socketService.emitToRoom(chatGroupId, "message", savedMessage);

//     return savedMessage;
//   }

}
