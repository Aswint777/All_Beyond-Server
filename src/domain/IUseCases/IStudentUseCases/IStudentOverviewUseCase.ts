import { StudentDashboardData } from "../../entities/enrolmentEntity";
import { AverageReview, ReviewData } from "../../entities/overviewEntity";

export interface IStudentDashboardUseCase {
  execute( userId: string): Promise<StudentDashboardData | null>;
}

export interface IAddReviewUseCase {
  execute( data:ReviewData): Promise<ReviewData | null>;
}
export interface IGetReviewUseCase {
  execute(courseId:string): Promise<ReviewData[] | null>;
}

export interface IAverageReviewUseCase {
  execute(courseId:string): Promise<AverageReview | null>;
}