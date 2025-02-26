import { Router } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { adminController } from "../controllers/adminControllers";

export const adminRouters = (dependencies: IDependencies) => {
  const {
    getAdminStudentsList,
    block_UnBlock,
    createCategory,
    categoryList,
    blockCategory,
    editCategory,
    adminInstructorApplicationList,
        updateInstructorStatus,
  } = adminController(dependencies);
  const router = Router();

  router.route("/AdminStudentsListPage").get(getAdminStudentsList);
  router.route("/block_UnBlock").put(block_UnBlock);
  router.route("/addCategory").post(createCategory);
  router.route("/categoryList").get(categoryList);
  router.route("/blockCategory").put(blockCategory);
  router.route("/editCategory/:id").put(editCategory);
  router
    .route("/AdminInstructorApplicationList")
    .get(adminInstructorApplicationList);
  router.route("/updateInstructorStatus").put(updateInstructorStatus);

  return router;
};
