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
import { CourseEntity } from "../../../domain/entities/courseEntity";
import { ChatGroup, ChatGroupInput } from "../../../domain/entities/chatEntity";

interface S3File extends Express.Multer.File {
  location: string; // S3 adds 'location' property with the file URL
  key: string; // S3 key/path of the file
}

interface LessonInput {
  id?: string;
  title: string;
  description?: string;
  lessonDescription?: string;
  video?: string;
  replaceVideo?: boolean;
}
interface ModuleInput {
  id?: string;
  title: string;
  lessons: LessonInput[];
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
    const { createCourseUseCase, createChatUseCase } =
      this.dependencies.useCases;

    try {
      if (!req.user) {
        return;
      }
      const token = req.cookies.access_token;
      if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
      }

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
        modules,
      } = req.body;

      const thumbnail = files.find((file) => file.fieldname === "thumbnail");
      const videoFiles = files.filter((file) =>
        file.fieldname.startsWith("video_")
      );

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
        pricingOption: isPaid,
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
      if (!savedCourse || !savedCourse._id) {
        throw new Error("Failed to create course");
      }
      if (!savedCourse.courseTitle) {
        throw new Error("Course title is missing in the saved course");
      }

      const data: ChatGroupInput = {
        title: savedCourse.courseTitle,
        courseId: savedCourse._id.toString(),
        adminId: id,
        members: [id],
      };

      const createGroupChat = await createChatUseCase(
        this.dependencies
      ).execute(data);

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

  //list course
  async listInstructorCourse(req: Request, res: Response): Promise<void> {
    const { listInstructorCourseUseCase } = this.dependencies.useCases;
    try {
      const user = getUserFromToken(req, res);
      if (!user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
      }
      const id = user._id;
      console.log("req.query:", req.query);

      const { search = "", page = "1", limit = "6" } = req.query;
      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 6;
      const skip = (pageNum - 1) * limitNum;

      // Ensure search is a string and not undefined
      const safeSearch = typeof search === "string" ? search : "";

      console.log("Query params:", { id, search: safeSearch, skip, limitNum });

      const result = await listInstructorCourseUseCase(
        this.dependencies
      ).execute(id, safeSearch, skip, limitNum);

      if (!result) {
        res.status(404).json({
          success: false,
          message: "No courses found",
        });
        return;
      }

      const { courses, totalCourses } = result;

      const coursesWithSignedUrls = await Promise.all(
        courses.map(async (course: CourseEntity) => {
          if (course.thumbnailUrl) {
            const fileKey = course.thumbnailUrl.split(
              "/course_assets/thumbnails/"
            )[1];
            course.thumbnailUrl = await getSignedUrlForS3thumbnails(fileKey);
          }
          return course;
        })
      );

      const totalPages = Math.ceil(totalCourses / limitNum);

      res.status(200).json({
        success: true,
        message: "Course Listing successful",
        data: {
          courses: coursesWithSignedUrls,
          totalPages,
          currentPage: pageNum,
          totalCourses,
        },
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }

  // Fetch Course Details
  async viewCourses(req: Request, res: Response): Promise<void> {
    const { courseDetailsUseCase } = this.dependencies.useCases;

    try {
      const { courseId } = req.params;
      console.log("Fetching course details for:", courseId);

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

      if (course.thumbnailUrl) {
        const thumbnailKey = course.thumbnailUrl.split(
          "/course_assets/thumbnails/"
        )[1];
        course.thumbnailUrl = await getSignedUrlForS3thumbnails(thumbnailKey);
      }

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

  async editCourse(req: Request, res: Response): Promise<void> {
    const { editCourseUseCase, courseDetailsUseCase } =
      this.dependencies.useCases;

    try {
      console.log("edit Course in instructor");
      const files = (req.files as S3File[]) || [];
      const { courseId } = req.params;
      console.log("files:", files);

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
      const decoded = jwt.verify(token, secretKey) as {
        _id: string;
        email: string;
        role: string;
      };
      const id = decoded._id;

      const {
        title,
        courseDescription,
        category,
        instructor,
        aboutInstructor,
        isPaid,
        price,
        accountNumber,
        email,
        phone,
        modules,
        thumbnailUrl,
      } = req.body;

      const thumbnail = files.find((file) => file.fieldname === "thumbnail");
      const videoFiles = files.filter((file) =>
        file.fieldname.startsWith("video_")
      );
      const existingCourse = await courseDetailsUseCase(
        this.dependencies
      ).execute(courseId);
      if (!existingCourse) {
        res
          .status(httpStatusCode.NOT_FOUND)
          .json({ message: "Course not found" });
        return;
      }

      const parsedModules = (
        typeof modules === "string" ? JSON.parse(modules) : modules
      ) as ModuleInput[];

      const content = parsedModules.map(
        (module: ModuleInput, moduleIndex: number) => {
          const existingModule = existingCourse.content?.find(
            (m) => m.moduleTitle === module.title
          );

          // extract lessons first
          const lessons = module.lessons.map(
            (
              lesson,
              lessonIndex
            ): {
              lessonTitle: string;
              lessonDescription: string;
              video: string;
              _id?: string;
            } => {
              const existingLesson = existingModule?.lessons?.find(
                (l) =>
                  l._id?.toString() === lesson.id ||
                  l.lessonTitle === lesson.title
              );

              const video = videoFiles.find(
                (file) =>
                  file.fieldname === `video_${moduleIndex}_${lessonIndex}`
              );

              let videoUrl = "";
              if (existingLesson) {
                if (lesson.replaceVideo && video) {
                  videoUrl = video.location;
                } else {
                  videoUrl = existingLesson.video || "";
                }
              } else {
                if (video) {
                  videoUrl = video.location;
                } else {
                  videoUrl = lesson.video || "";
                }
              }

              const lessonObj: {
                lessonTitle: string;
                lessonDescription: string;
                video: string;
                _id?: string;
              } = {
                lessonTitle: lesson.title,
                lessonDescription:
                  lesson.lessonDescription || lesson.description || "",
                video: videoUrl,
              };

              if (lesson.id && lesson.id !== "") {
                lessonObj._id = lesson.id;
              } else if (existingLesson?._id) {
                lessonObj._id = existingLesson._id.toString();
              }

              return lessonObj;
            }
          );

          const moduleObj: {
            moduleTitle: string;
            lessons: {
              lessonTitle: string;
              lessonDescription: string;
              video: string;
              _id?: string;
            }[];
            _id?: string;
          } = {
            moduleTitle: module.title,
            lessons,
          };

          if (module.id) {
            moduleObj._id = module.id;
          }

          return moduleObj;
        }
      );

      const isObjectId = (id: string) => /^[0-9a-fA-F]{24}$/.test(id);

      content.forEach((module) => {
        if (module._id && !isObjectId(module._id.toString())) {
          delete module._id;
        }
        module.lessons.forEach((lesson) => {
          if (lesson._id && !isObjectId(lesson._id.toString())) {
            delete lesson._id;
          }
        });
      });

      const courseData = {
        _id: courseId,
        courseTitle: title,
        courseDescription,
        categoryName: category,
        instructor,
        aboutInstructor,
        pricingOption: isPaid,
        price: price ? parseFloat(price) : undefined,
        accountNumber: accountNumber ? parseInt(accountNumber) : undefined,
        additionalEmail: email,
        additionalContactNumber: phone,
        thumbnailUrl: thumbnail?.location || existingCourse.thumbnailUrl || "",
        // thumbnailKey: thumbnail?.key || existingCourse.thumbnailKey || "",
        content,
      };

      const updatedCourse = await editCourseUseCase(this.dependencies).execute(
        courseData
      );

      if (!updatedCourse) {
        res
          .status(httpStatusCode.NOT_FOUND)
          .json({ message: "Course not found or update failed" });
        return;
      }

      res.status(httpStatusCode.OK).json({
        message: "Course updated successfully",
        course: updatedCourse,
      });
    } catch (error) {
      console.error("Error updating course:", error);
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }

  // block course controller
  async blockCourse(req: Request, res: Response): Promise<void> {
    const { blockCourseUseCase } = this.dependencies.useCases;
    try {
      console.log("block course");
      const { courseId } = req.params;
      console.log(courseId);
      const course = await blockCourseUseCase(this.dependencies).execute(
        courseId
      );
      if (course?.thumbnailUrl) {
        const thumbnailKey = course.thumbnailUrl.split(
          "/course_assets/thumbnails/"
        )[1];
        course.thumbnailUrl = await getSignedUrlForS3thumbnails(thumbnailKey);
      }
      res.status(httpStatusCode.OK).json({
        message: "Course updated successfully",
        course: course,
      });
    } catch (error: constant) {
      res
        .status(httpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  }
}
