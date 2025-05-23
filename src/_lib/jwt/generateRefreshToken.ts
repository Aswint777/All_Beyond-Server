import { env_variables } from "../../_boot/config";
import { payLoad } from "./IuserPayLoads";
import jwt from "jsonwebtoken";

export const generateRefreshToken = (payload: payLoad) => {
  return jwt.sign(payload, String(env_variables.REFRESH_TOKEN_SECRET), {
    expiresIn: "15d",
  });
};
