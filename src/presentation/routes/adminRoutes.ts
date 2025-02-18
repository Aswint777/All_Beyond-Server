import { Router } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { adminController } from "../controllers/adminControllers";
import { jwtMiddleware } from "../middlewares/jwtMiddlewares";
import { verifyAdmin } from "../middlewares/verifyAdmin";

export const adminRouters = (dependencies: IDependencies) => {
  const {
    getAdminStudentsList,
    block_UnBlock,
    addCategory,
    categoryList,
    blockCategory,
    editCategory,
    instructorApplicationList,
    updateInstructorStatus
  } = adminController(dependencies);
  const router = Router();

  router.route("/AdminStudentsListPage").get(getAdminStudentsList);
  router.route("/block_UnBlock").put(block_UnBlock);
  router.route("/addCategory").post(addCategory);
  router.route("/categoryList").get(categoryList);
  router.route("/blockCategory").put(blockCategory);
  router.route("/editCategory/:id").put(editCategory);
  router.route("/AdminInstructorApplicationList").get(instructorApplicationList)
  router.route("/updateInstructorStatus").put(updateInstructorStatus)

  return router;
};
