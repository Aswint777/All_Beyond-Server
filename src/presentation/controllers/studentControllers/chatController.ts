// import { Request, Response } from "express";
// import { IDependencies } from "../../../application/interfaces/IDependencies";

// export class ChatController {
//   private dependencies: IDependencies;

//   constructor(dependencies: IDependencies) {
//     this.dependencies = dependencies;
//   }
//   // student course payment controller
//   async getUserChats(req: Request, res: Response): Promise<void> {
//     const {} = this.dependencies.useCases
//     try {
//         const { userId } = req.params;
//         const courses = await this.courseRepository.findByUserId(userId);
//         const chatGroups = await Promise.all(
//           courses
//             .filter((course) => course.chatGroupId)
//             .map(async (course) => {
//               const chatGroup = await this.chatGroupRepository.findById(course.chatGroupId!);
//               return chatGroup ? { ...chatGroup, courseTitle: course.title } : null;
//             })
//         );
//         res.status(200).json(chatGroups.filter((chat) => chat !== null));
//       } catch (error: any) {
//         res.status(500).json({ error: error.message });
//       }
    
//   }

//   async sendMessage(req: Request, res: Response): Promise<void> {
//     try {
//       const { chatGroupId, senderId, content, fileUrl } = req.body;
//       const message = await this.sendMessage.execute(chatGroupId, senderId, content, fileUrl);
//       res.status(201).json(message);
//     } catch (error: any) {
//       res.status(500).json({ error: error.message });
//     }
//   }

//   async getChatMessages(req: Request, res: Response): Promise<void> {
//     try {
//       const { chatGroupId } = req.params;
//       const { page = 1, limit = 20 } = req.query;
//       const messages = await this.getChatMessages.execute(chatGroupId, {
//         skip: (Number(page) - 1) * Number(limit),
//         limit: Number(limit),
//       });
//       res.status(200).json(messages);
//     } catch (error: any) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// }
