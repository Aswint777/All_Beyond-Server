import { categoryEntity } from "../../../domain/entities/categoryEntity";
import { IDependencies } from "../../interfaces/IDependencies";
import { AdminInstructorUseCase } from "./adminInstructorUseCase";
import { AdminUserUseCase } from "./adminUserUseCase";
import { CategoryUseCase } from "./categoryUseCase";

export const adminUseCases = (dependencies: IDependencies) => {
  const adminInstructorUseCase = new AdminInstructorUseCase(dependencies);
  const adminUserUseCase = new AdminUserUseCase(dependencies);
  const  categoryUseCase = new CategoryUseCase(dependencies)
  return {
    //
    getInstructorApplicationUseCase: () => ({
      execute: () => adminInstructorUseCase.getInstructorApplicationUseCase(),
    }),
    updateInstructorStatusUseCase: () => ({
      execute: (Id: string,status: string) => adminInstructorUseCase.updateInstructorStatusUseCase(Id,status),
    }),

//////
    getStudentsListUseCase: () => ({
      execute: () => adminUserUseCase.getStudentsListUseCase(),
    }),

    blockUnblockUserUseCase: () => ({
      execute: (userId: string, isBlocked: boolean) =>
        adminUserUseCase.blockUnblockUserUseCase(userId, isBlocked),
    }),
    /////

    getCategoryListUseCase: () => ({
      execute: () => categoryUseCase.getCategoryListUseCase(),
    }),
    addCategoryUseCase: () => ({
      execute: (data:categoryEntity) => categoryUseCase.addCategoryUseCase(data),
    }),

    blockUnblockCategoryUseCase: () => ({
      execute: (id:string,isBlocked:boolean) => categoryUseCase.blockUnblockCategoryUseCase(id,isBlocked),
    }),

    categoryEditUseCase: () => ({
      execute: (id:string,name:string,description:string,type:string) => categoryUseCase.categoryEditUseCase(id,name,description,type),
    }),
  };
};





// import exp from "constants"

// export * from "./categoryUseCase"
// export * from "./adminUserUseCase"
// export * from "./adminInstructorUseCase"

// export * from "./getStudentsListUseCase"
// export * from "./block_UnBlockUserUseCase"
// export * from "./addCategoryUseCase"
// export * from "./getCategoryListUseCase"
// export * from "./block_UnblockCategoryUseCase"
// export * from "./categoryEditUseCase"
// export * from "./getInstructorApplicationUseCase"
