import { generateUserID } from "../../../_lib/common/generateUserID";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import {
  matchOtpEntity,
  verifyOtpEntity,
} from "../../../domain/entities/verifyOtpEntity";
import { otpVerify, User } from "../../database/model";

export class OtpRepository
  implements Pick<IRepositories, "verifyOtp" | "otpMatchChecking">
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  async verifyOtp(otpData: verifyOtpEntity): Promise<verifyOtpEntity | null> {
    try {
      console.log("Executing verifyOtp in OtpRepository...");
      console.log("Incoming OTP Data:", otpData);

      const otpCreateNewUser = await otpVerify.create({ ...otpData });
      console.log("OTP Verification Result:", otpCreateNewUser);

      return otpCreateNewUser || null;
    } catch (error: unknown) {
      console.error("Error in verifyOtp:", error);
      throw new Error("An unexpected error occurred during OTP verification.");
    }
  }

  // ✅ Check OTP Matching
  async otpMatchChecking(data: matchOtpEntity): Promise<boolean | null> {
    try {
      console.log("Executing otpMatchChecking in OtpRepository...");
      console.log("Incoming Data:", data);

      const checkUser = await otpVerify.findOne({ email: data.email });

      if (!checkUser) {
        return false;
      }
      return checkUser.otp === data.otp; // Returns true if OTP matches, false otherwise
    } catch (error: unknown) {
      console.error("Error in otpMatchChecking:", error);
      return null;
    }
  }

  // ✅ Verify OTP as True (User Verification)
  async verifyOtpTrue(email: string): Promise<boolean | null> {
    try {
      console.log("Executing verifyOtpTrue in OtpRepository...");

      const userId = generateUserID();
      const checkUser = await User.findOneAndUpdate(
        { email },
        { isVerified: true, userId },
        { new: true }
      );

      return !!checkUser;
    } catch (error: unknown) {
      console.error("Error in verifyOtpTrue:", error);
      throw new Error("An unexpected error occurred while verifying OTP.");
    }
  }
}
