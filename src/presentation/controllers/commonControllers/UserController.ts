import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { sendEmail } from "../../../infrastructure/utils/nodeMailerConfig";
import { generateAccessToken, generateRefreshToken } from "../../../_lib/jwt";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export interface ICreateUserUseCase {
  username: string;
  email: string;
  password: string;
}

export class UserController {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  // ✅ Sign Up Method
  async signUp(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body;
      const { checkByNameUseCase, checkByEmailUseCase, createUserUseCase } =
        this.dependencies.useCases;

      // ✅ Input Validation
      if (!name || !email || !password) {
        res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "All fields (name, email, password) are required",
        });
        return;
      }

      // 🛑 Check if the username exists
      const nameResult = await checkByNameUseCase(this.dependencies).execute(
        name
      );

      if (nameResult) {
        res.status(httpStatusCode.CONFLICT).json({
          success: false,
          message: "This username is already taken, please try another one",
        });
        return;
      }

      // 🛑 Check if the email exists
      const emailResult = await checkByEmailUseCase(this.dependencies).execute(
        email
      );
      if (emailResult) {
        res.status(httpStatusCode.CONFLICT).json({
          success: false,
          message: "This email is already registered, please log in",
        });
        return;
      }

      // 🔐 Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      const data = {
        username: name,
        email: email,
        password: hashedPassword,
      };
      // ✅ Create the user
      const newUser = await createUserUseCase(this.dependencies).execute(data);
      if (!newUser) {
        res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Failed to create user, please try again later",
        });
        return;
      }
      console.log(newUser, "success");

      // 🔢 Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // 📧 Send OTP via email
      await sendEmail({
        to: email,
        subject: "OTP Verification",
        text: `Your OTP is: ${otp}`,
      });

      const otpData = {
        email: email,
        otp: otp,
      };
      await this.dependencies.useCases
        .verifyOtpUseCase(this.dependencies)
        .execute(otpData);

      res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "User registered successfully!",
        user: newUser,
        requiresOTP: true,
      });
      return;
    } catch (error: any) {
      console.error("❌ Error during signup:", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal server error. Please try again later.",
      });
    }
  }
  // ✅ Login Method
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      if (!email.trim() || !password.trim()) {
        res
          .status(400)
          .json({ success: false, message: "All fields are required." });
        return;
      }

      // 🔐 Check login credentials
      const userLogin = await this.dependencies.useCases
        .loginUseCase(this.dependencies)
        .execute(email, password);
      if (!userLogin) {
        res
          .status(401)
          .json({ success: false, message: "Invalid email or password" });
        return;
      }

      // 🔑 Generate JWT Tokens
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

      // 🍪 Set cookies for tokens
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

      res.status(200).json({
        success: true,
        data: userLogin,
        message: "User logged in successfully",
      });
    } catch (error: any) {
      console.error("Error during login:", error.message);
      res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  }

  // ✅ Logout Method
  async logout(req: Request, res: Response): Promise<void> {
    try {
      console.log("User logging out...");
      const cookieOptions: any = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 0,
      };

      res.cookie("access_token", "", cookieOptions);
      res.cookie("refresh_token", "", cookieOptions);

      res.status(204).json({ success: true });
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  }

  // ✅ Get User Details Method
  async getUserDetails(req: Request, res: Response): Promise<void> {
    try {
      // 🛑 Extract JWT from cookies
      const token = req.cookies.access_token;
      if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
      }

      // 🛑 Verify JWT
      const secretKey = process.env.ACCESS_TOKEN_SECRET as string;
      const decoded = jwt.verify(token, secretKey) as {
        _id: string;
        email: string;
        role: string;
      };
      const _id = decoded._id;
      // 🔍 Fetch user details
      const userDetails = await this.dependencies.useCases
        .getUserDetailsUseCase(this.dependencies)
        .execute(_id);

      res.status(200).json({
        success: true,
        message: "User details fetched successfully",
        user: userDetails,
      });
    } catch (error: any) {
      console.error("Error in getUserDetails:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // ✅ Google Authentication Method
  async googleAuth(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.body, "Google Auth Data");
      const { credential } = req.body;

      // 🛑 Verify Google ID Token
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      console.log("Payload Audience (aud):", payload?.aud);

      if (!payload || !payload.email) {
        res
          .status(400)
          .json({ success: false, message: "Invalid Google token." });
        return;
      }

      const { email } = payload;

      // 🔍 Check if user exists or create new one
      const userEntry = await this.dependencies.useCases
        .googleAuthUseCase(this.dependencies)
        .execute(email);
      if (!userEntry) {
        res.status(409).json({
          success: false,
          message: "Google authentication failed, try again later",
        });
        return;
      }

      // 🔑 Generate JWT Tokens
      const accessToken = generateAccessToken({
        _id: String(userEntry?._id),
        email: userEntry?.email!,
        role: userEntry?.role!,
      });
      const refreshToken = generateRefreshToken({
        _id: String(userEntry?._id),
        email: userEntry?.email!,
        role: userEntry?.role!,
      });

      // 🍪 Set cookies
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

      res.status(201).json({
        success: true,
        message: "User authenticated successfully!",
        user: userEntry,
      });
    } catch (error: any) {
      console.error("Error in Google authentication:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
