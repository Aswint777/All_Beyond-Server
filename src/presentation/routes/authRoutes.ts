import { Router } from "express";
import { login } from "../controllers/authController";
import { dependencies } from "../../_boot/dependency/authDependencies";
import { IDependencies } from "../../application/interfaces/IDependencies";
// import { controller } from "../controllers";
import { otpVerify } from "../../infrastructure/database/model";
import { controller } from "../controllers/commonControllers";

export const routers = (dependencies:IDependencies) => {
    const { signUp,otpVerify,login } = controller(dependencies)
    const router = Router()

    router.route("/signup").post(signUp);

    router.route("/OtpVerify").post(otpVerify)
    router.route("/login").post(login)

    return router;

}

