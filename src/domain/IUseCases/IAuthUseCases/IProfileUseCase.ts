import { UserEntity } from "../../entities/User";

export interface IProfileEditUseCase {
  execute(data: UserEntity): Promise<UserEntity | null>;
}

export interface IChangePasswordUseCase {
  execute(
    email: string,
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<boolean | null>;
}

export interface IUploadPhotoUseCase {
  execute(userId: string, profilePhoto: string): Promise<boolean | null>;
}
