import { ChatGroup, Message, TextMessage, UserChatList } from "../../entities/chatEntity";

export interface ICreateChatUseCase {
  execute(data:ChatGroup): Promise<ChatGroup | null>;
}
export interface IAddMemberUseCase {
  execute(data:ChatGroup): Promise<ChatGroup | null>;
}

export interface IGetUserChatsUseCase {
  execute(userId:string): Promise<UserChatList[] | null>;
}

export interface IGetChatMessagesUseCase {
  execute(chatId:string): Promise<Message[] | null>;
}
export interface ISendMessagesUseCase {
  execute(data:TextMessage): Promise<Message | null>;
}
