import { Router } from "express";
import { login, signUp } from "../controllers/authController";

const router = Router()


// router.post("/login", AuthController.login);
router.post("/login", login);


// router.post("/signup",AuthController.SignUp)
router.post("/signup", signUp);



export default router;
