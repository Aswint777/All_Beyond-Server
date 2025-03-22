import jwt from "jsonwebtoken";
import { Request, Response } from "express";

interface DecodedToken {
  _id: string;
  email: string;
  role: string;
}

export const getUserFromToken = (
  req: Request,
  res: Response
): DecodedToken | null => {
  try {
      
      const token = req.cookies.access_token;
      if (!token) {
          res.status(401).json({ message: "Unauthorized: No token provided" });
          return null;
        }
        console.log('bfhtbvdgfdcx');

    const secretKey = process.env.ACCESS_TOKEN_SECRET as string;
    const decoded = jwt.verify(token, secretKey) as DecodedToken;

    return decoded;
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return null;
  }
};



// // 🛑 Extract JWT from cookies
// if(!req.user){
//   return;
// }
// const token = req.cookies.access_token;
// if (!token) {
//   res.status(401).json({ message: "Unauthorized: No token provided" });
//   return;
// }

// // 🛑 Verify JWT
// const secretKey = process.env.ACCESS_TOKEN_SECRET as string;
// const decoded = jwt.verify(token, secretKey) as {
//   _id: string;
//   email: string;
//   role: string;
// };
// const _id = decoded._id;
