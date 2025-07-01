import { constant } from "../../../_lib/common/constant";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import {
  matchOtpEntity,
  resetOne,
  verifyOtpEntity,
} from "../../../domain/entities/verifyOtpEntity";
import { IDependencies } from "../../interfaces/IDependencies";

export class OtpUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  // ✅ Verify OTP
  async verifyOtpUseCase(
    otpData: verifyOtpEntity
  ): Promise<verifyOtpEntity | null> {
    try {
      return await this.dependencies.repositories.verifyOtp(otpData);
    } catch (error: constant) {
      console.error("Error in verifyOtpUseCase:", error);
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "Error in OTP verification.",
      };
    }
  }

  // ✅ Match OTP
  async otpMatchCheckingUseCase(data: matchOtpEntity): Promise<boolean | null> {
    try {
      const result = await this.dependencies.repositories.otpMatchChecking(
        data
      );
      if (!result) {
        return false;
      }
      return true;
    } catch (error: constant) {
      console.error("Error in otpMatchCheckingUseCase:", error);
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "An unexpected error is occurred",
      };
    }
  }
  // ✅ Verify OTP as True
  async verifyOtpTrueUseCase(email: string): Promise<boolean | null> {
    try {
      const result = await this.dependencies.repositories.verifyOtpTrue(email);
      if (!result) {
        return false;
      }
      return true;
    } catch (error: constant) {
      console.error("Error in verifyOtpTrueUseCase:", error);
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "An unexpected error is occurred",
      };
    }
  }

    async resetPasswordUseCase(Data:resetOne): Promise<boolean | null> {
    try {
      const result = await this.dependencies.repositories.resetPasswordRepo(Data);
      if (!result) {
        return false;
      }
      return true;
    } catch (error: constant) {
      console.error("Error in verifyOtpTrueUseCase:", error);
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "An unexpected error is occurred",
      };
    }
  }
}
