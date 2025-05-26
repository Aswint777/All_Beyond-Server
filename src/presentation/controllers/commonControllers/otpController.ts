import { Request, Response } from "express";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { sendEmail } from "../../../infrastructure/utils/nodeMailerConfig";
import { promises } from "dns";
import { generateOTP } from "../../../_lib/common/generateOtp";

export class OtpController {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  //  Verify OTP Controller
  async otpVerification(req: Request, res: Response): Promise<void> {
    try {
      console.log("Incoming request in verifyOtpController:", req.body);
      const { email, otp } = req.body;
      const otpData = {
        email: email,
        otp: otp,
      };

      const otpMatch = await this.dependencies.useCases
        .otpMatchCheckingUseCase(this.dependencies)
        .execute(otpData);
      console.log("OTP Match Result:", otpMatch);

      if (!otpMatch) {
        res.status(httpStatusCode.CONFLICT).json({
          success: false,
          message: "OTP is incorrect. Please try again.",
        });
        return;
      }

      const verifyOtpComplete = await this.dependencies.useCases
        .verifyOtpTrueUseCase(this.dependencies)
        .execute(email);
      console.log("OTP Verification Complete:", verifyOtpComplete);

      res.status(201).json({
        success: true,
        message: "User registration completed successfully!",
        data:true
      });
      return;
    } catch (error: any) {
      console.error("Error in verifyOtpController:", error.message);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error. Please try again later.",
      });
    }
  }

  //   Resend OTP Controller
  async resendOtp(req: Request, res: Response): Promise<void> {
    try {
      console.log("Incoming request in resendOtpController:", req.body);
      const { email } = req.body;

      const emailExists = await this.dependencies.useCases
        .checkByEmailUseCase(this.dependencies)
        .execute(email);
      console.log("Email Check Result:", emailExists);

      if (!emailExists) {
        res.status(httpStatusCode.CONFLICT).json({
          success: false,
          message: "Email not found. Please sign up again.",
        });
        return;
      }

    
       const otp = generateOTP()
      await sendEmail({
        to: email,   
        subject: "OTP Verification",
        text: `Your OTP is: ${otp}`,
      });
      console.log("last");

      const otpData = {
        email: email,
        otp: otp,
      };
      await this.dependencies.useCases
        .verifyOtpUseCase(this.dependencies)
        .execute(otpData);

      res.status(201).json({
        success: true,
        message: "OTP has been resent successfully!",
        requiresOTP: true,
      });
      return;
    } catch (error: any) {
      console.error("Error in resendOtpController:", error.message);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error. Please try again later.",
      });
    }
  }
}
