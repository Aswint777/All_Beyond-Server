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
    // type: {
    //   type: String,
    //   required: true,
    // },
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
