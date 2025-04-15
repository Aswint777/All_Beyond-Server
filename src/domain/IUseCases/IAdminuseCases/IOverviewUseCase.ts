import { DashboardData } from "../../entities/enrolmentEntity";

export interface IDashboardUseCase {
  execute(): Promise<DashboardData|null>;
}