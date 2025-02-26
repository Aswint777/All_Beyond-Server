// export * from "./applyInstructorUseCase"

import { UserEntity } from "../../../domain/entities/User";
import { IDependencies } from "../../interfaces/IDependencies";
import { InstructorApplyUseCase } from "./applyInstructorUseCase";


export const instructorUseCase = (dependencies:IDependencies)=>{
    const instructorApplyUseCase = new InstructorApplyUseCase(dependencies)
    return{

        applyInstructorUseCase: () => ({
            execute: (data:UserEntity) => instructorApplyUseCase.applyInstructorUseCase(data),
        }),
    }
}