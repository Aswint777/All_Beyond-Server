import { Router } from "express"
import { IDependencies } from "../../application/interfaces/IDependencies"
import { adminController } from "../controllers/adminControllers"

export const adminRouters = (dependencies:IDependencies) =>{
        const { getAdminStudentsList,block_UnBlock } = adminController(dependencies)
        const router = Router()
        
        router.route("/AdminStudentsListPage").get(getAdminStudentsList)
        router.route('/block_UnBlock').put(block_UnBlock)

        return router;

}