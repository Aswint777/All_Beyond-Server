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
  async createCourseUseCase(courseData:CourseEntity,id:string):Promise<CourseEntity|null>{
    try {
        console.log('createCourseUseCase(courseData:CourseEntity):Promise<CourseEntity');
        console.log(courseData,'jjjjjjj');
        
        const{createCourseRepository}=this.dependencies.repositories
        const saveCourse = await createCourseRepository(courseData,id)
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

// list 
async listInstructorCourseUseCase(
  id: string,
  search: string = "", // Default to empty string
  skip: number = 0,   // Default to 0
  limit: number = 6   // Default to 6
): Promise<{ courses: CourseEntity[]; totalCourses: number } | null> {
  const { listInstructorRepository } = this.dependencies.repositories;
  try {
    console.log("Fetching courses with:", { id, search, skip, limit });
    const result = await listInstructorRepository(id, search, skip, limit);
    console.log("Courses fetched:", result);
    if (!result || !result.courses || result.courses.length === 0) return null;
    return result;
  } catch (error: any) {
    console.error("Error in use case:", error);
    throw new Error("An unexpected error occurred");
  }
}
  // async listInstructorCourseUseCase(id:string):Promise<CourseEntity[] |null>{
  //   const {listInstructorRepository} = this.dependencies.repositories
  //   try {
  //     console.log('haaaaaaaaaaaaaaaaaaaaaaaaaaaaaahhhhh',id);
  //     const list = await listInstructorRepository(id)
  //     console.log(list);
      
  //     if(!list) return null
  //     return list
  //   } catch (error:constant) {
  //     throw new Error("An unexpected error is occurred");
  //   }
  // }

  async editCourseUseCase(courseData:CourseEntity):Promise<CourseEntity|null>{
    const {editCourseRepository} = this.dependencies.repositories
    try {
      const course = await editCourseRepository(courseData)
      if(!course) return null
      return course
    } catch (error:constant) {
      throw new Error("An unexpected error is occurred");
    }
  }

  // Block Course 
  async blockCourseUseCase(courseId:string):Promise<CourseEntity|null>{
    const {blockCourseRepository} = this.dependencies.repositories
    try {
      console.log('usecase');
      
      const course = await blockCourseRepository(courseId)
      if(!course) return null
      return course
    } catch (error) {
      throw new Error("An unexpected error is occurred");
    }
  }

  
}
