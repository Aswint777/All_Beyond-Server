import mongoose, { model, Schema } from "mongoose";
import { Message } from "../../../domain/entities/chatEntity";

const MessageSchema = new Schema({
  id: {
    type: String,
  },
  chatGroupId: {
    type: String,
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  username: {
    type: String,
  },
  fileUrl: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  readBy: [
    {
      type: String,
    },
  ],
});

MessageSchema.index({ chatGroupId: 1, createdAt: 1 });

export const MessageModel = model<Message>("Message", MessageSchema);
