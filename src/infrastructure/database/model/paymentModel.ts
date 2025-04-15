import { model, Schema, Types } from "mongoose";
import { PaymentEntity } from "../../../domain/entities/paymentEntity";

const paymentSchema = new Schema(
  {
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
    },
    userId:{
        type: Types.ObjectId,
        ref: "users",
    },
    amount: {
        type:Number,
        default:0
    },
    instructorShare:{
      type:Number,
      default :0
    },
    adminShare:{
      type:Number,
      default:0
    }
  },
  {
    timestamps: true,
  }
);

export const Payment = model<PaymentEntity>("payment", paymentSchema);
