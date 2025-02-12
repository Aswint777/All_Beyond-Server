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



export const checkByName =async(name:string) : Promise <boolean> =>{
    try {
     console.log('console on the checkByName repository');
     
     const userNameExist = await User.findOne({username : name})
     console.log(userNameExist," result form repo")
     if(userNameExist){
         return true
     }
     return false
    } catch (error : unknown) {
     if(error instanceof Error){
         throw error
     }
     throw new Error("An unexpected error is occurred")
    }
 }


 
export const createUser =async(data:UserEntity) : Promise <UserEntity|null> =>{
    try {
     console.log('console on the Create User repository');
     const newUser = {
         ...data
     }
     console.log(newUser);
     
     
     const CreateNewUSer = await User.create(newUser)
     console.log(CreateNewUSer," result form repo user Created")
     if(CreateNewUSer){
         return CreateNewUSer 
     }
     return null
    } catch (error : unknown) {
     if(error instanceof Error){
         throw error
     }
     throw new Error("An unexpected error is occurred")
    }
 }


 
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
  