// import { IRepositories } from "../../application/interfaces/IRepositories";
import { User } from "../../database/model/userModel";
// import { UserEntity } from "../../domain/entities/User";
import { generateUserID } from "../../../_lib/common/generateUserID";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { createUserEntity, UserEntity } from "../../../domain/entities/User";
import { IDependencies } from "../../../application/interfaces/IDependencies";
// import { matchOtpEntity, verifyOtpEntity } from "../../domain/entities/verifyOtpEntity";

export class UserRepository
  // implements Pick<IRepositories, "checkByEmail" | "checkByName" | "createUser">
  implements Pick<IRepositories, "checkByName"|"checkByEmail" >

{
  private dependencies: IDependencies; // ✅ Store dependencies

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies; // ✅ Assign dependencies
  }
  // ✅ Check if email exists
  async checkByEmail(email: string): Promise<UserEntity | null> {
    try {
      const oldUser =  await User.findOne({ email });
      if(!oldUser){
        return null
      }
      return oldUser
    } catch (error) {
      console.error("Error in checkByEmail:", error);
      return null;
    }
  }

  // ✅ Check if username exists
  async checkByName(name: string): Promise<boolean | null> {
    try {
      const oldUser = await User.findOne({ username: name })
      if(!oldUser){
        return false
      }
      console.log(oldUser,'old user');
      
      return true
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
  async googleAuth(email: string, username: string): Promise<UserEntity | null> {
    try {
      const userId = generateUserID();
      return await User.create({ email, username, userId });
    } catch (error) {
      console.error("Error in googleAuth:", error);
      return null;
    }
  }
}

// import { constant } from "../../../_lib/common/constant";
// import { generateUserID } from "../../../_lib/common/generateUserID";
// import { UserEntity } from "../../../domain/entities/User";
// import { User } from "../../database/model/userModel";

// export const checkByEmail = async (
//   email: string
// ): Promise<UserEntity | null> => {
//   try {
//     const emailExist = await User.findOne({ email: email });
//     if (emailExist) {
//       return emailExist;
//     }
//     return null;
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       throw error;
//     }
//     throw new Error("An unexpected error is occurred");
//   }
// };

// export const checkNotBlocked = async (
//   email: string
// ): Promise<UserEntity | null> => {
//   try {
//     const notBlocked = await User.findOne({ email: email, isBlocked: false });
//     if (notBlocked) {
//       return notBlocked;
//     }
//     return null;
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       throw error;
//     }
//     throw new Error("An unexpected error is occurred");
//   }
// };

// export const checkByName =async(name:string) : Promise <boolean> =>{
//     try {
//      console.log('console on the checkByName repository');

//      const userNameExist = await User.findOne({username : name})
//      console.log(userNameExist," result form repo")
//      if(userNameExist){
//          return true
//      }
//      return false
//     } catch (error : unknown) {
//      if(error instanceof Error){
//          throw error
//      }
//      throw new Error("An unexpected error is occurred")
//     }
//  }

// export const createUser =async(data:UserEntity) : Promise <UserEntity|null> =>{
//     try {
//      console.log('console on the Create User repository');
//      const newUser = {
//          ...data
//      }
//      console.log(newUser);

//      const CreateNewUSer = await User.create(newUser)
//      console.log(CreateNewUSer," result form repo user Created")
//      if(CreateNewUSer){
//          return CreateNewUSer
//      }
//      return null
//     } catch (error : unknown) {
//      if(error instanceof Error){
//          throw error
//      }
//      throw new Error("An unexpected error is occurred")
//     }
//  }

// export const getUserDetails = async (
//     _id: string
//   ): Promise<UserEntity | null> => {
//     try {
//       const userDetails = await User.findOne({ _id: _id });
//       if (!userDetails) {
//         return null;
//       }
//       return userDetails;
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         throw error;
//       }
//       throw new Error("An unexpected error is occurred");
//     }
//   };

//  export const googleAuth = async(email:string,username:string):Promise<UserEntity|null>=>{
//   try {
//     console.log('.............................................acazscascawzd');
//       const userId = generateUserID()

//     const newUser = await User.create({email:email,username:username,userId:userId})
//     console.log(newUser,'googleAuth reppooooooo......................................');
//     if(!newUser){
//       return null
//     }
//     return newUser
//   } catch (error:constant) {
//     if (error instanceof Error) {
//       throw error;
//     }
//     throw new Error("An unexpected error is occurred");
//   }
//  }
