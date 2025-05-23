import { createUserEntity, UserEntity } from "../../../domain/entities/User";
import bcrypt from "bcrypt";
import { IDependencies } from "../../interfaces/IDependencies";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { constant } from "../../../_lib/common/constant";

export class UserUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  // Check if username exists
  async checkByNameUseCase(name: string): Promise<boolean | null> {
    try {
      const result = await this.dependencies.repositories.checkByName(name);

      if (!result) {
        return false;
      }
      return true;
    } catch (error: constant) {
      console.error("Error in checkByNameUseCase:", error);
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "An unexpected error is occurred",
      };
    }
  }

  // Check if email exists
  async checkByEmailUseCase(email: string): Promise<UserEntity | null> {
    try {
      const result = await this.dependencies.repositories.checkByEmail(email);
      return result || null;
    } catch (error: constant) {
      console.error(" Error in checkByEmailUseCase:", error);
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "An unexpected error is occurred",
      };
    }
  }

  // Create a new user
  async createUserUseCase(data: createUserEntity): Promise<UserEntity | null> {
    try {
      return await this.dependencies.repositories.createUser(data);
    } catch (error: any) {
      console.error(" Error in createUserUseCase:", error);
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "An unexpected error is occurred",
      };
    }
  }

  //  Login user
  async loginUseCase(
    email: string,
    password: string
  ): Promise<UserEntity | null> {
    try {
      const { checkByEmail, checkNotBlocked } = this.dependencies.repositories;

      const user = await checkByEmail(email);
      if (!user?.password) return null;

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return null;
      }
      return await checkNotBlocked(email);
    } catch (error: any) {
      console.error(" Error in loginUseCase:", error);
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "An unexpected error is occurred",
      };
    }
  }

  // Get user details by ID
  async getUserDetailsUseCase(_id: string): Promise<UserEntity | null> {
    try {
      return await this.dependencies.repositories.getUserDetails(_id);
    } catch (error: constant) {
      console.error(" Error in getUserDetailsUseCase:", error);
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "An unexpected error is occurred",
      };
    }
  }
  // Google Authentication
  async googleAuthUseCase(email: string): Promise<UserEntity | null> {
    try {
      const { googleAuth, checkByEmail, checkNotBlocked } =
        this.dependencies.repositories;
      if (!email) return null;

      const oldUser = await checkByEmail(email);
      if (!oldUser) {
        const username = email.split("@")[0];
        return await googleAuth(email, username);
      }

      return await checkNotBlocked(email);
    } catch (error: constant) {
      console.error(" Error in googleAuthUseCase:", error);
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "An unexpected error is occurred",
      };
    }
  }
}
