import { assessmentCourses, AssessmentEntity, QuestionEntity } from "../entities/assessmentEntity";
import { categoryEntity } from "../entities/categoryEntity";
import { CourseEntity } from "../entities/courseEntity";
import { InstructorDashboardData } from "../entities/enrolmentEntity";
import { UserEntity } from "../entities/User";

export interface IInstructorRepository {

  //   // => instructor

  instructorApplication: (data: UserEntity) => Promise<boolean | null>;

  createCourseRepository: (
    data: CourseEntity,
    id: string
  ) => Promise<CourseEntity | null>;
  getAllCategoryRepository: () => Promise<categoryEntity[] | null>;
  // listInstructorRepository:(id:string)=> Promise <CourseEntity[]|null>
  listInstructorRepository: (
    id: string,
    search: string,
    skip: number,
    limit: number
  ) => Promise<{ courses: CourseEntity[]; totalCourses: number } | null>;

  editCourseRepository: (data: CourseEntity) => Promise<CourseEntity | null>;
  blockCourseRepository: (courseId: string) => Promise<CourseEntity | null>;
  instructorDashboardRepository: (
    userId: string
  ) => Promise<InstructorDashboardData | null>;

  assessmentCoursesRepository: (
    userId: string,
    page: number,
    limit: number,
    search: string
  ) => Promise<{ courses: assessmentCourses[]; totalPages: number } | null>;
  createAssessmentsRepository: (
    data: AssessmentEntity
  ) => Promise<AssessmentEntity | null>;
  getAssessmentRepository: (
    assessmentId: string
  ) => Promise<AssessmentEntity | null>;

    updateAssessmentRepository: (
    assessmentId: string,data: { questions: QuestionEntity[] }
  ) => Promise<AssessmentEntity | null>;

}


