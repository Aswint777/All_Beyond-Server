import { Router } from "express"
import { IDependencies } from "../../application/interfaces/IDependencies"
import { adminController } from "../controllers/adminControllers"

export const adminRouters = (dependencies:IDependencies) =>{
        const { getAdminStudentsList } = adminController(dependencies)
        const router = Router()
        
        router.route("/AdminStudentsListPage").get(getAdminStudentsList)

        return router;

}