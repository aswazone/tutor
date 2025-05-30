import { authController } from "@/dependencies/auth.di";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { Router } from "express";


const authRouter = Router();

authRouter.post("/signin", authController.signin);
authRouter.post("/signup", authController.signup);
authRouter.post("/verify-otp", authController.verifyOtp);
authRouter.post("/google-signin", authController.googleSignin);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password", authController.resetPassword);
authRouter.post("/refresh-token", authController.refreshAccessToken);
authRouter.post("/check-user-blocked", authenticateToken, authController.checkUserBlocked);
authRouter.get("/", authenticateToken, authController.getUser);
authRouter.patch("/tutor-verify/:tutorId/:status", authenticateToken, authController.tutorVerify);


export default authRouter;