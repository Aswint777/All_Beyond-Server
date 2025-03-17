import { constant } from "../../../_lib/common/constant";
import { categoryEntity } from "../../../domain/entities/categoryEntity";
import { CourseEntity } from "../../../domain/entities/courseEntity";
import { IDependencies } from "../../interfaces/IDependencies";


export class CourseUseCase {
  private dependencies: IDependencies;

  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  // Create Course UseCase 
  async createCourseUseCase(courseData:CourseEntity):Promise<CourseEntity|null>{
    try {
        console.log('createCourseUseCase(courseData:CourseEntity):Promise<CourseEntity');
        console.log(courseData,'jjjjjjj');
        
        const{createCourseRepository}=this.dependencies.repositories
        const saveCourse = await createCourseRepository(courseData)
        if(!saveCourse){
            return null
        }
        return saveCourse
        
    } catch (error:constant) {
      throw new Error("An unexpected error is occurred");

    }
  }

  // Get all Categories 
  async allCategoriesUseCase():Promise<categoryEntity[]|null>{
    const {getAllCategoryRepository} = this.dependencies.repositories
    try {
        const allCategories = await getAllCategoryRepository()
        if(!allCategories) return null
        return allCategories
        
    } catch (error:constant) {
        throw new Error("An unexpected error is occurred");

    }
  }
}
