import { IDependencies } from "../../../application/interfaces/IDependencies";
import { addCategoryController } from "./addCategoryController";
import { getAdminStudentsListController } from "./adminStudentsListController";
import { block_UnBlockUserController } from "./block_UnBlockUserController";
import { blockCategoryController, categoryListController } from "./categorylistController";

export const adminController =(dependencies:IDependencies)=>{
    return{
        getAdminStudentsList :getAdminStudentsListController(dependencies),
        block_UnBlock:block_UnBlockUserController(dependencies),
        addCategory:addCategoryController(dependencies),
        categoryList:categoryListController(dependencies),
        blockCategory:blockCategoryController(dependencies)
    }
}