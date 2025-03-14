import { NextFunction, Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
// import { User } from "../../models/User"; // Import User model
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import jwt from "jsonwebtoken";

// Extending MulterRequest to include the files property correctly
interface MulterRequest extends Request {
  files?: {
    profilePhoto?: Express.Multer.File[];
    educationFile?: Express.Multer.File[];
  };
}
              
export class ApplyInstructorController {
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  async instructorApplication(req: Request, res: Response): Promise<void> {
    try {
      const { applyInstructorUseCase } = this.dependencies.useCases;
      console.log("Instructor Application Controller Triggered");
      console.log("Request Body:", req.body);
      console.log(req.params, "_id");
      const { _id } = req.params;
      console.log('hai')
      const profilePhoto =
        req.files && "profilePhoto" in req.files
          ? (req.files.profilePhoto as Express.Multer.File[])[0]?.path
          : "";

      const educationFile =
        req.files && "educationFile" in req.files
          ? (req.files.educationFile as Express.Multer.File[])[0]?.path
          : "";

      console.log(profilePhoto, educationFile);

      // Destructure form fields from request body
      const {
        firstName,
        lastName,
        age,
        qualification,
        address,
        contactNumber,
        gender,
        city,
        country,
        pinNumber,
        email,
      } = req.body;

      const data = {
        _id: _id,
        firstName: firstName,
        lastName: lastName,
        age: age,
        qualification: qualification,
        address: address,
        contactNumber: contactNumber,
        gender: gender,
        city: city,
        country: country,
        pinNumber: pinNumber,
        email: email,
        profilePhoto: profilePhoto,
        educationFile: educationFile,
      };

      const application = await applyInstructorUseCase(
        this.dependencies
      ).execute(data);
      res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "Instructor application submitted successfully",
        // data: newInstructor,
      });
    } catch (error: any) {
      console.error("Error processing application:", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Server error",
        error,
      });
    }
  }
}
