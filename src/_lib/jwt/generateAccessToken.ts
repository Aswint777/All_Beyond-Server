import { env_variables } from "../../_boot/config";
import { payLoad } from "./IuserPayLoads";
import jwt from "jsonwebtoken";

export const generateAccessToken = (payload: payLoad) => {
  const { _id, email, role } = payload;
  const newPayload = { _id, email, role };

  return jwt.sign(newPayload, String(env_variables.ACCESS_TOKEN_SECRET), {
    expiresIn: "40m",
  });
};
