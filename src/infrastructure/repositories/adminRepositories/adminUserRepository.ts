import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { UserEntity } from "../../../domain/entities/User";
import { User } from "../../database/model";

export class AdminUserRepository
  implements Pick<IRepositories, "getStudentsList"|"block_UnBlockUser">
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  async getStudentsList(): Promise<UserEntity[] | boolean | null> {
    try {
      console.log("console on the check by email repository");

      const studentsList = await User.find({
        isVerified: true,
        role: "student",
      });
      console.log(studentsList, " result form getStudentsList repo");
      if (studentsList) {
        return studentsList;
      }
      return false;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("An unexpected error is occurred");
    }
  }

  async block_UnBlockUser(userId:string,isBlocked:boolean) : Promise <boolean|null> {
        try {
         console.log(userId,isBlocked,'is blocked or userId');
    
         const statusChange = await User.findOneAndUpdate({userId:userId},{isBlocked:isBlocked})
         if(statusChange){
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
    
}



// import { UserEntity } from "../../../domain/entities/User";
// import { User } from "../../database/model";

// export const getStudentsList =async() : Promise <UserEntity[]|boolean|null> =>{
//    try {
//     console.log('console on the check by email repository');

//     const studentsList = await User.find({isVerified:true, role:"student"})
//     console.log(studentsList," result form getStudentsList repo")
//     if(studentsList){
//         return studentsList
//     }
//     return false
//    } catch (error : unknown) {
//     if(error instanceof Error){
//         throw error
//     }
//     throw new Error("An unexpected error is occurred")
//    }
// }

// export const block_UnBlockUser =async(userId:string,isBlocked:boolean) : Promise <boolean|null> =>{
//     try {
//      console.log(userId,isBlocked,'is blocked or userId');

//      const statusChange = await User.findOneAndUpdate({userId:userId},{isBlocked:isBlocked})
//      if(statusChange){
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
