import { UserEntity } from "../../entities/User"

export interface ICheckByEmailUseCase {
    execute(email:String):Promise<boolean|null>
}


export interface ICheckByNameUseCase {
    execute(name:String):Promise<boolean|null>
}

export interface ICreateUserUseCase{
    execute(data:UserEntity):Promise<UserEntity|null>

}


export interface IGetUserDetailsUseCase{
    execute(_id:string):Promise<UserEntity|null>

}

export interface ILoginUseCase{
    execute(email:string,password:string):Promise<UserEntity|null>
 }