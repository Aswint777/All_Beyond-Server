import { constant } from "../../../_lib/common/constant";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { CourseEntity } from "../../../domain/entities/courseEntity";
import { IDependencies } from "../../interfaces/IDependencies";

export class CourseUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async allCoursesUseCase(
    page: number,
    limit: number,
    search?: string,
    category?: string
  ): Promise<CourseEntity[] | null> {
    const { allCoursesRepo } = this.dependencies.repositories;
    try {
      const list = await allCoursesRepo(page, limit, search, category);
      if (!list) return null;
      return list;
    } catch (error: any) {
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "Error in allCoursesUseCase",
      };
    }
  }

  async getTotalCount(): Promise<number> {
    const { getCoursesCountRepo } = this.dependencies.repositories;
    try {
      const count = await getCoursesCountRepo();
      return count;
    } catch (error: any) {
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "Error in allCoursesUseCase",
      };
    }
  }

  async courseDetailsUseCase(courseId: string): Promise<CourseEntity | null> {
    const { courseDetailsRepo } = this.dependencies.repositories;
    try {
      const details = await courseDetailsRepo(courseId);

      if (!details) return null;
      return details;
    } catch (error: constant) {
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "An unexpected error is occurred",
      };
    }
  }

  // similar courses
  async similarCourseUseCase(courseId: string): Promise<CourseEntity[] | null> {
    const { similarCourseRepo } = this.dependencies.repositories;
    try {
      const courses = await similarCourseRepo(courseId);
      if (!courses) return null;
      return courses;
    } catch (error: constant) {
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "An unexpected error is occurred",
      };
    }
  }

  async latestCoursesUseCase(): Promise<CourseEntity[] | null> {
    const { latestCoursesRepo } = this.dependencies.repositories;
    try {
      const courses = await latestCoursesRepo();
      if (!courses) return null;
      return courses;
    } catch (error: constant) {
      throw {
        status: httpStatusCode.INTERNAL_SERVER_ERROR,
        message: error?.message || "An unexpected error is occurred",
      };
    }
  }
}
