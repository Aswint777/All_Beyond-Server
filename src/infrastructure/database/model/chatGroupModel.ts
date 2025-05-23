import mongoose, { model, Schema, Types } from "mongoose";
import { ChatGroup } from "../../../domain/entities/chatEntity";

const ChatGroupSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
    },
  adminId: {
    type: Types.ObjectId,
    ref: "users",
  },
  members: [
    {
      type:Types.ObjectId,
      ref: "users",
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
