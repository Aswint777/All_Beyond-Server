import { UserEntity } from "../../entities/User";

export interface ICreateUserUseCase{
    execute(data:UserEntity):Promise<UserEntity|null>

}