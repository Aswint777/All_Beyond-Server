import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { sendEmail } from "../../../infrastructure/utils/nodeMailerConfig";

export const signUpController = (dependencies: IDependencies) => {
  const { useCases } = dependencies;
  const {
    createUserUseCase,
    checkByEmailUseCase,
    checkByNameUseCase,
    verifyOtpUseCase,
  } = useCases;
  return async (req: Request, res: Response) => {
    try {
      console.log(req.body, "  === Received Data ===");

      const { name, email, password, confirmPassword } = req.body;

      const nameResult = await checkByNameUseCase(dependencies).execute(name);
      console.log(nameResult, "nameResult");

      if (nameResult) {
        res.status(httpStatusCode.CONFLICT).json({
          success: false,
          message: "UserName is already taken , Try alternative ",
        });
        return;
      }

      const emailResult = await checkByEmailUseCase(dependencies).execute(
        email
      );

      if (emailResult) {
        res.status(httpStatusCode.CONFLICT).json({
          success: false,
          message: "this Email is already Logged , Try to Login ",
        });
        return;
      }

      // let d ="admin@123"
      // let b =d.trim()
      // const hashedPasswordn = await bcrypt.hash(b,10);

      //       await User.create({username:'admin',email:"admin@gmail.com",role:"admin",isVerified:true,password:hashedPasswordn})

      // Hash the password (use bcrypt or similar library)
      //
      const hashedPassword = await bcrypt.hash(password, 10);

      const data = {
        username: name,
        email: email,
        password: hashedPassword,
      };

      const newUser = await createUserUseCase(dependencies).execute(data);
      // Generate an OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Send OTP via email
      const emailResponse = await sendEmail({
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is: ${otp}`,
      });
      console.log("User created:", newUser);

      const otpData = {
        // username:name,
        email: email,
        otp: otp,
      };

      const createOtpVerificationData = await verifyOtpUseCase(
        dependencies
      ).execute(otpData);

      res.status(201).json({
        success: true,
        message: "User registered successfully!",
        user: newUser,
        requiresOTP: true,
      });
      console.log(res.status(201).json);
      return;
    } catch (error: any) {
      console.error("Error during signup:", error.message);
      res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  };
};
