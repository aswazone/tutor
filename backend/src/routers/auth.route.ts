import { authController } from "@/dependencies/auth.di";
import { Router } from "express";


const authRouter = Router();

authRouter.post("/signin", authController.signin);
authRouter.post("/signup", authController.signup);
authRouter.post("/verify-otp", authController.verifyOtp);
authRouter.post("/google-signin", authController.googleSignin);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password", authController.resetPassword);
authRouter.post("/refresh-token", authController.refreshAccessToken);
// authRouter.get('/check-auth', authMiddleware, (req:AuthenticatedRequest,res:Response ,next:NextFunction)=>{
//     try {
//         const user = req.user;
//         res.status(200).json({ success : true, message : 'Authenticated user !' , user});
//     } catch (error) {
//         next(error);
//     }
// })


export default authRouter;