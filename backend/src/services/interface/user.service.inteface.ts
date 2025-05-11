import { UserModelIF } from "@/models/interface/user.model.interface";
import { UserRole } from "@/types/user.type";

export interface AuthServiceIF {
    signin(data:{role:UserRole,userEmail:string,password:string}): Promise<{user:Partial<UserModelIF>,accessToken:string,refreshToken:string}>;
    signup(data: Partial<UserModelIF>): Promise<{userEmail:string}>;
    verifyOtp(data:{otp:string,email:string}): Promise<{user:Partial<UserModelIF>,accessToken:string,refreshToken:string}>;
    refreshAccessToken(token:string): Promise<{accessToken:string,refreshToken:string}>
}