import { IDependencies } from "../../../application/interfaces/IDependencies";
import { categoryEntity } from "../../../domain/entities/categoryEntity";
import { AdminInstructorRepository } from "./adminInstructorRepository";
import { AdminUserRepository } from "./adminUserRepository";
import { CategoryRepository } from "./categoryRepository";

export const AdminRepositories = (dependencies: IDependencies) => {
  const adminUserRepositoryInstance = new AdminUserRepository(dependencies);
  const adminInstructorRepositoryInstance = new AdminInstructorRepository(
    dependencies
  );
  const categoryRepositoryInstance = new CategoryRepository(dependencies);

  return {
    ////
    getStudentsList: () => adminUserRepositoryInstance.getStudentsList(),
    block_UnBlockUser: (userId: string, isBlocked: boolean) =>
      adminUserRepositoryInstance.block_UnBlockUser(userId, isBlocked),
    findByUserId:(userId:string)=>adminUserRepositoryInstance.findByUserId(userId),

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
    categoryEdit: (
      id: string,
      name: string,
      description: string,
      type: string
    ) => categoryRepositoryInstance.categoryEdit(id, name, description, type),
    duplicateCategory: (name: string,id?:string) =>
      categoryRepositoryInstance.duplicateCategory(name,id),
  };
};
