import { IAuthService } from "@/services/interface/user.service.inteface";
import { IAuthController } from "../interfaces/auth.controller.interface";
import { Request, Response, NextFunction} from "express";
import { HttpStatus } from "@/constants/status.constant";
import { setCookie } from "@/utils/cookies.utils";
import { AuthenticatedRequest } from "@/types/auth.type";
import { UserStatus } from "@/types/user.type";

export class AuthController implements IAuthController{
    constructor(
        private readonly _authService:IAuthService
    ) {}

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

    resendOtp = async (req:Request, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const result = await this._authService.resendOtp(req.body.email);
            res.status(HttpStatus.CREATED).json(result);
        } catch (err) {
            next(err);
        }
    }

    updatePassword = async (req:AuthenticatedRequest, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const userId = req.user?.id;
            const {currentPassword,newPassword} = req.body;

            const response = await this._authService.updatePassword(userId as string,currentPassword,newPassword);
            res.status(HttpStatus.OK).json(response);
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

    checkUserBlocked = async (req:AuthenticatedRequest, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const userId = req.user?.id;
            const {message} = await this._authService.checkUserBlocked(userId as string);
            res.status(HttpStatus.OK).json({message});
        } catch (err) {
            next(err);
        }
    }

    getUser = async (req:AuthenticatedRequest, res:Response, next:NextFunction):Promise<void> =>{
        try {
            let { id } = req.query;
            const userId = req.user?.id;

            if (id === 'null' || id === 'undefined' || !id) {
                id = undefined;
            }

            const isCurrentUser = userId === id || !id;
            const lastId = id !== undefined ? id : userId;
            
            if (!lastId) {
                // No valid user id available
                res.status(HttpStatus.BAD_REQUEST).json({ error: "User ID is required" });
                return;
            }


            console.log({ id, userId, lastId, isCurrentUser });

            const user = await this._authService.getUserById(lastId as string);
            res.status(HttpStatus.OK).json({ user, isCurrentUser });
        } catch (err) {
            next(err);
        }
    }

    tutorVerify = async (req:AuthenticatedRequest, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const extraData = req.body;
            console.log(extraData);
            const {message} = await this._authService.tutorVerify({userId:req.params.tutorId,status:req.params.status as UserStatus                         ,tutorDetails:{...extraData}});
            res.status(HttpStatus.OK).json({message});
        } catch (err) {
            next(err);
        }
    }

    profileContentUpdate = async (req:AuthenticatedRequest, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const userId = req.user?.id;
            const {message} = await this._authService.profileContentUpdate(userId as string,req.body);
            res.status(HttpStatus.OK).json({message});
        } catch (err) {
            next(err);
        }
    }

    profileImageUpdate = async (req:AuthenticatedRequest, res:Response, next:NextFunction):Promise<void> =>{
        try {
            const userId = req.user?.id;
            const {message} = await this._authService.profileImageUpdate(userId as string,req.body.profileImage);
            res.status(HttpStatus.OK).json({message});
        } catch (err) {
            next(err);
        }
    }
    
}