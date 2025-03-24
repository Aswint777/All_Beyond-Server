import { constant } from "../../../_lib/common/constant";
import { CourseEntity } from "../../../domain/entities/courseEntity";
import { IDependencies } from "../../interfaces/IDependencies";

export class CourseUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
    async allCoursesUseCase():Promise<CourseEntity[] |null>{
      const {allCoursesRepo} = this.dependencies.repositories
      try {
        console.log('zdfhvbzjdfcbh');
        
        const list = await allCoursesRepo()
        console.log(list);
        
        if(!list) return null
        return list
      } catch (error:constant) {
        throw new Error("An unexpected error is occurred");
      }
    }

    // course details use case

    async courseDetailsUseCase(courseId:string):Promise<CourseEntity|null>{
        const {courseDetailsRepo} = this.dependencies.repositories
        try {
            
            const details = await courseDetailsRepo(courseId)
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