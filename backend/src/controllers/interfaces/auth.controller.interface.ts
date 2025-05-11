import { Request, Response, NextFunction } from "express";
export interface AuthControllerIF {
    signin: (req:Request, res:Response, next:NextFunction) => Promise<void>
    signup: (req:Request, res:Response, next:NextFunction) => Promise<void>
    verifyOtp: (req:Request, res:Response, next:NextFunction) => Promise<void>
    refreshAccessToken: (req:Request, res:Response, next:NextFunction) => Promise<void>
}