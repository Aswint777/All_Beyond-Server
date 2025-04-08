import { IDependencies } from "../../../application/interfaces/IDependencies";
import { EnrolmentController } from "./enrolmentController";

export const studentController = (dependencies: IDependencies) => {
    const enrolment = new EnrolmentController(dependencies)
    return {
      enrollCourse : enrolment.enrollCourse.bind(enrolment),
      coursePayment : enrolment.coursePayment.bind(enrolment)
  
    };
  };