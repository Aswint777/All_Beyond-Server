import { assessmentCourses, AssessmentEntity } from "../../entities/assessmentEntity";

export interface IAssessmentCoursesUseCase{
    execute(userId:string,page:number, limit:number, search:string):Promise<{ courses: assessmentCourses[]; totalPages: number } |null>
}

export interface ICreateAssessmentsUseCase{
    execute(data:AssessmentEntity):Promise<AssessmentEntity |null>
}