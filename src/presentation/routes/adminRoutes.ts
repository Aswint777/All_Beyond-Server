import { Router } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { adminController } from "../controllers/adminControllers";
import { jwtMiddleware } from "../middlewares/jwtMiddlewares";
import { verifyAdmin } from "../middlewares/verifyAdmin";

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

  router.route("/AdminStudentsListPage").get(jwtMiddleware,verifyAdmin,getAdminStudentsList);
  router.route("/block_UnBlock").put(jwtMiddleware,verifyAdmin,block_UnBlock);
  router.route("/addCategory").post(jwtMiddleware,verifyAdmin,createCategory);
  router.route("/categoryList").get(jwtMiddleware,verifyAdmin,categoryList);
  router.route("/blockCategory").put(jwtMiddleware,verifyAdmin,blockCategory);
  router.route("/editCategory/:id").put(jwtMiddleware,verifyAdmin,editCategory);
  router
    .route("/AdminInstructorApplicationList")
    .get(jwtMiddleware,verifyAdmin,adminInstructorApplicationList);
  router.route("/updateInstructorStatus").put(jwtMiddleware,verifyAdmin,updateInstructorStatus);

  return router;
};


