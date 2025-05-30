import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { getUserFromToken } from "../../../infrastructure/utils/getUserFromToken";

export class ChatController {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  // Get list of chats
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

  // Get all the Messages in the chat
  async getChatMessages(req: Request, res: Response): Promise<void> {
    const { getChatMessagesUseCase } = this.dependencies.useCases;
    try {
      const user = getUserFromToken(req, res);
      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const userId = user._id;
      const { chatId } = req.params;
      const chatMessage = await getChatMessagesUseCase(
        this.dependencies
      ).execute(chatId, userId);

      res.status(httpStatusCode.OK).json({
        success: true,
        message: "Chats listed successfully",
        data: chatMessage,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // send messages
  async sendMessages(req: Request, res: Response): Promise<void> {
    const { sendMessagesUseCase } = this.dependencies.useCases;
    const { socketService } = this.dependencies;

    try {
      const { senderId, content, username } = req.body;
      const { chatId } = req.params;
      const data = {
        chatGroupId: chatId,
        senderId: senderId,
        content: content,
        username: username,
      };

      const chatMessage = await sendMessagesUseCase(this.dependencies).execute(
        data
      );
      if (!chatMessage) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const messageData = {
        id: chatMessage.id.toString(),
        chatGroupId: chatMessage.chatGroupId.toString(),
        senderId: chatMessage.senderId.toString(),
        content: chatMessage.content,
        username: chatMessage.username,

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

  // Get Latest messages 
  async getLastMessage(req: Request, res: Response): Promise<void> {
    const { getLastMessageUseCase } = this.dependencies.useCases;
    try {
      const user = getUserFromToken(req, res);
      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const userId = user._id;
      const { chatId } = req.params;
     const { lastMessage, unreadCount } = await getLastMessageUseCase(
      this.dependencies
    ).execute(chatId, userId);


      res.status(httpStatusCode.OK).json({
      success: true,
      message: "Last message fetched successfully",
      data: {
        lastMessage,
        unreadCount,
      },
    });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
