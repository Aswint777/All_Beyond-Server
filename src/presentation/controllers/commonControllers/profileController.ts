import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { constant } from "../../../_lib/common/constant";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import bcrypt, { compare } from "bcrypt";


export const profileEditController = (dependencies: IDependencies) => {
  const {
    useCases: { ProfileEditUseCase, changePasswordUseCase },
  } = dependencies;
  return async (req: Request, res: Response) => {
    try {
      console.log(req.body, "profile controller");
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
      if (currentPassword || newPassword || confirmPassword) {
        const checkPassword = await changePasswordUseCase(dependencies).execute(
          email,
          currentPassword,
          newPassword,
          confirmPassword
        );
        if (checkPassword == false) {
          res.status(httpStatusCode.CONFLICT).json({
            success: false,
            message: "there is an issue in the profile update ",
          });
          return;
        }
      }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      const data = {
        userId: userId,
        firstName: firstName,
        lastName: lastName,
        email: email,
        linkedin: linkedin,
        facebook: facebook,
        instagram: instagram,
        password: hashedPassword,
      };
      const editProfile = await ProfileEditUseCase(dependencies).execute(data);
      if (!editProfile) {
        res.status(httpStatusCode.CONFLICT).json({
          success: false,
          message: "there is an issue in the profile update ",
        });
        return;
      }
      res.status(201).json({
        success: true,
        message: "profile Updated successfully!",
        user: editProfile,
      });
    } catch (error: constant) {
      console.error("Error in profile :", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};



export const uploadProfilePhotoController = (dependencies: IDependencies) => {
  const {
    useCases: {uploadPhotoUseCase},
  } = dependencies;
  return async (req: Request, res: Response) => {
    try {
      console.log(req.body, "profile controller photo");
      const userId = req.body.userId
      const profilePhoto = req.files && "profilePhoto" in req.files 
      ? (req.files.profilePhoto as Express.Multer.File[])[0]?.path 
      : "";
      console.log(profilePhoto,'1234567890',userId)
      const photo = await uploadPhotoUseCase(dependencies).execute(userId,profilePhoto)

      res.status(201).json({
        success: true,
        message: "profile Updated successfully!",
      });
    } catch (error: constant) {
      console.error("Error in profile :", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};
