import { IUserModel } from "@/models/interface/user.model.interface";
import { UserRole } from "@/types/user.type";

export interface IAuthService {
    signin(data:{role:UserRole,userEmail:string,password:string}): Promise<{user:Partial<IUserModel>,accessToken:string,refreshToken:string}>;
    signup(data: Partial<IUserModel>): Promise<{userEmail:string}>;
    verifyOtp(data:{otp:string,email:string}): Promise<{user:Partial<IUserModel>,accessToken:string,refreshToken:string}>;
    forgotPassword(email:string): Promise<{message:string}>;
    resetPassword(token:string,password:string): Promise<{message:string}>;
    googleSignin(token:string): Promise<{user:Partial<IUserModel>,accessToken:string,refreshToken:string}>;
    refreshAccessToken(token:string): Promise<{accessToken:string,refreshToken:string}>
    checkUserBlocked(userId:string): Promise<{message:string}>
}