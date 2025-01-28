import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";
import { generateAccessToken, generateRefreshToken } from "../../../_lib/jwt";

export const loginController = (dependencies: IDependencies) => {
  const { useCases } = dependencies;
  const { loginUseCase } = useCases;
  return async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const { email, password } = req.body;
      const userLogin = await loginUseCase(dependencies).execute(
        email,
        password
      );
      console.log(userLogin, "userLogin");
      if (!userLogin) {
        res.status(httpStatusCode.CONFLICT).json({
          success: false,
          message: "There is a problem in your Email or password, try again",
        });
        return;
      }

      const accessToken = generateAccessToken({
        _id: String(userLogin?._id),
        email: userLogin?.email!,
        role: userLogin?.role!,
      });
      const refreshToken = generateRefreshToken({
        _id: String(userLogin?._id),
        email: userLogin?.email!,
        role: userLogin?.role!,
      });

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.status(httpStatusCode.OK).json({
        success: true,
        data: userLogin,
        message: "User logged in successfully",
      });
    } catch (error: any) {
      console.error("Error during signup:", error.message);
      res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  };
};
