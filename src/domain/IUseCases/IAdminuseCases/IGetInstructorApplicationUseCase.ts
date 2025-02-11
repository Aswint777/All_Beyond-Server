import { UserEntity } from "../../entities/User";

export interface IGetInstructorApplicationUseCase{
    execute():Promise<UserEntity[]|boolean|null>
}