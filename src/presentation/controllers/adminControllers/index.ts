import { IDependencies } from "../../../application/interfaces/IDependencies";
import { AdminInstructorController } from "./adminInstructorController";
import { AdminUserController } from "./adminUserController";
import { CategoryController } from "./categoryController";
import { OverviewController } from "./overviewController";

export const adminController = (dependencies: IDependencies) => {
  const adminUserController = new AdminUserController(dependencies);
  const adminInstructorController = new AdminInstructorController(dependencies);
  const categoryController = new CategoryController(dependencies);
  const overviewController = new OverviewController(dependencies);

  return {
    getAdminStudentsList:
      adminUserController.getAdminStudentsList.bind(adminUserController),
    block_UnBlock:
      adminUserController.block_UnBlockUser.bind(adminUserController),

    userDetailsController:
      adminUserController.userDetailsController.bind(adminUserController),
    transactionHistory:
      adminUserController.transactionHistory.bind(adminUserController),

    createCategory:
      categoryController.createCategoryController.bind(categoryController),
    categoryList:
      categoryController.categoryListController.bind(categoryController),
    blockCategory:
      categoryController.blockCategoryController.bind(categoryController),
    editCategory:
      categoryController.editCategoryController.bind(categoryController),

    adminInstructorApplicationList:
      adminInstructorController.adminInstructorApplicationList.bind(
        adminInstructorController
      ),
    adminInstructorList: adminInstructorController.adminInstructorList.bind(
      adminInstructorController
    ),
    updateInstructorStatus:
      adminInstructorController.updateInstructorStatus.bind(
        adminInstructorController
      ),

    dashboard: overviewController.dashboard.bind(overviewController),
  };
};
