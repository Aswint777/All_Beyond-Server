import { UserEntity } from "../../../domain/entities/User";
import { User } from "../../database/model/userModel";

export const getUserDetails = async (
  _id: string
): Promise<UserEntity | null> => {
  try {
    const userDetails = await User.findOne({ _id: _id });
    if (!userDetails) {
      return null;
    }
    return userDetails;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error is occurred");
  }
};
