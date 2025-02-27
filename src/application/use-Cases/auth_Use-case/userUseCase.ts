import { createUserEntity, UserEntity } from "../../../domain/entities/User";
import bcrypt from "bcrypt";
import { IDependencies } from "../../interfaces/IDependencies";

export class UserUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  // ✅ Check if username exists
  async checkByNameUseCase(name: string): Promise<boolean | null> {
    try {
      console.log("checkByNameUseCase   /////");
      console.log(this.dependencies, "");
      const result = await this.dependencies.repositories.checkByName(name);
      console.log(result, "result");

      if (!result) {
        return false;
      }
      return true;
    } catch (error: any) {
      console.error("❌ Error in checkByNameUseCase:", error);
      throw new Error(error?.message || "Error in checking username");
    }
  }

  // ✅ Check if email exists
  async checkByEmailUseCase(email: string): Promise<UserEntity | null> {
    try {
      const result = await this.dependencies.repositories.checkByEmail(email);
      return result || null;
    } catch (error: any) {
      console.error("❌ Error in checkByEmailUseCase:", error);
      throw new Error(error?.message || "Error in checking email");
    }
  }

  // // ✅ Create a new user
  async createUserUseCase(data: createUserEntity): Promise<UserEntity | null> {
    try {
      console.log(data, "createUserUseCase");

      return await this.dependencies.repositories.createUser(data);
    } catch (error: any) {
      console.error("❌ Error in createUserUseCase:", error);
      throw new Error(error?.message || "Error in creating user");
    }
  }

  // ✅ Login user
  async loginUseCase(
    email: string,
    password: string
  ): Promise<UserEntity | null> {
    try {
      const { checkByEmail, checkNotBlocked } = this.dependencies.repositories;

      // 🔍 Check if user exists
      const user = await checkByEmail(email);
      if (!user?.password) return null;

      console.log("ℹ️ User found. Verifying password...");
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return null;
      }
      console.log("bingo");
      // ✅ Check if user is not blocked
      return await checkNotBlocked(email);
    } catch (error: any) {
      console.error("❌ Error in loginUseCase:", error);
      throw new Error(error?.message || "Error in login user");
    }
  }

  // ✅ Get user details by ID
  async getUserDetailsUseCase(_id: string): Promise<UserEntity | null> {
    try {
      return await this.dependencies.repositories.getUserDetails(_id);
    } catch (error: any) {
      console.error("❌ Error in getUserDetailsUseCase:", error);
      throw new Error(error?.message || "Error in fetching user details");
    }
  }
  // ✅ Google Authentication
  async googleAuthUseCase(email: string): Promise<UserEntity | null> {
    try {
      const { googleAuth, checkByEmail, checkNotBlocked } =
        this.dependencies.repositories;
      if (!email) return null;

      // 🔍 Check if user already exists
      const oldUser = await checkByEmail(email);
      if (!oldUser) {
        const username = email.split("@")[0];
        return await googleAuth(email, username);
      }

      // ✅ Check if user is not blocked
      return await checkNotBlocked(email);
    } catch (error: any) {
      console.error("❌ Error in googleAuthUseCase:", error);
      throw new Error(error?.message || "Unknown error in Google Auth");
    }
  }
}
