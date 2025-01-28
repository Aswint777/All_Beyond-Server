import { UserEntity } from "../../entities/User";

export interface IGetUserDetailsUseCase{
    execute(_id:string):Promise<UserEntity|null>

}