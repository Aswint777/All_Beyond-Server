import { Router } from "express"
import { IDependencies } from "../../application/interfaces/IDependencies"
import { adminController } from "../controllers/adminControllers"

export const adminRouters = (dependencies:IDependencies) =>{
        const { getAdminStudentsList,block_UnBlock,addCategory,categoryList,blockCategory} = adminController(dependencies)
        const router = Router()
        
        router.route("/AdminStudentsListPage").get(getAdminStudentsList)
        router.route('/block_UnBlock').put(block_UnBlock)
        router.route("/addCategory").post(addCategory)
        router.route("/categoryList").get(categoryList)
        router.route("/blockCategory").put(blockCategory)

        return router;

}