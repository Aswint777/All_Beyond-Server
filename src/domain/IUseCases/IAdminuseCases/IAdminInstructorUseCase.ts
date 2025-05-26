import { UserEntity } from "../../entities/User";

export interface IGetInstructorApplicationUseCase {
  execute(page:number, limit:number) : Promise<{ data: UserEntity[], total: number, currentPage: number, totalPages: number }| boolean | null>
}

export interface IGetInstructorUseCase {
  execute(page:number, limit:number) : Promise<{ data: UserEntity[], total: number, currentPage: number, totalPages: number }| boolean | null>
}

export interface IUpdateInstructorStatusUseCase {
  execute(Id: string, status: string): Promise<UserEntity | null>;
}
