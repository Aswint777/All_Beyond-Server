import { UserEntity } from "../../entities/User"

export interface IBlock_UnBlockUserUseCase{
    execute(userId:string,isBlocked:boolean):Promise<boolean|null>
}

export interface IGetStudentsListUseCase{
    execute():Promise<UserEntity[]|boolean|null>
}