import mongoose, { model, Schema } from "mongoose";
import { ChatGroup } from "../../../domain/entities/chatEntity";
// import { ChatGroup } from "../../../domain/entities/ChatGroup";

const ChatGroupSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  adminId: {
    type: String,
    required: true,
  },
  members: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

ChatGroupSchema.index({ courseId: 1 });
ChatGroupSchema.index({ members: 1 });

export const ChatGroupModel = model<ChatGroup>("ChatGroup", ChatGroupSchema);
