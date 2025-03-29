import { CourseEntity } from "../../entities/courseEntity";

export interface allCoursesUseCase{
    execute(page: number, limit: number):Promise<CourseEntity[]|null>
}

export interface IGetTotalCount{
    execute():Promise<number>
}

export interface ICourseDetailsUseCase{
    execute(courseId:string):Promise<CourseEntity|null>

}

export interface ISimilarCourseUseCase{
    execute(courseId:string):Promise<CourseEntity[]|null>

}