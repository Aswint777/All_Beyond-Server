import { Request, Response } from "express";
import { IDependencies } from "../../../application/interfaces/IDependencies";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { generateUserID } from "../../../_lib/common/generateUserID";
dotenv.config();

export const getFirstUserDetailsController = (dependencies: IDependencies) => {
  const { useCases } = dependencies;
  const { getUserDetailsUseCase } = useCases;
  return async (req: Request, res: Response) => {
    try {
      console.log("start controller,,,,,,,,,,,,,,,,");

      // 🛑 Extract JWT from cookies
      const token = req.cookies.access_token;
      console.log(token);

      if (!token) {
        console.log("skjdncskjb");

        res.status(401).json({ message: "Unauthorized: No token provided" });
        return
      }

      // 🛑 Verify JWT
      const secretKey = process.env.ACCESS_TOKEN_SECRET as string;
      console.log("secrett:;;;;;;;", secretKey);

      const decoded = jwt.verify(token, secretKey) as {
        _id: string;
        email: string;
        role: string;
      };

      console.log("Decoded User:", decoded);
      const userDetails = await getUserDetailsUseCase(dependencies).execute(
        decoded._id
      );

      res.status(201).json({
        success: true,
        message: "User details is fetched",
        user: userDetails,
      });
      console.log(res.status(201).json);
      return;
    } catch (error: any) {
      console.error("Error in getFirstUserDetailsController:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
};
