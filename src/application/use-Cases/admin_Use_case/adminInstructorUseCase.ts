import { constant } from "../../../_lib/common/constant";
import { UserEntity } from "../../../domain/entities/User";
import { IDependencies } from "../../interfaces/IDependencies";

export class AdminInstructorUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async getInstructorApplicationUseCase(): Promise<
    UserEntity[] | boolean | null
  > {
    try {
      const { getInstructorApplication } = this.dependencies.repositories;
      const userList = await getInstructorApplication();
      console.log(userList);
      return userList;
    } catch (error: constant) {
      console.log("Error in checking with get user");

      throw new Error(error?.message || "Error in checking with get user");
    }
  }

  async updateInstructorStatusUseCase(
    Id: string,
    status: string
  ): Promise<boolean | null> {
    const {updateInstructorStatus} = this.dependencies.repositories
    try {
      console.log(Id, "......");

      const update = await updateInstructorStatus(Id, status);
      if (!update) {
        return null;
      }
      return true;
    } catch (error: constant) {
      console.error("Error updating instructor status:", error);
      return null;
    }
  }
}

// import { constant } from "../../../_lib/common/constant";
// import { IDependencies } from "../../interfaces/IDependencies";

// export const getInstructorApplicationUseCase = (dependencies : IDependencies) => {
//     console.log('console in the checkByNameUseCAse');

//     const {repositories : {getInstructorApplication}} = dependencies
//     return {
//         execute : async() =>{
//             try {

//                 const userList = await getInstructorApplication()
//                 console.log(userList);
//                 return userList

//             } catch (error:constant) {
//                 console.log('Error in checking with get user');

//                 throw new Error(error?.message || "Error in checking with get user");

//             }
//         }
//     }
// }

// export const updateInstructorStatusUseCase = (dependencies:IDependencies)=>{
//     const {repositories:{updateInstructorStatus}} = dependencies
//     return {
//         execute:async(Id:string,status:string)=>{
//             try {
//                 console.log(Id,'......');

//                 const update = await updateInstructorStatus(Id,status)
//                 if(!update){
//                     return null
//                 }
//                 return true
//             } catch (error:constant) {
//                 console.error("Error updating instructor status:", error);
//                 return null;
//             }
//         }
//     }
// }
