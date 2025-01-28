import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { sendEmail } from "../../../infrastructure/utils/nodeMailerConfig";

export const resentOtpController = (dependencies: IDependencies) => {
  const { useCases } = dependencies;
  const { checkByEmailUseCase, verifyOtpUseCase } = useCases;

  return async (req: Request, res: Response) => {
    try {
      console.log(req.body, "/////");
      const { email } = req.body;
      const emailResult = await checkByEmailUseCase(dependencies).execute(
        email
      );
      console.log(emailResult, "email Result from resent controller");
      if (!emailResult) {
        res.status(httpStatusCode.CONFLICT).json({
          success: false,
          message: "There is a issue with your email, signUp again ",
        });
        return;
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Send OTP via email
      const emailResponse = await sendEmail({
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is: ${otp}`,
      });

      const otpData = {
        //   username:emailResult.userName,
        email: email,
        otp: otp,
      };
      const createResentOtp = await verifyOtpUseCase(dependencies).execute(
        otpData
      );
      console.log(createResentOtp, "mmmm");

      res.status(201).json({
        success: true,
        message: "User registered successfully!",
        user: emailResult,
        requiresOTP: true,
      });
      console.log(res.status(201).json);
      return;
    } catch (error: any) {
      console.error("Error during resend:", error.message);
      res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  };
};
