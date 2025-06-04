import { createUserEntity, UserEntity } from "../../entities/User";

export interface ICheckByNameUseCase {
  execute(name: String): Promise<boolean | null>;
}

export interface ICheckByEmailUseCase {
  execute(email: String): Promise<UserEntity | null>;
}

export interface ICreateUserUseCase {
  execute(data: createUserEntity): Promise<UserEntity | null>;
}

export interface IGetUserDetailsUseCase {
  execute(_id: string): Promise<UserEntity | null>;
}

export interface ILoginUseCase {
  execute(email: string, password: string): Promise<UserEntity | null>;
}

export interface IGoogleAuthUseCase {
  execute(email: string): Promise<UserEntity | null>;
}

export interface IOnlineUseCase {
  execute(email: string): Promise<UserEntity | null>;
}
