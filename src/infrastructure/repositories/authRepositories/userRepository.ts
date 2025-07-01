import { User } from "../../database/model/userModel";
import { generateUserID } from "../../../_lib/common/generateUserID";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { createUserEntity, UserEntity } from "../../../domain/entities/User";
import { IDependencies } from "../../../application/interfaces/IDependencies";

export class UserRepository
  implements
    Pick<
      IRepositories,
      | "checkByName"
      | "checkByEmail"
      | "createUser"
      | "checkNotBlocked"
      | "googleAuth"
      | "getUserDetails"
      | "userOnline"
    >
{
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  //  Check if email exists
  async checkByEmail(email: string): Promise<UserEntity | null> {
    try {
      const oldUser = await User.findOne({ email });
      if (!oldUser) {
        return null;
      }
      if (oldUser.isVerified === false) {
        await User.deleteOne({ _id: oldUser._id });
        return null;
      }
      return oldUser;
    } catch (error) {
      console.error("Error in checkByEmail:", error);
      return null;
    }
  }

  // Check if username exists
  async checkByName(name: string): Promise<boolean | null> {
    try {
      const oldUser = await User.findOne({ username: name });
      if (!oldUser) {
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error in checkByName:", error);
      return null;
    }
  }

  // Check if user is not blocked
  async checkNotBlocked(email: string): Promise<UserEntity | null> {
    try {
      return await User.findOne({ email, isBlocked: false });
    } catch (error) {
      console.error("Error in checkNotBlocked:", error);
      return null;
    }
  }

  //  Create a new user
  async createUser(data: createUserEntity): Promise<UserEntity | null> {
    try {
      const sign =  await User.create(data);
      await User.findOneAndUpdate({email:sign.email},{$set:{firstName:sign.username}})
      return sign
    } catch (error) {
      console.error("Error in createUser:", error);
      return null;
    }
  }

  //  Get user details by ID
  async getUserDetails(_id: string): Promise<UserEntity | null> {
    try {
      console.log("test one ");

      const d = await User.findOne({ _id });

      if (!d) return null;
      return d;
    } catch (error) {
      console.error("Error in getUserDetails:", error);
      return null;
    }
  }

  //  Google Authentication
  async googleAuth(
    email: string,
    username: string
  ): Promise<UserEntity | null> {
    try {
      const userId = generateUserID();
      return await User.create({ email, username, userId });
    } catch (error) {
      console.error("Error in googleAuth:", error);
      return null;
    }
  }

 // user online status
async userOnline(email: string): Promise<UserEntity | null> {
  try {
    const user = await User.findOne({ email });
    if (!user) return null;

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { online: !user.online } },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    console.error("Error in userOnline:", error);
    return null;
  }
}
}
