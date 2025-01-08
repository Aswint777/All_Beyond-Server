
import { Request,Response } from "express";
import { LoginUseCase } from "../../application/use-Cases/LoginUseCase"
import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl"



const userRepository = new UserRepositoryImpl();
const loginUseCase = new LoginUseCase(userRepository);

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await loginUseCase.execute({ email, password });
      res.json({ token });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
