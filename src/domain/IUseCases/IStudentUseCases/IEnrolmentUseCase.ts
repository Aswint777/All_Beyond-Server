import { CourseEntity } from "../../entities/courseEntity";
import { CourseOutput, EnrolmentEntity } from "../../entities/enrolmentEntity";
import { PaymentEntity } from "../../entities/paymentEntity";

export interface ICoursePaymentUseCase {   
    execute (data:PaymentEntity):Promise<PaymentEntity |null>
}

export interface IEnrolCourseUseCases {   
    execute (data:EnrolmentEntity):Promise< EnrolmentEntity|null>
}


export interface IStudentCoursesUseCase {   
    execute (userId:string,safeSearch:string,skip:number,limitNum:number):Promise<{ courses: CourseEntity[]; totalCourses: number }|null>
}

export interface IWatchCourseUseCase{
   execute (courseId: string, userId: string): Promise<CourseOutput | null>
}

export interface IAlreadyEnrolledUseCase  {
    execute(courseId:string,userId:string):Promise<boolean|null>
 }
