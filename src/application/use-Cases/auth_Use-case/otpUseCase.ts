import { matchOtpEntity, verifyOtpEntity } from "../../../domain/entities/verifyOtpEntity";
import { IDependencies } from "../../interfaces/IDependencies";

export class OtpUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  // ✅ Verify OTP
  async verifyOtpUseCase(otpData: verifyOtpEntity): Promise<verifyOtpEntity|null> {
    try {
      console.log("Executing verifyOtpUseCase");
      return await this.dependencies.repositories.verifyOtp(otpData);
    } catch (error: any) {
      console.error("Error in verifyOtpUseCase:", error);
      throw new Error(error?.message || "Error in OTP verification.");
    }
  }



  // ✅ Match OTP
  async otpMatchCheckingUseCase(data: matchOtpEntity): Promise<boolean|null> {
    try {
      console.log("Executing otpMatchCheckingUseCase with data:", data);
      const result = await this.dependencies.repositories.otpMatchChecking(data);
      if(!result){
        return false
      }
      return true
    } catch (error: any) {
      console.error("Error in otpMatchCheckingUseCase:", error);
      throw new Error(error?.message || "Error in OTP matching.");
    }
  }
    // ✅ Verify OTP as True
    async verifyOtpTrueUseCase(email: string): Promise<boolean|null> {
      try {
        console.log("Executing verifyOtpTrueUseCase");
        const result = await this.dependencies.repositories.verifyOtpTrue(email);
        if(!result){
          return false
        }
        return true
      } catch (error: any) {
        console.error("Error in verifyOtpTrueUseCase:", error);
        throw new Error(error?.message || "Error in OTP verification completion.");
      }
    }
}
