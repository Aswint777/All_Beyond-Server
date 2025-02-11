import { IDependencies } from "../../../application/interfaces/IDependencies";
import { addCategoryController } from "./addCategoryController";
import { adminInstructorApplicationListController, updateInstructorStatusController } from "./adminInstructorApplicationListController";
import { getAdminStudentsListController } from "./adminStudentsListController";
import { block_UnBlockUserController } from "./block_UnBlockUserController";
import { blockCategoryController, categoryListController } from "./categoryListController";
import { editCategoryController } from "./editCategoryController";

export const adminController =(dependencies:IDependencies)=>{
    return{
        getAdminStudentsList :getAdminStudentsListController(dependencies),
        block_UnBlock:block_UnBlockUserController(dependencies),
        addCategory:addCategoryController(dependencies),
        categoryList:categoryListController(dependencies),
        blockCategory:blockCategoryController(dependencies),
        editCategory :editCategoryController(dependencies),
        instructorApplicationList:adminInstructorApplicationListController(dependencies),
        updateInstructorStatus:updateInstructorStatusController(dependencies)

    }
}