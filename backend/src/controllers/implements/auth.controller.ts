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
            console.log(err);
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

    forgotPassword = async (req:Request, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const {email} = req.body;
            const {message} = await this._authService.forgotPassword(email);
            res.status(HttpStatus.OK).json({message});
        } catch (err) {
            next(err);
        }
    }

    resetPassword = async (req:Request, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const {token,password} = req.body;
            const {message} = await this._authService.resetPassword(token,password);
            res.status(HttpStatus.OK).json({message});
        } catch (err) {
            next(err);
        }
    }

    googleSignin = async (req:Request, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const {token} = req.body;
            const {user,accessToken,refreshToken} = await this._authService.googleSignin(token);
            setCookie(res,refreshToken);
            res.status(HttpStatus.OK).json({user,accessToken});
        } catch (err) {
            next(err);
        }
    }
    refreshAccessToken = async (req:Request, res:Response, next:NextFunction):Promise<void> =>{
        try {
            console.log('reached- refresh');
            console.log(req.cookies);
            const {accessToken,refreshToken} = await this._authService.refreshAccessToken(req.cookies?.refreshToken);
            setCookie(res,refreshToken);
            res.status(HttpStatus.OK).json({accessToken});
        } catch (err) {
            next(err);
        }
    }
    
}