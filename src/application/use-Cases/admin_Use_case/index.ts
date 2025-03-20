import { categoryEntity } from "../../../domain/entities/categoryEntity";
import { IDependencies } from "../../interfaces/IDependencies";
import { AdminInstructorUseCase } from "./adminInstructorUseCase";
import { AdminUserUseCase } from "./adminUserUseCase";
import { CategoryUseCase } from "./categoryUseCase";

export const adminUseCases = (dependencies: IDependencies) => {
  const adminInstructorUseCase = new AdminInstructorUseCase(dependencies);
  const adminUserUseCase = new AdminUserUseCase(dependencies);
  const categoryUseCase = new CategoryUseCase(dependencies);
  return {
    // instructor useCase in admin side 
    getInstructorApplicationUseCase: () => ({
      execute: () => adminInstructorUseCase.getInstructorApplicationUseCase(),
    }),
    updateInstructorStatusUseCase: () => ({
      execute: (Id: string, status: string) =>
        adminInstructorUseCase.updateInstructorStatusUseCase(Id, status),
    }),

    // student useCase in admin side
    getStudentsListUseCase: () => ({
      execute: () => adminUserUseCase.getStudentsListUseCase(),
    }),

    blockUnblockUserUseCase: () => ({
      execute: (userId: string, isBlocked: boolean) =>
        adminUserUseCase.blockUnblockUserUseCase(userId, isBlocked),
    }),

    userDetailsUseCase:()=>({
      execute:(userId:string)=>adminUserUseCase.userDetailsUseCase(userId)
    }),

    // category usecase
    getCategoryListUseCase: () => ({
      execute: () => categoryUseCase.getCategoryListUseCase(),
    }),
    addCategoryUseCase: () => ({
      execute: (data: categoryEntity) =>
        categoryUseCase.addCategoryUseCase(data),
    }),
    blockUnblockCategoryUseCase: () => ({
      execute: (id: string, isBlocked: boolean) =>
        categoryUseCase.blockUnblockCategoryUseCase(id, isBlocked),
    }),
    categoryEditUseCase: () => ({
      execute: (id: string, name: string, description: string, type: string) =>
        categoryUseCase.categoryEditUseCase(id, name, description, type),
    }),

  };
};
