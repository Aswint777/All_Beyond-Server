import mongoose from "mongoose";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { IRepositories } from "../../../application/interfaces/IRepositories";
import { CourseEntity } from "../../../domain/entities/courseEntity";
import { constant } from "../../../_lib/common/constant";
import { Course } from "../../database/model/courseModel";
import { category } from "../../database/model";


interface CoursesResponse {
  courses: CourseEntity[];
  totalPages: number;
}

export class CourseRepository
  implements Pick<IRepositories, "allCoursesRepo"|"getCoursesCountRepo">
{
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  
async allCoursesRepo(
  page: number,
  limit: number,
  search?: string ,
  category?: string ,
  sort?: string ,
  pricingOption?: string 
): Promise<CoursesResponse> {
  try {
    // Base match stage for filtering
    const matchStage = {
      isBlocked: false,
      "categoryDetails.isBlocked": false,
      ...(search && {
        $or: [
          { courseTitle: { $regex: search, $options: "i" } },
          { courseDescription: { $regex: search, $options: "i" } },
        ],
      }),
      ...(category && { "categoryDetails.name": category }),
      ...(pricingOption && { pricingOption: pricingOption }),
    };

    // Pipeline for fetching courses
    const pipeline: any[] = [
      {
        $lookup: {
          from: "categories",
          localField: "categoryName",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      { $match: matchStage },
      {
        $sort: {
          ...(sort === "dateAsc" && { createdAt: 1 }),
          ...(sort === "dateDesc" && { createdAt: -1 }),
          ...(sort === "priceAsc" && { price: 1 }),
          ...(sort === "priceDesc" && { price: -1 }),
        },
      },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    // Remove empty $sort stage if no sort option is provided
    if (Object.keys(pipeline.find((stage) => stage.$sort)?.$sort || {}).length === 0) {
      pipeline.splice(pipeline.findIndex((stage) => stage.$sort), 1);
    }

    // Pipeline for counting total documents
    const countPipeline: any[] = [
      {
        $lookup: {
          from: "categories",
          localField: "categoryName",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      { $match: matchStage },
      { $count: "totalDocuments" },
    ];

    // Execute both pipelines concurrently
    const [coursesData, countData] = await Promise.all([
      Course.aggregate(pipeline),
      Course.aggregate(countPipeline),
    ]);

    // Calculate total pages
    const totalDocuments = countData[0]?.totalDocuments || 0;
    const totalPages = Math.ceil(totalDocuments / limit);

    return {
      courses: coursesData as CourseEntity[],
      totalPages,
    };
  } catch (error: any) {
    throw new Error("An unexpected error occurred: " + error.message);
  }
}


async getCoursesCountRepo(
  search: string = "",
  category: string = "",
  pricingOption: string = ""
): Promise<number> {
  try {
    const pipeline: any[] = [
      {
        $lookup: {
          from: "categories",
          localField: "categoryName",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $match: {
          isBlocked: false,
          "categoryDetails.isBlocked": false,
          ...(search && {
            $or: [
              { courseTitle: { $regex: search, $options: "i" } },
              { courseDescription: { $regex: search, $options: "i" } },
            ],
          }),
          ...(category && { "categoryDetails.name": category }),
          ...(pricingOption && { pricingOption: pricingOption }),
        },
      },
      { $count: "total" },
    ];

    const result = await Course.aggregate(pipeline);
    return result[0]?.total || 0;
  } catch (error: any) {
    throw new Error("An unexpected error occurred: " + error.message);
  }
}
   
  // all course
  // async allCoursesRepo(page: number, limit: number, search?:string, category?:string,sort?:string,pricingOption?:string): Promise<CourseEntity[] | null> {
  //   try {
  //     const pipeline: any[] = [
  //       {
  //         $lookup: {
  //           from: "categories",
  //           localField: "categoryName",
  //           foreignField: "_id",
  //           as: "categoryDetails",
  //         },
  //       },
  //       { $unwind: "$categoryDetails" },
  //       {
  //         $match: {
  //           isBlocked: false,
  //           "categoryDetails.isBlocked": false,
  //           ...(search && {
  //             $or: [
  //               { courseTitle: { $regex: search, $options: "i" } },
  //               { courseDescription: { $regex: search, $options: "i" } },
  //             ],
  //           }),
  //           ...(category && { "categoryDetails.name": category }),
  //         },
  //       },
  //       { $skip: (page - 1) * limit },
  //       { $limit: limit },
  //     ];
  
  //     const data = await Course.aggregate(pipeline);
  //     return data.length > 0 ? (data as CourseEntity[]) : null;
  //   } catch (error: any) {
  //     throw new Error("An unexpected error occurred: " + error.message);
  //   }
  // }

  
  // async getCoursesCountRepo(): Promise<number> {
  //   try {
  //     const pipeline: any[] = [
  //       {
  //         $lookup: {
  //           from: "categories",
  //           localField: "categoryName",
  //           foreignField: "_id",
  //           as: "categoryDetails",
  //         },
  //       },
  //       { $unwind: "$categoryDetails" },
  //       {
  //         $match: {
  //           isBlocked: false,
  //           "categoryDetails.isBlocked": false,
  //         },
  //       },
  //       { $count: "total" },
  //     ];
  
  //     const result = await Course.aggregate(pipeline);
  //     return result[0]?.total || 0;
  //   } catch (error: any) {
  //     throw new Error("An unexpected error occurred: " + error.message);
  //   }
  // }
  
 

   // course details page 
   async courseDetailsRepo(courseId: string): Promise<CourseEntity | null> {
    try {  
      return await Course.findOne({ _id: new mongoose.Types.ObjectId(courseId) });
      
    } catch (error) {
      throw new Error("An unexpected error occurred");
    }
  }
  
  // fetch similar courses
  async similarCourseRepo(courseId:string):Promise<CourseEntity[]|null>{
    try {
      const currentCourse = await Course.findOne({ _id: new mongoose.Types.ObjectId(courseId) });
      
      const similar = await Course.find({categoryName: currentCourse?.categoryName,  _id: { $ne: currentCourse?._id } })
      if(!similar) return null
       return similar
    } catch (error:constant) {
      throw new Error("An unexpected error occurred");
    }
  }

    async latestCoursesRepo():Promise<CourseEntity[]|null>{
    try {
        console.log('looooooooooooooooooooooooooooooooooooooooooooooooooooooooo');

      const latest = await Course.find().sort({createdAt:1}).limit(6);
      console.log(latest,'vvvvvvv');
      
      if(!latest) return null
       return latest
    } catch (error:constant) {
      throw new Error("An unexpected error occurred");
    }
  }
}