import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";

interface S3File extends Express.Multer.File {
  location: string; // S3 adds 'location' property with the file URL
  key: string; // S3 key/path of the file
}

export class CourseController {
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }

  async createCourse(req: Request, res: Response): Promise<void> {
    const { createCourseUseCase } = this.dependencies.useCases;
  
    try {
      if (!req.files || !Array.isArray(req.files)) {
        res.status(httpStatusCode.BAD_REQUEST).json({ message: "No files uploaded" });
        return;
      }
      const files = req.files as S3File[];
  
      const {
        title,
        courseDescription,
        category,
        instructorName,
        aboutInstructor,
        isPaid,
        price,
        accountNumber,
        email,
        phone,
        modules, // Expecting modules as an array from FormData
      } = req.body;
  
      const thumbnail = files.find((file) => file.fieldname === "thumbnail");
      const videoFiles = files.filter((file) => file.fieldname.startsWith("video_"));
  
      // Parse module and lesson data from req.body.modules
      const content = modules.map((module: any, moduleIndex: number) => ({
        moduleTitle: module.title,
        lessons: module.lessons.map((lesson: any, lessonIndex: number) => {
          const video = videoFiles.find((file) => file.fieldname === `video_${moduleIndex}_${lessonIndex}`);
          return {
            lessonTitle: lesson.title,
            lessonDescription: lesson.lessonDescription,
            video: video?.location || "",
          };
        }),
      }));
  
      const courseData = {
        courseTitle: title,
        courseDescription,
        categoryName: category,
        instructorName,
        aboutInstructor,
        pricingOption: isPaid, // Match schema field
        Price: price ? parseFloat(price) : undefined,
        accountNumber: accountNumber ? parseInt(accountNumber) : undefined,
        additionalEmail: email,
        additionalContactNumber: phone,
        thumbnailUrl: thumbnail?.location || "",
        thumbnailKey: thumbnail?.key || "",
        content,
      };
  
      const savedCourse = await createCourseUseCase(this.dependencies).execute(courseData);
      res.status(httpStatusCode.CREATED).json({ message: "Course created successfully", course: savedCourse });
    } catch (error) {
      console.error("Error in add Course:", error);
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
  }



  // Create New course 
  // async createCourse(req: Request, res: Response): Promise<void> {
  //   console.log("here the data in the course controller");
  //   const { createCourseUseCase } = this.dependencies.useCases;

  //   try {
  //     if (!req.files || !Array.isArray(req.files)) {
  //       res
  //         .status(httpStatusCode.BAD_REQUEST)
  //         .json({ message: "No files uploaded" });
  //       return;
  //     }
  //     const files = req.files as S3File[];

  //     console.log("data is in the create course page ");
  //     console.log(req.body);
  //     const {
  //       title,
  //       courseDescription,
  //       category,
  //       instructorName,
  //       aboutInstructor,
  //       isPaid,
  //       price,
  //       accountNumber,
  //       email,
  //       phone,
  //     } = req.body;

  //     const thumbnail = files.find((file) => file.fieldname === "thumbnail");

  //     // Extract videos with pattern matching
  //     const videoFiles = files.filter((file) =>
  //       file.fieldname.startsWith("video_")
  //     );

  //     const videos = videoFiles.map((file) => {
  //       const [_, moduleIndex, lessonIndex] = file.fieldname.split("_");
  //       return {
  //         url: file.location, // S3 URL
  //         key: file.key, // S3 key
  //         moduleIndex: parseInt(moduleIndex),
  //         lessonIndex: parseInt(lessonIndex),
  //       };
  //     });
  //     console.log(thumbnail, "thumbnail");
  //     console.log(videoFiles, "videooooooooos");

  //     const moduleMap = new Map();

  //     videos.forEach((video) => {
  //       if (!moduleMap.has(video.moduleIndex)) {
  //         moduleMap.set(video.moduleIndex, {
  //           lessons: [],
  //         });
  //       }
  //       const module = moduleMap.get(video.moduleIndex);
  //       // Make sure array is long enough
  //       while (module.lessons.length <= video.lessonIndex) {
  //         module.lessons.push({});
  //       }

  //       // Assign video to the right lesson
  //       module.lessons[video.lessonIndex].videoUrl = video.url;
  //       module.lessons[video.lessonIndex].videoKey = video.key;
  //     });

  //     const modules = Array.from(moduleMap, ([index, data]) => ({
  //       moduleIndex: index,
  //       lessons: data.lessons,
  //     }));

  //     const courseData = {
  //       courseTitle: title, // Renamed to match CourseEntity
  //       courseDescription,
  //       categoryName: category, // Renamed to match CourseEntity
  //       instructorName,
  //       aboutInstructor,
  //       isPaid,
  //       price: parseFloat(price),
  //       accountNumber,
  //       email,
  //       phone,
  //       thumbnailUrl: thumbnail?.location || "",
  //       thumbnailKey: thumbnail?.key || "",
  //       content: modules, // Assuming content should be the list of modules
  //       pricingOptionts: { amount: parseFloat(price), currency: "USD" }, // Corrected the key name
  //     };

  //     const savedCourse = await createCourseUseCase(this.dependencies).execute(
  //       courseData
  //     );
  //     res
  //       .status(httpStatusCode.CREATED)
  //       .json({ message: "Course created successfully", course: savedCourse });
  //   } catch (error) {
  //     console.error("Error in add Course:");
  //     res
  //       .status(httpStatusCode.INTERNAL_SERVER_ERROR)
  //       .json({ message: "Internal Server Error" });
  //     return;
  //   }
  // }
  
  // controller for fetching all categories 
  async getCourseCategories(req:Request,res:Response):Promise<void>{
    const {allCategoriesUseCase} = this.dependencies.useCases
    try {
      console.log("get course Categories ............")
      const allCategories = await allCategoriesUseCase(this.dependencies).execute()
      console.log(allCategories,'>>>>>>>>>>>>>>>>>>>>>>>');
      
      res.status(httpStatusCode.CREATED).json({
        success: true,
        message: "Instructor application submitted successfully",
        data: allCategories,
      });
    } catch (error) {
      res
      .status(httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
    return;
    }
  }
}


