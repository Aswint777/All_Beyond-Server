import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { generateAccessToken } from "../../_lib/jwt";

interface UserPayload {
  _id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const jwtMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("JWT Middleware Executing...!");

    const { access_token, refresh_token } = req.cookies;
   console.log(req.cookies,"req.cookies");
   
    let user: UserPayload | null = null;
    console.log(access_token, refresh_token);

    if (access_token) {
      try {
        user = jwt.verify(
          access_token,
          process.env.ACCESS_TOKEN_SECRET as string
        ) as UserPayload;
        console.log("Access token valid.");
      } catch (error) {
        console.log(
          "Access token expired or invalid. Checking refresh token..."
        );
      }
    }
    

    if (!user && refresh_token) {
      try {
        const refreshUser = jwt.verify(
          refresh_token,
          process.env.REFRESH_TOKEN_SECRET as string
        ) as UserPayload;

        const newAccessToken = generateAccessToken(refreshUser);
        res.cookie("access_token", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        user = refreshUser;
        console.log("New access token generated from refresh token.");
      } catch (refreshError) {
        console.log("Invalid or expired refresh token.");
        return;
      }
    }

    if (!user) {
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in JWT middleware:", error);
    return;
  }
};
