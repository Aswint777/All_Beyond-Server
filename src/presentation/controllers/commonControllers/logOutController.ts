import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import { log } from "console";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { httpStatusCode } from "../../../_lib/common/HttpStatusCode";

dotenv.config();

export const logOutController = (dependencies: IDependencies) => {
  const { useCases } = dependencies;
  // const {logOutUseCse}=useCases
  return async (req: Request, res: Response) => {
    try {
      console.log("here the console");
      const cookieOptions: any = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 0,
      };
      res.cookie("access_token", "", cookieOptions);
      res.cookie("refresh_token", "", cookieOptions);

      res.status(httpStatusCode.NO_CONTENT).json({
        success: true,
      });

      // const authHeader = req.headers.authorization; 
      // if (!authHeader || !authHeader.startsWith("Bearer ")) {
      //     return res.status(401).json({ error: "Authorization token missing or invalid." });
      //   }
      // const token = authHeader.split(" ")[1];

      // const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);

      // console.log("Token decoded successfully:", decoded);
    } catch (error: any) {
      res
        .status(500)
        .json({ error: "Internal server error. Please try again later." });
    }
  };
};
