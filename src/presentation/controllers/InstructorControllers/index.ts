import { IDependencies } from "../../../application/interfaces/IDependencies";
import { InstructorController } from "./instructorApplicationController";

export const instructorController = (dependencies: IDependencies) => {
  const instructorController = new InstructorController(dependencies);
  return {
    instructorApplication:
      instructorController.instructorApplication.bind(instructorController),
  };
};
