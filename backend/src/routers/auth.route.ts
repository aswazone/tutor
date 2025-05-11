import { authController } from "@/dependencies/auth.di";
import { Router } from "express";


const authRouter = Router();

authRouter.post("/signin", authController.signin);
authRouter.post("/signup", authController.signup);
authRouter.post("/verify-otp", authController.verifyOtp);
authRouter.post("/refresh-token", authController.refreshAccessToken);


export default authRouter;