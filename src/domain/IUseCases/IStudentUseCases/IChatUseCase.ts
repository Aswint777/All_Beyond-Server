import { AddMember, AddMemberData, ChatGroup, ChatGroupInput, Message, TextMessage, UserChatList } from "../../entities/chatEntity";

export interface ICreateChatUseCase {
  execute(data:ChatGroupInput): Promise<ChatGroup | null>;
}
export interface IAddMemberUseCase {
  execute(data:AddMember): Promise<AddMemberData | null>;
}

export interface IGetUserChatsUseCase {
  execute(userId:string): Promise<UserChatList[] | null>; 
}

export interface IGetChatMessagesUseCase {
  execute(chatId:string,userId:string): Promise<Message[] | null>;
}
export interface ISendMessagesUseCase {
  execute(data:TextMessage): Promise<Message | null>;
}

export interface IGetLastMessageUseCase {
  execute(chatId:string,userId:string): Promise<{ lastMessage: Message[] | null; unreadCount: number }>;
}

export interface IVideoChatListUseCase {
  execute(userId:string): Promise<UserChatList[] | null>; 
}