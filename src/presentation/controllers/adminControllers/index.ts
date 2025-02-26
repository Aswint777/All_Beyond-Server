// import { IDependencies } from "../../../application/interfaces/IDependencies";
// import {
//   adminInstructorApplicationListController,
//   updateInstructorStatusController,
// } from "./adminInstructorController";

import { IDependencies } from "../../../application/interfaces/IDependencies";
import { AdminInstructorController } from "./adminInstructorController";
import { AdminUserController } from "./adminUserController";
import { CategoryController } from "./categoryController";

// import {
//   block_UnBlockUserController,
//   getAdminStudentsListController,
// } from "./adminUserController";
// import {
//   addCategoryController,
//   blockCategoryController,
//   categoryListController,
//   editCategoryController,
// } from "./categoryController";

export const adminController = (dependencies: IDependencies) => {
    const adminUserController = new AdminUserController(dependencies)
    const adminInstructorController = new AdminInstructorController(dependencies)
    const categoryController = new CategoryController(dependencies)

  return {
    getAdminStudentsList: adminUserController.getAdminStudentsList.bind(adminUserController),
    block_UnBlock:adminUserController. block_UnBlockUser.bind(adminUserController),


    createCategory:categoryController.createCategoryController.bind(categoryController),
    categoryList:categoryController.categoryListController.bind(categoryController),
    blockCategory:categoryController.blockCategoryController.bind(categoryController),
    editCategory:categoryController.editCategoryController.bind(categoryController),



    adminInstructorApplicationList:adminInstructorController.adminInstructorApplicationList.bind(adminInstructorController),
    updateInstructorStatus: adminInstructorController.updateInstructorStatus.bind(adminInstructorController),
  };
};
