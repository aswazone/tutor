import { AuthenticatedRequest } from "@/types/auth.type";
import { Request, Response, NextFunction } from "express";
export interface IAuthController {
    getUser: (req:AuthenticatedRequest, res:Response, next:NextFunction) => Promise<void>
    signin: (req:Request, res:Response, next:NextFunction) => Promise<void>
    signup: (req:Request, res:Response, next:NextFunction) => Promise<void>
    verifyOtp: (req:Request, res:Response, next:NextFunction) => Promise<void>
    resendOtp: (req:Request, res:Response, next:NextFunction) => Promise<void>
    forgotPassword: (req:Request, res:Response, next:NextFunction) => Promise<void>
    resetPassword: (req:Request, res:Response, next:NextFunction) => Promise<void>
    googleSignin: (req:Request, res:Response, next:NextFunction) => Promise<void>
    refreshAccessToken: (req:Request, res:Response, next:NextFunction) => Promise<void>
    checkUserBlocked: (req:AuthenticatedRequest, res:Response, next:NextFunction) => Promise<void>
}