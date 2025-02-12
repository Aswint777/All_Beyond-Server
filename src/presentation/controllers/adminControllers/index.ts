import { IDependencies } from "../../../application/interfaces/IDependencies";
import {
  adminInstructorApplicationListController,
  updateInstructorStatusController,
} from "./adminInstructorController";

import {
  block_UnBlockUserController,
  getAdminStudentsListController,
} from "./adminUserController";
import {
  addCategoryController,
  blockCategoryController,
  categoryListController,
  editCategoryController,
} from "./categoryController";

export const adminController = (dependencies: IDependencies) => {
  return {
    getAdminStudentsList: getAdminStudentsListController(dependencies),
    block_UnBlock: block_UnBlockUserController(dependencies),
    addCategory: addCategoryController(dependencies),
    categoryList: categoryListController(dependencies),
    blockCategory: blockCategoryController(dependencies),
    editCategory: editCategoryController(dependencies),
    instructorApplicationList:
      adminInstructorApplicationListController(dependencies),
    updateInstructorStatus: updateInstructorStatusController(dependencies),
  };
};
