import { CourseEntity } from "../../entities/courseEntity";

interface CoursesResponse {
  courses: CourseEntity[];
  totalPages: number;
}

export interface allCoursesUseCase{
    execute(page: number, limit: number, search?:string, category?:string,sort?:string,pricingOption?:string):Promise<CoursesResponse>
}

export interface IGetTotalCount{
    execute(search?:string, category?:string, pricingOption?:string):Promise<number>
}

export interface ICourseDetailsUseCase{
    execute(courseId:string):Promise<CourseEntity|null>

}

export interface ISimilarCourseUseCase{
    execute(courseId:string):Promise<CourseEntity[]|null>

}


export interface ILatestCoursesUseCase{
    execute():Promise<CourseEntity[]|null>

}