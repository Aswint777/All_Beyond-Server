import { UserEntity } from "../../entities/User";

export interface IGetStudentsListUseCase{
    execute():Promise<UserEntity[]|boolean|null>
}