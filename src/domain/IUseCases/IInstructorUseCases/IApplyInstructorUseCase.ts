import { InstructorDashboardData } from "../../entities/enrolmentEntity";
import { UserEntity } from "../../entities/User";

export interface IApplyInstructorUseCase {
  execute(data: UserEntity): Promise<boolean | null>;
}

export interface IInstructorDashboardUseCase {
  execute(userId:string):Promise<InstructorDashboardData|null>
}