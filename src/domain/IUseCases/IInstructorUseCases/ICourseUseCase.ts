import { categoryEntity } from "../../entities/categoryEntity";
import { CourseEntity } from "../../entities/courseEntity";

export interface ICreateCourseUseCase {
    execute(data:CourseEntity,id:string):Promise<CourseEntity|null>
}

export interface IAllCategoriesUseCase {   
    execute ():Promise<categoryEntity[] |null>
}


export interface IListInstructorCourseUseCase {
    execute(
      id: string,
      search: string,
      skip: number,
      limitNum: number
    ): Promise<{ courses: CourseEntity[]; totalCourses: number } | null>;
  }

export interface IEditCourseUseCase{
    execute(data:CourseEntity):Promise<CourseEntity|null>
}

export interface IBlockCourseUseCase{
    execute(courseId:string):Promise<CourseEntity|null>
}