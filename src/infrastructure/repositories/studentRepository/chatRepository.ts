// import { IDependencies } from "../../../application/interfaces/IDependencies";
// import { IRepositories } from "../../../application/interfaces/IRepositories";

// export class ChatRepository
//   implements Pick<IRepositories, "coursePaymentRepository">
// {
//   private dependencies: IDependencies;
//   constructor(dependencies: IDependencies) {
//     this.dependencies = dependencies;
//   }
//   async findByChatGroupId(
//     chatGroupId: string,
//     options: { skip?: number; limit?: number } = {}
//   ): Promise<Message[]> {
//     const query = MessageModel.find({ chatGroupId }).sort({ createdAt: 1 });
//     if (options.skip) query.skip(options.skip);
//     if (options.limit) query.limit(options.limit);
//     return query.lean();
//   }

//   async create(chatGroup: ChatGroup): Promise<ChatGroup> {
//     const created = await ChatGroupModel.create(chatGroup);
//     return created.toObject();
//   }

//   async findById(id: string): Promise<ChatGroup | null> {
//     return ChatGroupModel.findOne({ id }).lean();
//   }

//   async addMember(chatGroupId: string, userId: string): Promise<void> {
//     await ChatGroupModel.updateOne({ id: chatGroupId }, { $addToSet: { members: userId } });
//   }
// }
