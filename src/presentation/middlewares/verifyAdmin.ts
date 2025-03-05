import { NextFunction, Request, Response } from "express";
// import { ErrorResponse } from "../common/error";

export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return next("Token not found, verify admin");
    }

    if (req.user.role !== "admin") {
      console.log(req.user.role,"role hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
      
      return next("Role mismatch, verify admin");
    }

    next();
  } catch (error) {
    console.error("Error in JWT verify user:", error);
    next(error);
  }
};
