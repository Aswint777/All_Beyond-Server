import { IDependencies } from "../../../application/interfaces/IDependencies";
import { categoryEntity } from "../../../domain/entities/categoryEntity";
import { AdminInstructorRepository } from "./adminInstructorRepository";
import { AdminUserRepository } from "./adminUserRepository";
import { CategoryRepository } from "./categoryRepository";
import { OverViewRepository } from "./overviewRepository";

export const AdminRepositories = (dependencies: IDependencies) => {
  const adminUserRepositoryInstance = new AdminUserRepository(dependencies);
  const adminInstructorRepositoryInstance = new AdminInstructorRepository(
    dependencies
  );
  const categoryRepositoryInstance = new CategoryRepository(dependencies);
  const overViewRepositoryInstance = new OverViewRepository(dependencies)

  return {
    ////
    getStudentsList: () => adminUserRepositoryInstance.getStudentsList(),
    block_UnBlockUser: (userId: string, isBlocked: boolean) =>
      adminUserRepositoryInstance.block_UnBlockUser(userId, isBlocked),
    findByUserId: (userId: string) =>
      adminUserRepositoryInstance.findByUserId(userId),

    transactionHistoryRepository: (skip: number = 0, limit: number = 10) =>
      adminUserRepositoryInstance.transactionHistoryRepository(skip, limit),

    /////
    getInstructorApplication: () =>
      adminInstructorRepositoryInstance.getInstructorApplication(),
    updateInstructorStatus: (Id: string, status: string) =>
      adminInstructorRepositoryInstance.updateInstructorStatus(Id, status),

    ////////
    addCategory: (data: categoryEntity) =>
      categoryRepositoryInstance.addCategory(data),
    block_UnblockCategory: (id: string, isBlocked: boolean) =>
      categoryRepositoryInstance.block_UnblockCategory(id, isBlocked),
    getCategoryList: () => categoryRepositoryInstance.getCategoryList(),
    categoryEdit: (id: string, name: string, description: string) =>
      categoryRepositoryInstance.categoryEdit(id, name, description),
    duplicateCategory: (name: string, id?: string) =>
      categoryRepositoryInstance.duplicateCategory(name, id),

    dashboardRepository:()=>overViewRepositoryInstance.dashboardRepository()
  };
};
