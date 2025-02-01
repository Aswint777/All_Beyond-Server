import { Router } from "express"
import { IDependencies } from "../../application/interfaces/IDependencies"
import { instructorController } from "../controllers/InstructorControllers"

export const instructorRoutes = (dependencies:IDependencies) =>{
        const { instructorApplication } = instructorController(dependencies)
        const router = Router()

        router.post("/instructorApplication",instructorApplication)


        return router;

}