import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { UserEntity } from "../../../domain/entities/User";
import { User } from "../../database/model";

export class ApplyInstructor
  implements Pick<IRepositories, "instructorApplication">
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  // apply for instructor
  async instructorApplication(data: UserEntity): Promise<boolean | null> {
    try {
      const applyOne = await User.findOneAndUpdate(
        { _id: data._id },
        {
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
            isAppliedInstructor: true,
          },
        },
        { upsert: true, new: true } // Create new user if not found
      );
      if (!applyOne) {
        return false;
      }
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error is occurred");
    }
  }
}
