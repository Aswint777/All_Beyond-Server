import { model, Schema } from "mongoose";
import { verifyOtpEntity } from "../../../domain/entities/verifyOtpEntity";

const otpVerifySchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    otp: {
      type: String || Number,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 30,
    },
  },
  {
    timestamps: true,
  }
);

export const otpVerify = model<verifyOtpEntity>("otpVerify", otpVerifySchema);
