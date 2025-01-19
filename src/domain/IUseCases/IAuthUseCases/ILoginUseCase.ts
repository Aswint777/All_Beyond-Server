import { UserEntity } from "../../entities/User";

export interface ILoginUseCase{
   execute(email:string,password:string):Promise<UserEntity>
}