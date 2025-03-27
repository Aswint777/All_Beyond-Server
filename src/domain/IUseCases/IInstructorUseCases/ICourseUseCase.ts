import { categoryEntity } from "../../entities/categoryEntity";
import { CourseEntity } from "../../entities/courseEntity";

export interface ICreateCourseUseCase {
    execute(data:CourseEntity,id:string):Promise<CourseEntity|null>
}

export interface IAllCategoriesUseCase {
    execute ():Promise<categoryEntity[] |null>
}

export interface IListInstructorCourseUseCase{
    execute (id:string):Promise<CourseEntity[] |null>

}

export interface IEditCourseUseCase{
    execute(data:CourseEntity):Promise<CourseEntity|null>

}