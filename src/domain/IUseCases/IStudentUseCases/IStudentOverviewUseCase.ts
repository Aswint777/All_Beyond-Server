import { StudentDashboardData } from "../../entities/enrolmentEntity";
import { AverageReview, ReviewData } from "../../entities/overviewEntity";
import { TransactionOutput } from "../../entities/paymentEntity";

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


export interface IStudentTransactionsUseCase {
  execute(
    userId:string,
    skip: number,
    limit: number
  ): Promise<{ transactions: TransactionOutput[]; totalTransactions: number } | null>;
}
 