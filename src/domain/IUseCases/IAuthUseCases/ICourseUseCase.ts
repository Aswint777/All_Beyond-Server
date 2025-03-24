import { CourseEntity } from "../../entities/courseEntity";

export interface allCoursesUseCase{
    execute():Promise<CourseEntity[]|null>
}

export interface ICourseDetailsUseCase{
    execute(courseId:string):Promise<CourseEntity|null>

}

export interface ISimilarCourseUseCase{
    execute(courseId:string):Promise<CourseEntity[]|null>

}