import { IDependencies } from "../../../application/interfaces/IDependencies";
import { getAdminStudentsListController } from "./adminStudentsListController";
import { block_UnBlockUserController } from "./block_UnBlockUserController";

export const adminController =(dependencies:IDependencies)=>{
    return{
        getAdminStudentsList :getAdminStudentsListController(dependencies),
        block_UnBlock:block_UnBlockUserController(dependencies)
    }
}