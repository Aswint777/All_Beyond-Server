import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { constant } from "../../../_lib/common/constant";
import jwt from "jsonwebtoken";
import { getUserFromToken } from "../../../infrastructure/utils/getUserFromToken";
import {
  getSignedUrlForS3thumbnails,
  getSignedUrlForS3Videos,
} from "../../../_boot/getSignedUrl";

interface S3File extends Express.Multer.File {
  location: string; // S3 adds 'location' property with the file URL
  key: string; // S3 key/path of the file
}

interface S3File extends Express.MulterS3.File {
  location: string;
  key: string;
}

// Define types for Lesson and Module
interface Lesson {
  _id: string;
  lessonTitle: string;
  lessonDescription: string;
  video: string;
}

interface Module {
  _id: string;
  moduleTitle: string;
  lessons: Lesson[];
}

export class CourseController {
  private dependencies: IDependencies;
  constructor(dependencies: IDependencies) {
    this.dependencies = dependencies;
  }
  // create new Course
  async createCourse(req: Request, res: Response): Promise<void> {
    const { createCourseUseCase } = this.dependencies.useCases;

    try {
      if (!req.user) {
        return;
      }
      const token = req.cookies.access_token;
      if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
      }

      // 🛑 Verify JWT
      const secretKey = process.env.ACCESS_TOKEN_SECRET as string;
      const decoded = jwt.verify(token, secretKey) as {
        _id: string;
        email: string;
        role: string;
      };
      const id = decoded._id;

      if (!req.files || !Array.isArray(req.files)) {
        res
          .status(httpStatusCode.BAD_REQUEST)
          .json({ message: "No files uploaded" });
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
      const videoFiles = files.filter((file) =>
        file.fieldname.startsWith("video_")
      );

      // Parse module and lesson data from req.body.modules
      const content = modules.map((module: any, moduleIndex: number) => ({
        moduleTitle: module.title,
        lessons: module.lessons.map((lesson: any, lessonIndex: number) => {
          const video = videoFiles.find(
            (file) => file.fieldname === `video_${moduleIndex}_${lessonIndex}`
          );
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
        price: price ? parseFloat(price) : undefined,
        accountNumber: accountNumber ? parseInt(accountNumber) : undefined,
        additionalEmail: email,
        additionalContactNumber: phone,
        thumbnailUrl: thumbnail?.location || "",
        thumbnailKey: thumbnail?.key || "",
        content,
      };

      const savedCourse = await createCourseUseCase(this.dependencies).execute(
        courseData,
        id
      );
      res
        .status(httpStatusCode.CREATED)
        .json({ message: "Course created successfully", course: savedCourse });
    } catch (error) {
      console.error("Error in add Course:", error);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  // controller for fetching all categories
  async getCourseCategories(req: Request, res: Response): Promise<void> {
    const { allCategoriesUseCase } = this.dependencies.useCases;
    try {
      const allCategories = await allCategoriesUseCase(
        this.dependencies
      ).execute();
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

  // Course listing in the Instructor side
  async listInstructorCourse(req: Request, res: Response): Promise<void> {
    const { listInstructorCourseUseCase } = this.dependencies.useCases;
    try {
      console.log("Listing the courses...");
      const user = getUserFromToken(req, res);
      if (!user) return;
      const id = user._id;

      let courses = await listInstructorCourseUseCase(
        this.dependencies
      ).execute(id);
      if (!courses) {
        res.status(404).json({
          success: false,
          message: "No courses found",
        });
        return;
      }
      // ✅ Generate Signed URL for Thumbnails
      courses = await Promise.all(
        courses.map(async (course) => {
          if (course.thumbnailUrl) {
            const fileKey = course.thumbnailUrl.split(
              "/course_assets/thumbnails/"
            )[1]; // Extract filename
            course.thumbnailUrl = await getSignedUrlForS3thumbnails(fileKey);
          }
          return course;
        })
      );
      res.status(200).json({
        success: true,
        message: "Course Listing successful",
        data: courses,
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Fetch Course Details
  async viewCourses(req: Request, res: Response): Promise<void> {
    const { courseDetailsUseCase } = this.dependencies.useCases;

    try {
      const { courseId } = req.params;
      console.log("Fetching course details for:", courseId);

      // ✅ Fetch course details from DB
      let course = await courseDetailsUseCase(this.dependencies).execute(
        courseId
      );

      if (!course) {
        res.status(404).json({
          success: false,
          message: "No course found",
        });
        return;
      }

      // ✅ Generate signed URL for the thumbnail (if available)
      if (course.thumbnailUrl) {
        const thumbnailKey = course.thumbnailUrl.split(
          "/course_assets/thumbnails/"
        )[1];
        course.thumbnailUrl = await getSignedUrlForS3thumbnails(thumbnailKey);
      }

      // ✅ Generate signed URLs for videos (if available)
      if (course.content && Array.isArray(course.content)) {
        for (const module of course.content) {
          if (module.lessons && Array.isArray(module.lessons)) {
            for (const lesson of module.lessons) {
              if (lesson.video) {
                const videoKey = lesson.video.split(
                  "/course_assets/videos/"
                )[1];
                lesson.video = await getSignedUrlForS3Videos(videoKey);
              }
            }
          }
        }
      }

      console.log("Updated Course Data:", course);

      res.status(200).json({
        success: true,
        message: "Course details retrieved successfully",
        data: course,
      });
    } catch (error: any) {
      console.error("Error in viewCourses:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
//////////////////////////////////////////
async editCourse(req: Request, res: Response): Promise<void> {
  const { editCourseUseCase } = this.dependencies.useCases;

  try {
    console.log("edit Course in instructor");
    const files = req.files as S3File[];
    const { courseId } = req.params;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized: No user" });
      return;
    }
    const token = req.cookies.access_token;
    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return;
    }
    const secretKey = process.env.ACCESS_TOKEN_SECRET as string;
    const decoded = jwt.verify(token, secretKey) as { _id: string; email: string; role: string };
    const id = decoded._id;

    if (!req.files || !Array.isArray(req.files)) {
      res.status(httpStatusCode.BAD_REQUEST).json({ message: "No files uploaded" });
      return;
    }

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
          video: video?.location || lesson.video || "", // Use existing URL if no new video
        };
      }),
    }));
     const _id = courseId
    const courseData = {
      _id,
      courseTitle: title,
      courseDescription,
      categoryName: category,
      instructorName,
      aboutInstructor,
      pricingOption: isPaid,
      price: price ? parseFloat(price) : undefined,
      accountNumber: accountNumber ? parseInt(accountNumber) : undefined,
      additionalEmail: email,
      additionalContactNumber: phone,
      thumbnailUrl: thumbnail?.location || "",
      thumbnailKey: thumbnail?.key || "",
      content,
    };

    console.log("courseData:", courseData);

    const updatedCourse = await editCourseUseCase(this.dependencies).execute(courseData);

    if (!updatedCourse) {
      res.status(httpStatusCode.NOT_FOUND).json({ message: "Course not found or update failed" });
      return;
    }

    res.status(httpStatusCode.OK).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
}
  // // edit course
  // async editCourse(req: Request, res: Response): Promise<void> {
  //   const { editCourseUseCase } = this.dependencies.useCases;
  //   try {
  //     console.log("edit Course in instructor");
  //     const files = req.files as S3File[];
  //     const { courseId } = req.params;

  //     if (!req.user) {
  //       res.status(401).json({ message: "Unauthorized: No user" });
  //       return;
  //     }
  //     const token = req.cookies.access_token;
  //     if (!token) {
  //       res.status(401).json({ message: "Unauthorized: No token provided" });
  //       return;
  //     }
  //     const secretKey = process.env.ACCESS_TOKEN_SECRET as string;
  //     const decoded = jwt.verify(token, secretKey) as {
  //       _id: string;
  //       email: string;
  //       role: string;
  //     };
  //     const instructorId = decoded._id;
      
  //     const _id = courseId
  //     const {
  //       courseTitle,
  //       courseDescription,
  //       categoryName,
  //       instructorName,
  //       aboutInstructor,
  //       pricingOption,
  //       price,
  //       accountNumber,
  //       additionalEmail,
  //       additionalContactNumber,
  //     } = req.body;

  //     console.log("Request body:", req.body);
  //     console.log("Uploaded files:", files);

  //     const thumbnail = files?.find((file) => file.fieldname === "thumbnail");
  //     const videoFiles = files?.filter((file) =>
  //       file.fieldname.startsWith("video_")
  //     );

  //     // Parse content from FormData with explicit typing
  //     const content: Module[] = [];
  //     for (let i = 0; req.body[`content[${i}][id]`]; i++) {
  //       const module: Module = {
  //         _id: req.body[`content[${i}][id]`],
  //         moduleTitle: req.body[`content[${i}][moduleTitle]`],
  //         lessons: [],
  //       };

  //       for (let j = 0; req.body[`content[${i}][lessons][${j}][id]`]; j++) {
  //         const lesson: Lesson = {
  //           _id: req.body[`content[${i}][lessons][${j}][id]`],
  //           lessonTitle: req.body[`content[${i}][lessons][${j}][lessonTitle]`],
  //           lessonDescription:
  //             req.body[`content[${i}][lessons][${j}][lessonDescription]`],
  //           video: req.body[`content[${i}][lessons][${j}][video]`] || "",
  //         };

  //         const video = videoFiles?.find(
  //           (file) => file.fieldname === `video_${i}_${j}`
  //         );
  //         if (video) {
  //           lesson.video = video.location;
  //         }

  //         module.lessons.push(lesson);
  //       }
  //       content.push(module);
  //     }

  //     const courseData = {
  //       _id,
  //       courseTitle,
  //       courseDescription,
  //       categoryName,
  //       instructorName,
  //       aboutInstructor,
  //       pricingOption,
  //       price: price ? parseFloat(price) : undefined,
  //       accountNumber: accountNumber ? parseInt(accountNumber) : undefined,
  //       additionalEmail,
  //       additionalContactNumber, // Kept as string to match createCourse
  //       thumbnailUrl: thumbnail?.location || "",
  //       thumbnailKey: thumbnail?.key || "",
  //       content,
  //     };

  //     console.log("courseData:", courseData);

  //     const updatedCourse = await editCourseUseCase(this.dependencies).execute(
  //       courseData
  //     );

  //     if (!updatedCourse) {
  //       res
  //         .status(httpStatusCode.NOT_FOUND)
  //         .json({ message: "Course not found or update failed" });
  //       return;
  //     }

  //     res.status(httpStatusCode.OK).json({
  //       message: "Course updated successfully",
  //       course: updatedCourse,
  //     });
  //   } catch (error) {
  //     console.error("Error updating course:", error);
  //     res
  //       .status(httpStatusCode.INTERNAL_SERVER_ERROR)
  //       .json({ message: "Internal Server Error" });
  //   }
  // }
}
