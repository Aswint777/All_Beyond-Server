import bcrypt from "bcrypt";
import { IDependencies } from "../../interfaces/IDependencies";
import { UserEntity } from "../../../domain/entities/User";
import { constant } from "../../../_lib/common/constant";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";

export class ProfileUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  // ✅ Edit Profile
  async profileEditUseCase(data: UserEntity): Promise<UserEntity | null> {
    try {
      const { profileEdit } = this.dependencies.repositories;
      const result = await profileEdit(data);
      if (!result) {
        return null;
      }
      return result;
    } catch (error: constant) {
      console.error("Error in editProfileUseCase:", error);
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "An unexpected error is occurred",
      };
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
      if (newPassword !== confirmPassword) {
        return false;
      }

      const user = await this.dependencies.repositories.checkByEmail(email);
      if (!user || !user.password) {
        return false;
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return false;
      }

      return true;
    } catch (error: constant) {
      console.error("Error in changePasswordUseCase:", error);
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "An unexpected error is occurred",
      };
    }
  }

  // ✅ Upload Profile Photo
  async uploadPhotoUseCase(
    userId: string,
    profilePhoto: string
  ): Promise<UserEntity | null> {
    try {
      const result = this.dependencies.repositories.uploadPhoto(
        userId,
        profilePhoto
      );
      if (!result) {
        return null;
      }
      return result;
    } catch (error: constant) {
      console.error("Error in uploadPhotoUseCase:", error);
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "An unexpected error is occurred",
      };
    }
  }

  async switchUserRoleUseCase(id: string): Promise<UserEntity | null> {
    try {
      const { switchRole } = this.dependencies.repositories;
      return await switchRole(id);
    } catch (error: constant) {
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "An unexpected error is occurred",
      };
    }
  }
}
