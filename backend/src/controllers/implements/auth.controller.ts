import { AuthServiceIF } from "@/services/interface/user.service.inteface";
import { AuthControllerIF } from "../interfaces/auth.controller.interface";
import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "@/constants/status.constant";
import { setCookie } from "@/utils/cookies.utils";

export class AuthController implements AuthControllerIF {
    constructor(private readonly _authService:AuthServiceIF) {}

    signin = async (req:Request, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const {user,accessToken,refreshToken} = await this._authService.signin(req.body);
            setCookie(res,refreshToken);
            res.status(HttpStatus.OK).json({user,accessToken});
        } catch (err) {
            next(err);
        }
    }

    signup = async (req:Request, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const user = await this._authService.signup(req.body);
            res.status(HttpStatus.OK).json(user);
        } catch (err) {
            next(err);
        }
    }

    verifyOtp = async (req:Request, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const {user,accessToken,refreshToken} = await this._authService.verifyOtp(req.body);
            setCookie(res,refreshToken);
            res.status(HttpStatus.CREATED).json({user,accessToken});
        } catch (err) {
            next(err);
        }
    }

    refreshAccessToken = async (req:Request, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const {accessToken,refreshToken} = await this._authService.refreshAccessToken(req.cookies?.refreshToken);
            setCookie(res,refreshToken);
            res.status(HttpStatus.OK).json({accessToken});
        } catch (err) {
            next(err);
        }
    }
    
}