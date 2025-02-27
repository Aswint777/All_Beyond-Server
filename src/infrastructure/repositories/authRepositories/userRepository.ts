import { User } from "../../database/model/userModel";
// import { UserEntity } from "../../domain/entities/User";
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
    >
{
  private dependencies: IDependencies; 

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies; 
  }
  // ✅ Check if email exists
  async checkByEmail(email: string): Promise<UserEntity | null> {
    try {
      const oldUser = await User.findOne({ email });
      if (!oldUser) {
        return null;
      }
      return oldUser;
    } catch (error) {
      console.error("Error in checkByEmail:", error);
      return null;
    }
  }

  // ✅ Check if username exists
  async checkByName(name: string): Promise<boolean | null> {
    try {
      const oldUser = await User.findOne({ username: name });
      if (!oldUser) {
        return false;
      }
      console.log(oldUser, "old user");

      return true;
    } catch (error) {
      console.error("Error in checkByName:", error);
      return null;
    }
  }

  // ✅ Check if user is not blocked
  async checkNotBlocked(email: string): Promise<UserEntity | null> {
    try {
      return await User.findOne({ email, isBlocked: false });
    } catch (error) {
      console.error("Error in checkNotBlocked:", error);
      return null;
    }
  }

  // // ✅ Create a new user
  async createUser(data: createUserEntity): Promise<UserEntity | null> {
    try {
      return await User.create(data);
    } catch (error) {
      console.error("Error in createUser:", error);
      return null;
    }
  }

  // ✅ Get user details by ID
  async getUserDetails(_id: string): Promise<UserEntity | null> {
    try {
      return await User.findOne({ _id });
    } catch (error) {
      console.error("Error in getUserDetails:", error);
      return null;
    }
  }

  // ✅ Google Authentication
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
}
