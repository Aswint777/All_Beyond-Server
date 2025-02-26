// export * from "./applyInstructor"

import { IDependencies } from "../../../application/interfaces/IDependencies"
import { UserEntity } from "../../../domain/entities/User"
import { ApplyInstructor } from "./applyInstructor"


export const InstructorRepositories = (dependencies: IDependencies) => {
    const applyInstructorInstance = new ApplyInstructor(dependencies)
  return {
   
   instructorApplication: (data: UserEntity) => applyInstructorInstance.instructorApplication(data),
  }}