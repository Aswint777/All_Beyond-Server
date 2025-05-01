import { constant } from "../../../_lib/common/constant";
import { CourseEntity } from "../../../domain/entities/courseEntity";
import { IDependencies } from "../../interfaces/IDependencies";

export class CourseUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async allCoursesUseCase(page: number, limit: number, search?:string, category?:string): Promise<CourseEntity[] | null> {
    const { allCoursesRepo } = this.dependencies.repositories;
    try {
      console.log(`Fetching courses for page ${page}, limit ${limit}`);
      const list = await allCoursesRepo(page, limit, search, category);
      console.log("Courses fetched:", list);
      if (!list) return null;
      return list;
    } catch (error: any) {
      throw new Error("An unexpected error occurred: " + error.message);
    }
  }

  async getTotalCount(): Promise<number> {
    const { getCoursesCountRepo } = this.dependencies.repositories;
    try {
      const count = await getCoursesCountRepo();
      return count;
    } catch (error: any) {
      throw new Error("An unexpected error occurred: " + error.message);
    }
  }

    // async allCoursesUseCase():Promise<CourseEntity[] |null>{
    //   const {allCoursesRepo} = this.dependencies.repositories
    //   try {
    //     console.log('zdfhvbzjdfcbh');
        
    //     const list = await allCoursesRepo()
    //     console.log(list);
        
    //     if(!list) return null
    //     return list
    //   } catch (error:constant) {
    //     throw new Error("An unexpected error is occurred");
    //   }
    // }

    // course details use case

    async courseDetailsUseCase(courseId:string):Promise<CourseEntity|null>{
        const {courseDetailsRepo} = this.dependencies.repositories
        try {
            
            const details = await courseDetailsRepo(courseId)
            console.log(details,'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasssssssssssssssssssssss');
            
            if(!details) return null
            return details
        } catch (error:constant) {
            throw new Error("An unexpected error is occurred");

        }
    }

    // similar courses
    async similarCourseUseCase(courseId:string):Promise<CourseEntity[]|null>{
      const {similarCourseRepo} = this.dependencies.repositories
      try {
        const courses = await similarCourseRepo(courseId)
        if(!courses) return null
        return courses
      } catch (error:constant) {
        throw new Error("An unexpected error is occurred");
      }
    }
}