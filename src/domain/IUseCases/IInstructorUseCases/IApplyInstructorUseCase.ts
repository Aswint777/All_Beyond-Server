import { UserEntity } from "../../entities/User";

export interface IApplyInstructorUseCase {
  execute(data: UserEntity): Promise<boolean | null>;
}
