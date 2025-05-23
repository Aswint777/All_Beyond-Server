import {
    Answers,
  AssessmentEntity,
  AssessmentResponse,
  CertificateDetails,
  ExamAssessment,
  ExamResult,
} from "../../entities/assessmentEntity";

export interface IStudentAssessmentsUseCase {
  execute(
    userId: string,
    page: number,
    limit: number,
    search: string
  ): Promise<AssessmentResponse | null>;
}

export interface IGetQuestionsUseCase {
  execute(assessmentId: string): Promise<ExamAssessment | null>;
}

export interface ISubmitAssessmentUseCase {
  execute(assessmentId: string,userId:string, answers:{answers: Answers[]}
  ): Promise<ExamResult | null>;
}


export interface ICertificateUseCase {
  execute(assessmentId: string,userId:string
  ): Promise<CertificateDetails | null>;
}