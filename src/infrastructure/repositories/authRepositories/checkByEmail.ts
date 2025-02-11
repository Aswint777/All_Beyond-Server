import { UserEntity } from "../../../domain/entities/User";
import { User } from "../../database/model/userModel";

export const checkByEmail = async (
  email: string
): Promise<UserEntity | null> => {
  try {
    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
      return emailExist;
    }
    return null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error is occurred");
  }
};

export const checkNotBlocked = async (
  email: string
): Promise<UserEntity | null> => {
  try {
    const notBlocked = await User.findOne({ email: email, isBlocked: false });
    if (notBlocked) {
      return notBlocked;
    }
    return null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error is occurred");
  }
};
