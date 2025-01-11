
import { Request,Response } from "express";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { dependencies } from "../../_boot/dependency/authDependencies";
import { checkByNameUseCase } from "../../application/use-Cases/auth_Use-case";
import { httpStatusCode } from "../../_lib/common/HttpStatusCode";
import { User } from "../../infrastructure/database/model/userModel";
// import { LoginUseCase } from "../../application/use-Cases/LoginUseCase"
// import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl"



// export const signUp = async (req: Request, res: Response): Promise<void> => {
  // console.log("Hello from the auth controller signUp");

  //     console.log(req.body, "  === Received Data ===");
  //     const nwewUser = await User.create({username:"aswin",email:"aswin@gmail.com",password:"1234567"})
  //   }
 


// --------------------------------------------------------------------------------------------------------
// Login Function
export const login = async (req: Request, res: Response): Promise<void> => {
  console.log("Hello from the auth controller login");
  
  // Uncomment and customize the code below when adding logic
  // try {
  //   const { email, password } = req.body;
  //   const token = await loginUseCase.execute({ email, password });
  //   res.json({ token });
  // } catch (error: any) {
  //   res.status(400).json({ error: error.message });
  // }
};