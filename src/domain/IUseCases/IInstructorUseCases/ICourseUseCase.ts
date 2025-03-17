import { categoryEntity } from "../../entities/categoryEntity";
import { CourseEntity } from "../../entities/courseEntity";

export interface ICreateCourseUseCase {
    execute(data:CourseEntity):Promise<CourseEntity|null>
}

export interface IAllCategoriesUseCase {
    execute ():Promise<categoryEntity[] |null>
}