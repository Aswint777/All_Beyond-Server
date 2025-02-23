

// import { Request, Response } from "express";
// // import { IDependencies } from "../../../application/interfaces/IDependencies";
// // import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
// import bcrypt from "bcrypt";
// import { IDependencies } from "../../../application/interfaces/IDependencies";
// import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";

// export class ProfileController {
//   private dependencies: IDependencies;

//   constructor(dependencies: IDependencies) {
//     this.dependencies = dependencies;
//   }

//   // ✅ Edit Profile Controller
//   async editProfile(req: Request, res: Response) {
//     try {
//       console.log("Incoming request in editProfileController:", req.body);

//       const {
//         userId,
//         firstName,
//         lastName,
//         email,
//         linkedin,
//         facebook,
//         instagram,
//         currentPassword,
//         newPassword,
//         confirmPassword,
//       } = req.body;

//       const { changePasswordUseCase, profileEditUseCase } = this.dependencies.useCases;

//       // 🛑 Handle Password Change
//       let hashedPassword: string | undefined;
//       if (currentPassword && newPassword && confirmPassword) {
//         const passwordChanged = await changePasswordUseCase(email, currentPassword, newPassword, confirmPassword);

//         if (!passwordChanged) {
//           return res.status(httpStatusCode.CONFLICT).json({
//             success: false,
//             message: "Error updating profile. Password change failed.",
//           });
//         }

//         hashedPassword = await bcrypt.hash(newPassword, 10);
//       }

//       // 📄 Profile Data Update
//       const profileData = {
//         userId,
//         firstName,
//         lastName,
//         email,
//         linkedin,
//         facebook,
//         instagram,
//         password: hashedPassword,
//       };

//       const updatedProfile = await profileEditUseCase(profileData);

//       if (!updatedProfile) {
//         return res.status(httpStatusCode.CONFLICT).json({
//           success: false,
//           message: "Error updating profile.",
//         });
//       }

//       return res.status(httpStatusCode.OK).json({
//         success: true,
//         message: "Profile updated successfully!",
//         user: updatedProfile,
//       });

//     } catch (error: any) {
//       console.error("Error in editProfileController:", error.message);
//       return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
//     }
//   }

//   // ✅ Upload Profile Photo Controller
//   async uploadProfilePhoto(req: Request, res: Response) {
//     try {
//       console.log("Incoming request in uploadProfilePhotoController:", req.body);

//       const userId = req.body.userId;
//       const { uploadPhotoUseCase } = this.dependencies.useCases;

//       // 📷 Extract Photo Path
//       const profilePhoto = req.files && "profilePhoto" in req.files
//         ? (req.files.profilePhoto as Express.Multer.File[])[0]?.path
//         : "";

//       if (!profilePhoto) {
//         return res.status(httpStatusCode.BAD_REQUEST).json({
//           success: false,
//           message: "No profile photo provided.",
//         });
//       }

//       // ✅ Upload Photo
//       await uploadPhotoUseCase(userId, profilePhoto);

//       return res.status(httpStatusCode.OK).json({
//         success: true,
//         message: "Profile photo uploaded successfully!",
//       });

//     } catch (error: any) {
//       console.error("Error in uploadProfilePhotoController:", error.message);
//       return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
//     }
//   }
// }






// // import { Request, Response } from "express";
// // import { IDependencies } from "../../../application/interfaces/IDependencies";
// // import { constant } from "../../../_lib/common/constant";
// // import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
// // import bcrypt, { compare } from "bcrypt";


// // export const profileEditController = (dependencies: IDependencies) => {
// //   const {
// //     useCases: { ProfileEditUseCase, changePasswordUseCase },
// //   } = dependencies;
// //   return async (req: Request, res: Response) => {
// //     try {
// //       console.log(req.body, "profile controller");
// //       const {
// //         userId,
// //         firstName,
// //         lastName,
// //         email,
// //         linkedin,
// //         facebook,
// //         instagram,
// //         currentPassword,
// //         newPassword,
// //         confirmPassword,
// //       } = req.body;
// //       if (currentPassword || newPassword || confirmPassword) {
// //         const checkPassword = await changePasswordUseCase(dependencies).execute(
// //           email,
// //           currentPassword,
// //           newPassword,
// //           confirmPassword
// //         );
// //         if (checkPassword == false) {
// //           res.status(httpStatusCode.CONFLICT).json({
// //             success: false,
// //             message: "there is an issue in the profile update ",
// //           });
// //           return;
// //         }
// //       }
// //         const hashedPassword = await bcrypt.hash(newPassword, 10);
      
// //       const data = {
// //         userId: userId,
// //         firstName: firstName,
// //         lastName: lastName,
// //         email: email,
// //         linkedin: linkedin,
// //         facebook: facebook,
// //         instagram: instagram,
// //         password: hashedPassword,
// //       };
// //       const editProfile = await ProfileEditUseCase(dependencies).execute(data);
// //       if (!editProfile) {
// //         res.status(httpStatusCode.CONFLICT).json({
// //           success: false,
// //           message: "there is an issue in the profile update ",
// //         });
// //         return;
// //       }
// //       res.status(201).json({
// //         success: true,
// //         message: "profile Updated successfully!",
// //         user: editProfile,
// //       });
// //     } catch (error: constant) {
// //       console.error("Error in profile :", error);
// //       res.status(500).json({ message: "Internal Server Error" });
// //     }
// //   };
// // };



// // export const uploadProfilePhotoController = (dependencies: IDependencies) => {
// //   const {
// //     useCases: {uploadPhotoUseCase},
// //   } = dependencies;
// //   return async (req: Request, res: Response) => {
// //     try {
// //       console.log(req.body, "profile controller photo");
// //       const userId = req.body.userId
// //       const profilePhoto = req.files && "profilePhoto" in req.files 
// //       ? (req.files.profilePhoto as Express.Multer.File[])[0]?.path 
// //       : "";
// //       console.log(profilePhoto,'1234567890',userId)
// //       const photo = await uploadPhotoUseCase(dependencies).execute(userId,profilePhoto)

// //       res.status(201).json({
// //         success: true,
// //         message: "profile Updated successfully!",
// //       });
// //     } catch (error: constant) {
// //       console.error("Error in profile :", error);
// //       res.status(500).json({ message: "Internal Server Error" });
// //     }
// //   };
// // };
