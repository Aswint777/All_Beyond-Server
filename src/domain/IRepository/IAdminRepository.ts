import { categoryEntity } from "../entities/categoryEntity";
import { DashboardData } from "../entities/enrolmentEntity";
import { TransactionOutput } from "../entities/paymentEntity";
import { UserEntity } from "../entities/User";

export interface IAdminRepository {

    // => Admin Repository

  // adminUserRepository
  getStudentsList: () => Promise<UserEntity[] | boolean | null>;
  block_UnBlockUser: (
    userId: string,
    isBlocked: boolean
  ) => Promise<boolean | null>;

  findByUserId: (userId: string) => Promise<UserEntity | null>;
  transactionHistoryRepository: (
    skip: number,
    limit: number
  ) => Promise<{
    transactions: TransactionOutput[];
    totalTransactions: number;
  } | null>;

  // category repository
  addCategory: (data: categoryEntity) => Promise<categoryEntity | null>;
  getCategoryList: () => Promise<categoryEntity[] | null>;
  block_UnblockCategory: (
    id: string,
    isBlocked: boolean
  ) => Promise<boolean | null>;
  categoryEdit: (
    id: string,
    name: string,
    description: string
  ) => Promise<categoryEntity | null>;
  duplicateCategory: (
    name: string,
    id?: string
  ) => Promise<categoryEntity[] | null>;

  //overview repo

  dashboardRepository: () => Promise<DashboardData | null>;

  // adminInstructorRepository
  getInstructorApplication: () => Promise<UserEntity[] | boolean | null>;
  updateInstructorStatus: (
    Id: string,
    status: string
  ) => Promise<UserEntity | null>;

}