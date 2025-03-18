import bcrypt from "bcrypt";
import { IDependencies } from "../../interfaces/IDependencies";
import { UserEntity } from "../../../domain/entities/User";
import { constant } from "../../../_lib/common/constant";

export class ProfileUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  // ✅ Edit Profile
  async profileEditUseCase(data: UserEntity): Promise<UserEntity | null> {
    try {
      const { profileEdit } = this.dependencies.repositories;
      console.log("Executing editProfileUseCase with data:", data);
      const result = await profileEdit(data);
      if (!result) {
        return null;
      }
      return result;
    } catch (error: any) {
      console.error("Error in editProfileUseCase:", error);
      throw new Error(error?.message || "Error in profile editing.");
    }
  }

  // ✅ Change Password
  async changePasswordUseCase(
    email: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<boolean | null> {
    try {
      console.log("Executing changePasswordUseCase");

      if (newPassword !== confirmPassword) {
        return false;
      }

      const user = await this.dependencies.repositories.checkByEmail(email);
      if (!user || !user.password) {
        return false;
      }

      console.log(user, "User found in changePasswordUseCase");

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return false;
      }

      return true;
    } catch (error: any) {
      console.error("Error in changePasswordUseCase:", error);
      throw new Error(error?.message || "Error in changing password.");
    }
  }

  // ✅ Upload Profile Photo
  async uploadPhotoUseCase(
    userId: string,
    profilePhoto: string
  ): Promise<UserEntity | null> {
    try {
      console.log(`Executing uploadPhotoUseCase for userId: ${userId}`);
      const result = this.dependencies.repositories.uploadPhoto(
        userId,
        profilePhoto
      );
      if (!result) {
        return null;
      }
      return result;
    } catch (error: any) {
      console.error("Error in uploadPhotoUseCase:", error);
      throw new Error(error?.message || "Error in uploading profile photo.");
    }
  }

  async switchUserRoleUseCase(id:string):Promise<UserEntity|null>{
    try {
      const {switchRole} = this.dependencies.repositories
      return await switchRole(id)
    } catch (error:constant) {
      throw new Error(error?.message || "Error in switching Role.");
    }
  }
}
