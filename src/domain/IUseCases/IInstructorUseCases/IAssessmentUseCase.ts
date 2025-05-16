import { assessmentCourses, AssessmentEntity, QuestionEntity } from "../../entities/assessmentEntity";

export interface IAssessmentCoursesUseCase{
    execute(userId:string,page:number, limit:number, search:string):Promise<{ courses: assessmentCourses[]; totalPages: number } |null>
}

export interface ICreateAssessmentsUseCase{
    execute(data:AssessmentEntity):Promise<AssessmentEntity |null>
}

export interface IGetAssessmentUseCase{
    execute(assessmentId:string):Promise<AssessmentEntity |null>
}

export interface IUpdateAssessmentUseCase{
    execute(assessmentId:string,data:QuestionEntity[]):Promise<AssessmentEntity |null>
}