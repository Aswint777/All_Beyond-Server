import { generateUserID } from "../../../_lib/common/generateUserID";
import { UserEntity } from "../../../domain/entities/User";
import { User } from "../../database/model";

export const applyInstructor = async (
  data: UserEntity
): Promise<boolean | null> => {
  try {
    console.log(data, "dataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    const applyOne = await User.findOneAndUpdate(
      { _id: data._id }, // Find by ID
      {
        //   $setOnInsert: { _id: data._id }, // Only set `_id` on insert (not update)
        $set: {
          firstName: data.firstName,
          lastName: data.lastName,
          age: data.age,
          qualification: data.qualification,
          address: data.address,
          contactNumber: data.contactNumber,
          gender: data.gender,
          city: data.city,
          country: data.country,
          pinNumber: data.pinNumber,
          email: data.email,
          profilePhoto: data.profilePhoto,
          educationFile: data.educationFile,
          isAppliedInstructor:true
        },
      },
      { upsert: true, new: true } // Create new user if not found
    );
    if(!applyOne){

        return false;
    }
    return true
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error is occurred");
  }
};
