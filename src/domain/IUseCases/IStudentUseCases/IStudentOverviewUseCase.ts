import { StudentDashboardData } from "../../entities/enrolmentEntity";

export interface IStudentDashboardUseCase {
  execute( userId: string): Promise<StudentDashboardData | null>;
}