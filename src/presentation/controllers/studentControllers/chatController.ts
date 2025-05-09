import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { getUserFromToken } from "../../../infrastructure/utils/getUserFromToken";

export class ChatController {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }


  async getUserChats(req: Request, res: Response): Promise<void> {
    const { getUserChatsUseCase } = this.dependencies.useCases;
    try {
      const user = getUserFromToken(req, res);
      if (!user) {
        res.status(httpStatusCode.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }
      const userId = user._id;
      const chatList = await getUserChatsUseCase(this.dependencies).execute(
        userId
      );

      if (!chatList || chatList.length === 0) {
        res.status(httpStatusCode.OK).json({
          success: true,
          message: "No chats found",
          data: [],
        });
        return;
      }
      // console.log(chatList, "chatList");

      res.status(httpStatusCode.OK).json({
        success: true,
        message: "Chats listed successfully",
        data: chatList,
      });
    } catch (error: any) {
      console.error("Error in getUserChats:", error);
      const status = error.message.includes("Invalid user ID")
        ? httpStatusCode.BAD_REQUEST
        : httpStatusCode.INTERNAL_SERVER_ERROR;
      res.status(status).json({
        success: false,
        message: error.message || "Failed to fetch chats",
      });
    }
  }

  async getChatMessages(req: Request, res: Response): Promise<void> {
    const {getChatMessagesUseCase} = this.dependencies.useCases
    try {
      // console.log("log Aswin");

      const { chatId } = req.params;
      const chatMessage = await getChatMessagesUseCase(this.dependencies).execute(chatId)
      // console.log("getChatMessages",chatMessage );
      
      res.status(httpStatusCode.OK).json({
        success: true,
        message: "Chats listed successfully",
        data: chatMessage,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async sendMessages(req: Request, res: Response): Promise<void> {
    const {sendMessagesUseCase} = this.dependencies.useCases
    const { socketService } = this.dependencies
 
    try {
      // console.log("sendMessages");
      const {senderId,content,username} = req.body
      const { chatId } = req.params;
      // console.log(req.body,"getChatMessages", chatId);
      const data = {
        chatGroupId: chatId,
        senderId: senderId,
        content: content,
        username:username,
      }
      console.log(username,'444444444444444');
      
      const chatMessage = await sendMessagesUseCase(this.dependencies).execute(data)
      if(!chatMessage){
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const messageData = {
        id: chatMessage.id.toString(),
        chatGroupId: chatMessage.chatGroupId.toString(),
        senderId: chatMessage.senderId.toString(),
        content: chatMessage.content,
        username:chatMessage.username,
        // fileUrl: chatMessage.fileUrl,
        createdAt: chatMessage.createdAt,
      };
      console.log("Emitting message to room:", chatId, messageData);
  
     socketService.emitToRoom(chatId, "message", messageData);



      res.status(httpStatusCode.OK).json({
        success: true,
        message: "Chats listed successfully",
        data: chatMessage,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }


}
