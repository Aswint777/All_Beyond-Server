import { assessmentCourses, AssessmentResponse } from "../../entities/assessmentEntity";

export interface IStudentAssessmentsUseCase{
    execute(userId:string,page:number, limit:number, search:string):Promise<AssessmentResponse |null>
}