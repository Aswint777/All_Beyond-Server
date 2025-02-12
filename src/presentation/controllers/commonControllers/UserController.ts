import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { sendEmail } from "../../../infrastructure/utils/nodeMailerConfig";
import { generateAccessToken, generateRefreshToken } from "../../../_lib/jwt";
import { controller } from ".";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


// user signUp controller

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
      const { name, email, password, confirmPassword } = req.body;
      const nameResult = await checkByNameUseCase(dependencies).execute(name);
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
      // Hash the password (use bcrypt or similar library)
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


// user Login controller

export const loginController = (dependencies: IDependencies) => {
  const { useCases } = dependencies;
  const { loginUseCase } = useCases;
  return async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const { email, password } = req.body;
      if (
        !email.trim() || !password.trim() 
      ) {
        res.status(httpStatusCode.CONFLICT).json({
          success: false,
          message: "All fields are required.",
        });
        return;
      }
      const userLogin = await loginUseCase(dependencies).execute(
        email,
        password
      );
      console.log(userLogin, "userLogin");
      if (!userLogin) {
        console.log("no login");
        
        res.status(httpStatusCode.CONFLICT).json({
          success: false,
          message: "There is a problem in your Email or password, try again",
        });
        return;
      }

      const accessToken = generateAccessToken({
        _id: String(userLogin?._id),
        email: userLogin?.email!,
        role: userLogin?.role!,
      });
      const refreshToken = generateRefreshToken({
        _id: String(userLogin?._id),
        email: userLogin?.email!,
        role: userLogin?.role!,
      });

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.status(httpStatusCode.OK).json({
        success: true,
        data: userLogin,
        message: "User logged in successfully",
      });
    } catch (error: any) {
      console.error("Error during signup:", error.message);
      res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  };
};


// LogOut controller


export const logOutController = (dependencies: IDependencies) => {
    const { useCases } = dependencies;
    // const {logOutUseCse}=useCases
    return async (req: Request, res: Response) => {
      try {
        console.log("here the console");
        const cookieOptions: any = {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 0,
        };
        res.cookie("access_token", "", cookieOptions);
        res.cookie("refresh_token", "", cookieOptions);
  
        res.status(httpStatusCode.NO_CONTENT).json({
          success: true,
        });
  
        // const authHeader = req.headers.authorization; 
        // if (!authHeader || !authHeader.startsWith("Bearer ")) {
        //     return res.status(401).json({ error: "Authorization token missing or invalid." });
        //   }
        // const token = authHeader.split(" ")[1];
  
        // const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
  
        // console.log("Token decoded successfully:", decoded);
      } catch (error: any) {
        res
          .status(500)
          .json({ error: "Internal server error. Please try again later." });
      }
    };
  };
  

  
  export const getFirstUserDetailsController = (dependencies: IDependencies) => {
    const { useCases } = dependencies;
    const { getUserDetailsUseCase } = useCases;
    return async (req: Request, res: Response) => {
      try {
        // 🛑 Extract JWT from cookies
        const token = req.cookies.access_token;
        if (!token) {
          res.status(401).json({ message: "Unauthorized: No token provided" });
          return
        }
  
        // 🛑 Verify JWT
        const secretKey = process.env.ACCESS_TOKEN_SECRET as string;
        const decoded = jwt.verify(token, secretKey) as {
          _id: string;
          email: string;
          role: string;
        };
        const userDetails = await getUserDetailsUseCase(dependencies).execute(
          decoded._id
        );
  
        res.status(201).json({
          success: true,
          message: "User details is fetched",
          user: userDetails,
        });
        return;
      } catch (error: any) {
        console.error("Error in getFirstUserDetailsController:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    };
  };
  