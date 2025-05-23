import { categoryEntity } from "../../../domain/entities/categoryEntity";
import { IDependencies } from "../../interfaces/IDependencies";
import { AdminInstructorUseCase } from "./adminInstructorUseCase";
import { AdminUserUseCase } from "./adminUserUseCase";
import { CategoryUseCase } from "./categoryUseCase";
import { OverviewUseCase } from "./overviewUsecase";

export const adminUseCases = (dependencies: IDependencies) => {
  const adminInstructorUseCase = new AdminInstructorUseCase(dependencies);
  const adminUserUseCase = new AdminUserUseCase(dependencies);
  const categoryUseCase = new CategoryUseCase(dependencies);
  const overviewUseCase = new OverviewUseCase(dependencies);
  return {
    getInstructorApplicationUseCase: () => ({
      execute: () => adminInstructorUseCase.getInstructorApplicationUseCase(),
    }),
    updateInstructorStatusUseCase: () => ({
      execute: (Id: string, status: string) =>
        adminInstructorUseCase.updateInstructorStatusUseCase(Id, status),
    }),

    getStudentsListUseCase: () => ({
      execute: () => adminUserUseCase.getStudentsListUseCase(),
    }),

    blockUnblockUserUseCase: () => ({
      execute: (userId: string, isBlocked: boolean) =>
        adminUserUseCase.blockUnblockUserUseCase(userId, isBlocked),
    }),

    userDetailsUseCase: () => ({
      execute: (userId: string) => adminUserUseCase.userDetailsUseCase(userId),
    }),

    transactionHistoryUseCase: () => ({
      execute: (skip: number, limit: number) =>
        adminUserUseCase.transactionHistoryUseCase(skip, limit),
    }),

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
      execute: (id: string, name: string, description: string) =>
        categoryUseCase.categoryEditUseCase(id, name, description),
    }),

    dashboardUseCase: () => ({
      execute: () => overviewUseCase.dashboardUseCase(),
    }),
  };
};
