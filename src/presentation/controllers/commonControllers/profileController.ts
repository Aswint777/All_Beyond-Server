import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import bcrypt from "bcrypt";
import { constant } from "../../../_lib/common/constant";
import jwt from "jsonwebtoken";

export class ProfileController {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  // ✅ Edit Profile Controller
  async editProfile(req: Request, res: Response): Promise<void> {
    try {
      console.log("Incoming request in editProfileController:", req.body);

      const {
        userId,
        firstName,
        lastName,
        email,
        linkedin,
        facebook,
        instagram,
        currentPassword,
        newPassword,
        confirmPassword,
      } = req.body;

      const { changePasswordUseCase, profileEditUseCase } =
        this.dependencies.useCases;

      // 🛑 Handle Password Change
      let hashedPassword: string | undefined;
      if (currentPassword && newPassword && confirmPassword) {
        const passwordChanged = await changePasswordUseCase(
          this.dependencies
        ).execute(email, currentPassword, newPassword, confirmPassword);

        if (!passwordChanged) {
          res.status(httpStatusCode.CONFLICT).json({
            success: false,
            message: "Error updating profile. Password change failed.",
          });
          return;
        }

        hashedPassword = await bcrypt.hash(newPassword, 10);
      }

      // 📄 Profile Data Update
      const profileData = {
        userId,
        firstName,
        lastName,
        email,
        linkedin,
        facebook,
        instagram,
        password: hashedPassword,
      };

      const updatedProfile = await profileEditUseCase(
        this.dependencies
      ).execute(profileData);

      if (!updatedProfile) {
        res.status(httpStatusCode.CONFLICT).json({
          success: false,
          message: "Error updating profile.",
        });
        return;
      }

      res.status(httpStatusCode.OK).json({
        success: true,
        message: "Profile updated successfully!",
        user: updatedProfile,
      });
      return;
    } catch (error: any) {
      console.error("Error in editProfileController:", error.message);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
      return;
    }
  }

  // ✅ Upload Profile Photo Controller
  async uploadProfilePhoto(req: Request, res: Response): Promise<void> {
    try {
      console.log(
        "Incoming request in uploadProfilePhotoController:",
        req.body
      );

      const userId = req.body.userId;
      const { uploadPhotoUseCase } = this.dependencies.useCases;

      // 📷 Extract Photo Path
      const profilePhoto =
        req.files && "profilePhoto" in req.files
          ? (req.files.profilePhoto as Express.Multer.File[])[0]?.path
          : "";

      if (!profilePhoto) {
        res.status(httpStatusCode.BAD_REQUEST).json({
          success: false,
          message: "No profile photo provided.",
        });
        return;
      }

      // ✅ Upload Photo
      const data = await uploadPhotoUseCase(this.dependencies).execute(
        userId,
        profilePhoto
      );

      res.status(httpStatusCode.OK).json({
        success: true,
        message: "Profile photo uploaded successfully!",
        data: data,
      });
      return;
    } catch (error: any) {
      console.error("Error in uploadProfilePhotoController:", error.message);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
      return;
    }
  }

  // Change user Role controller
  async switchUserRole(req: Request, res: Response): Promise<void> {
    const { switchUserRoleUseCase } = this.dependencies.useCases;
    try {
      console.log("switchUserRole");
      if (!req.user) {
        return;
      }
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
      const id = decoded._id;
      console.log("id :", id);
      const newRole = await switchUserRoleUseCase(this.dependencies).execute(
        id
      );

      res.status(httpStatusCode.OK).json({
        success: true,
        message: "Role switched successfully!",
        data: newRole,
      });
      return;
    } catch (error: constant) {
      console.error("Error in uploadProfilePhotoController:", error.message);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
      return;
    }
  }
}
