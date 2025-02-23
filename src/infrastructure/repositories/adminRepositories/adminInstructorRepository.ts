// import { constant } from "../../../_lib/common/constant";
// import { UserEntity } from "../../../domain/entities/User";
// import { User } from "../../database/model";

// export const getInstructorApplication = async (): Promise<
//   UserEntity[] | boolean | null
// > => {
//   try {
//     console.log("console on the check by email repository");

//     const studentsList = await User.find({
//       isVerified: true,
//       isAppliedInstructor: true,
//     });
//     console.log(studentsList, " result form getStudentsList repo");
//     if (studentsList) {
//       return studentsList;
//     }
//     return false;
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       throw error;
//     }
//     throw new Error("An unexpected error is occurred");
//   }
// };

// export const updateInstructorStatus = async (
//   Id: string,
//   status: string
// ): Promise<boolean | null> => {
//   try {
//     console.log("api call is here ");
//     console.log(status,Id);
    
//     const update = await User.findOneAndUpdate({_id:Id},{$set:{status:status}})
//     if(!update){
//         return null
//     }
//     return true
//   } catch (error: constant) {
//     if (error instanceof Error) {
//       throw error;
//     }
//     throw new Error("An unexpected error is occurred");
//   }
// };
