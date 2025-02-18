import { constant } from "../../../_lib/common/constant";
import { UserEntity } from "../../../domain/entities/User";
import { User } from "../../database/model";

export const profileEdit = async (data: UserEntity): Promise<UserEntity | null> => {
  try {
    console.log("Profile Update Data:", data);

    const { userId, firstName, lastName, email, linkedin, facebook, instagram, password } = data;

    if (!userId) {
      console.error("User ID is required for updating profile.");
      return null;
    }
    console.log(facebook,'facebook ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////');
    

    // ✅ Update user details
    const updatedUser = await User.findOneAndUpdate(
      { userId }, // Find user by ID
      {
        $set: {
          firstName,
          lastName,
          email,
          linkedin,
          facebook,
          instagram,
          ...(password && { password }), // ✅ Only update password if provided
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      console.error("User not found.");
      return null;
    }

    console.log("Updated User:", updatedUser);
    return updatedUser;
  } catch (error: constant) {
    console.error("Error updating profile:", error);
    throw new Error("An unexpected error occurred while updating the profile.");
  }
};


export const uploadPhoto = async (userId: string, profilePhoto: string): Promise<boolean | null> => {
  try {
    const photo = await User.findOneAndUpdate(
      { userId: userId },
      { $set: { profilePhoto: profilePhoto } },
      { new: true, upsert: true } 
    );

    if (!photo) {
      return false;
    }
    return true;
  } catch (error: constant) {
    console.error("Error updating profile:", error);
    throw new Error("An unexpected error occurred while updating the profile photo.");
  }
};
