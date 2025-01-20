import { IDependencies } from "../../../application/interfaces/IDependencies";
import { getAdminStudentsListController } from "./adminStudentsListController";

export const adminController =(dependencies:IDependencies)=>{
    return{
        getAdminStudentsList :getAdminStudentsListController(dependencies)
    }
}