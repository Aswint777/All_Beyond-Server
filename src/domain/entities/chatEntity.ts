export interface CourseChat {
    id: string;
    title: string;
    instructorId: string;
    chatGroupId?: string;
    enrolledStudents: string[];
  }

  export interface ChatGroup {
    id: string;
    courseId: string;
    adminId: string;
    members: string[];
    createdAt: Date;
  }


  export interface Message {
    id: string;
    chatGroupId: string;
    senderId: string;
    content: string;
    fileUrl?: string;
    createdAt: Date;
  }