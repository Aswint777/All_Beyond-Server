import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";

interface S3File extends Express.Multer.File {
  location: string; // S3 adds 'location' property with the file URL
  key: string;      // S3 key/path of the file

}

export class CourseController{
    private dependencies :IDependencies
    constructor(dependencies: IDependencies) {
        this.dependencies = dependencies;
      }
      async createCourse(req: Request, res: Response): Promise<void> {
        console.log('here the data in the course controller');
        
        try {
          if (!req.files || !Array.isArray(req.files)) {
            res.status(httpStatusCode.BAD_REQUEST).json({ message: "No files uploaded" });
            return;
          }
          const files = req.files as S3File[];

            console.log('data is in the create course page ');
            console.log(req.body);
            const { title, description, category, instructorName, isPaid } = req.body;

            // const thumbnailUrl = req.files["thumbnail"] ? req.files["thumbnail"][0].location : null;
            // const videoUrls = req.files["videos"] ? req.files["videos"].map(file => file.location) : [];
            
            // const files = req.files as { [key: string]: S3File[] } | undefined;============

            // Check if files exist before accessing them
            // const thumbnailUrl = files?.["thumbnail"]?.[0]?.location || null;====================
            // const videoUrls = files?.["videos"]?.map(file => file.location) || [];=============

            // console.log("Thumbnail URL:", thumbnailUrl);
            // console.log("Video URLs:", videoUrls);


            const thumbnail = files.find(file => file.fieldname === 'thumbnail');
    
            // Extract videos with pattern matching
            const videoFiles = files.filter(file => file.fieldname.startsWith('video_'));
            
            // Map videos to their respective module and lesson
            const videos = videoFiles.map(file => {
              // Extract moduleIndex and lessonIndex from fieldname (video_0_1)
              const [_, moduleIndex, lessonIndex] = file.fieldname.split('_');
              return {
                url: file.location, // S3 URL
                key: file.key,      // S3 key
                moduleIndex: parseInt(moduleIndex),
                lessonIndex: parseInt(lessonIndex)
              };
            });
            console.log(req.body,'body');
            
      console.log(thumbnail,"thumbnail");
      console.log(videoFiles,'videooooooooos');

      // const courseToSave = {
      //   title: courseData.title,
      //   description: courseData.description,
      //   category: courseData.category,
      //   instructorName: courseData.instructorName,
      //   aboutInstructor: courseData.aboutInstructor,
      //   isPaid: courseData.isPaid,
      //   price: courseData.price || null,
      //   accountNumber: courseData.accountNumber || null,
      //   email: courseData.email || null,
      //   phone: courseData.phone || null,
      //   thumbnailUrl: thumbnail ? thumbnail.location : null,
      //   thumbnailKey: thumbnail ? thumbnail.key : null,
      //   modules: [] // You'll need to structure this based on your data model
      // };
      
      // Example of how you might organize videos into modules
      // (Adjust according to your data structure)
      const moduleMap = new Map();
      
      videos.forEach(video => {
        if (!moduleMap.has(video.moduleIndex)) {
          moduleMap.set(video.moduleIndex, {
            lessons: []
          });
        }
        const module = moduleMap.get(video.moduleIndex);
        // Make sure array is long enough
        while (module.lessons.length <= video.lessonIndex) {
          module.lessons.push({});
        }
        
        // Assign video to the right lesson
        module.lessons[video.lessonIndex].videoUrl = video.url;
        module.lessons[video.lessonIndex].videoKey = video.key;
      });
      
            
        } catch (error) {
            console.error("Error in editProfileController:");
            res
              .status(httpStatusCode.INTERNAL_SERVER_ERROR)
              .json({ message: "Internal Server Error" });
            return;
        }
      }
}