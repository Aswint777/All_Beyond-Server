import { model, Schema } from "mongoose";
import { categoryEntity } from "../../../domain/entities/categoryEntity";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const category = model<categoryEntity>("category", categorySchema);
