import { Router } from "express";
import { login } from "../controllers/authController";
import { dependencies } from "../../_boot/dependency/authDependencies";
import { IDependencies } from "../../application/interfaces/IDependencies";
import { controller } from "../controllers";

export const routers = (dependencies:IDependencies) => {
    const { signUp } = controller(dependencies)
    const router = Router()

// router.post("/login", AuthController.login); 
    // router.post("/login", login);


// router.post("/signup",AuthController.SignUp)
    router.route("/signup").post(signUp);

    return router;
}

