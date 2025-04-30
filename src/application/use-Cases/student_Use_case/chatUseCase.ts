// export class EnrolmentUseCase {
//   private dependencies: IDependencies;

//   constructor(dependencies: IDependencies) {
//     this.dependencies = dependencies;
//   }

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

// }
