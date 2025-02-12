import { UserEntity } from "../../entities/User";

export interface IGetInstructorApplicationUseCase{
    execute():Promise<UserEntity[]|boolean|null>
}

export interface IUpdateInstructorStatusUseCase{
    execute(Id:string,status:string):Promise<boolean|null>
}