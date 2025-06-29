import { IUserModel } from "@/models/interface/user.model.interface";
import { UserRole, UserStatus } from "@/types/user.type";

export interface IAuthService {
    tutorVerify({userId,status,tutorDetails}: {userId:string,status:UserStatus,tutorDetails?:Partial<IUserModel>['tutorDetails']}): Promise<{ message: string}>
    getUserById(id: string): Promise<IUserModel | null>;
    signin(data:{role:UserRole,userEmail:string,password:string}): Promise<{user:Partial<IUserModel>,accessToken:string,refreshToken:string}>;
    signup(data: Partial<IUserModel>): Promise<{userEmail:string}>;
    verifyOtp(data:{otp:string,email:string}): Promise<{user:Partial<IUserModel>,accessToken:string,refreshToken:string}>;
    resendOtp(email:string): Promise<{message:string}>;
    forgotPassword(email:string): Promise<{message:string}>;
    resetPassword(token:string,password:string): Promise<{message:string}>;
    googleSignin(token:string): Promise<{user:Partial<IUserModel>,accessToken:string,refreshToken:string}>;
    refreshAccessToken(token:string): Promise<{accessToken:string,refreshToken:string}>
    checkUserBlocked(userId:string): Promise<{message:string}>
}