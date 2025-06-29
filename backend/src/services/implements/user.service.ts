import { IUserRepository } from "@/repositories/interface/user.repository.interface";
import { IAuthService } from "../interface/user.service.inteface";
import { IUserModel } from "@/models/interface/user.model.interface";
import { createHttpError } from "@/utils/http-error.utils";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { generateOtp } from "@/utils/otp-generate.utils";
import { sendOtpEmail, sendResetPasswordEmail } from "@/utils/send-email.utils";
import { redisClient } from "@/config/redis.config";
import { generateUniqueUsername } from "@/utils/generate-unique-username.utils";
import {generateAccessToken,generateRefreshToken, verifyRefreshToken} from "@/utils";
import { comparePassword, hashPassword } from "@/utils/bcrypt.utils";
import { JwtPayload } from "jsonwebtoken";
import { UserRole, UserStatus } from "@/types/user.type";
import fetchGoogleUser from "@/utils/google-auth";
import { generateNanoId } from "@/utils/generate-nanoid";

export class AuthService implements IAuthService {
    constructor(private readonly _userRepository:IUserRepository) {}

    signin = async ({role,userEmail,password}: {role:UserRole,userEmail:string,password:string})=> {

        const user = await this._userRepository.findOneByEmailOrUsername(userEmail);
        if(!user) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);

        if(!user.isActive) throw createHttpError(HttpStatus.FORBIDDEN, HttpResponse.USER_BLOCKED);

        if (user.role !== role) {
            throw createHttpError(
                HttpStatus.UNAUTHORIZED, 
                `This email is registered as a ${(user.role).toUpperCase()}. Please login with correct role.`
            );
        }

        const isMatch = await comparePassword(password,user?.password);
        if(!isMatch) throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.PASSWORD_INCORRECT);
        

        const payload = { id: user._id, role: user.role, userName: user.userName, userEmail: user.userEmail };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return {user:user,accessToken,refreshToken};
    }

    signup = async (user: IUserModel): Promise<{userEmail:string}> => {

        const existingUser = await this._userRepository.findUserByEmail(user.userEmail);
        if(existingUser) throw createHttpError(HttpStatus.CONFLICT, HttpResponse.USER_EXIST);
        
        
        const otp = generateOtp();
        await sendOtpEmail(user.userEmail,otp);
        console.log(otp);


        const response = await redisClient.setEx(
            user.userEmail,
            300,
            JSON.stringify({
                ...user,
                otp,
            })
        );

        
        if(!response) throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.SERVER_ERROR);


        return {userEmail:user.userEmail};
    }

    verifyOtp = async ({otp,email}: {otp:string,email:string})=> {
        
        const storedDataJSONString = await redisClient.get(email);
        console.log(storedDataJSONString);

        if(!storedDataJSONString) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.OTP_NOT_FOUND);
        const storedData = JSON.parse(storedDataJSONString);
        if(storedData.otp !== otp) throw createHttpError(HttpStatus.BAD_REQUEST, HttpResponse.OTP_INCORRECT);

        const uniqueUsername = await generateUniqueUsername(storedData.userName);
        const hashedPassword = await hashPassword(storedData.password);


        const user = {
            userName:uniqueUsername,
            name:storedData.userName,
            userEmail:storedData.userEmail,
            password:hashedPassword,
            role:storedData.role,
        }

        console.log(user);

        const newUser = await this._userRepository.createUser(user);
        if(!newUser) throw createHttpError(HttpStatus.CONFLICT, HttpResponse.USER_CREATION_FAILED);

        await redisClient.del(email);

        const payload = { id: newUser._id, role: newUser.role, userName: newUser.userName, userEmail: newUser.userEmail };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        
        return {user:newUser,accessToken,refreshToken};
    }

    resendOtp = async (email: string) => {
        
        const otp = generateOtp();
        await sendOtpEmail(email, otp);
        console.log(otp,email,'---resend');
    
        const storedDataJSONString = await redisClient.get(email);
        if (!storedDataJSONString) {
            throw createHttpError(HttpStatus.NOT_FOUND, "No OTP session found for this email.");
        }
        const storedData = JSON.parse(storedDataJSONString);
        console.log(storedData);
    
        storedData.otp = otp;
    

        const response = await redisClient.setEx(
            email,
            300,
            JSON.stringify(storedData)
        );
        
        console.log(response,'--res-redis');

        if(!response) throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.SERVER_ERROR);

        return { status: HttpStatus.OK, message: 'Otp resent successfully' };
    }

    forgotPassword = async (email:string)=> {

        const userExist = await this._userRepository.findUserByEmail(email);
        if(!userExist) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
        if(!userExist.isActive) throw createHttpError(HttpStatus.FORBIDDEN, HttpResponse.USER_BLOCKED);

        const token = generateNanoId();
        const storedData = await redisClient.setEx(token, 300, userExist.userEmail);

        if(!storedData) throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.SERVER_ERROR);
        await sendResetPasswordEmail(userExist.userEmail,token);


        return {status:HttpStatus.OK,message:HttpResponse.RESET_PASS_LINK};
    }

    resetPassword = async (token:string,password:string)=> {

        const storedEmail = await redisClient.get(token);
        if(!storedEmail) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.TOKEN_EXPIRED);
        
        const hashedPassword = await hashPassword(password);

        const userExist = await this._userRepository.findUserByEmail(storedEmail);
        if(!userExist) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
        if(!userExist.isActive) throw createHttpError(HttpStatus.FORBIDDEN, HttpResponse.USER_BLOCKED);

        const updatedUser = await this._userRepository.updatePassword(storedEmail,hashedPassword);
        if(!updatedUser) throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR, HttpResponse.SERVER_ERROR);

        await redisClient.del(token);

        return {status:HttpStatus.OK,message:HttpResponse.PASSWORD_CHANGE_SUCCESS};
    }

    refreshAccessToken = async (token:string): Promise<{accessToken:string, refreshToken:string}> => {

        if(!token) throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.NO_TOKEN); 
        const decoded = await verifyRefreshToken(token) as JwtPayload;
        if(!decoded) throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.TOKEN_EXPIRED);
        
        const payload = { id: decoded.id, role: decoded.role, userName: decoded.userName, userEmail: decoded.userEmail };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        
        return {accessToken,refreshToken};
    }

    googleSignin = async (token:string) => {

        const  googleUser = await fetchGoogleUser(token);
        if(!googleUser) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.INVALID_CREDENTIALS);

        console.log('googleUser details:',JSON.stringify(googleUser));

        const userExist = await this._userRepository.findUserByEmail(googleUser.email);
        if(userExist) {
            if(!userExist.isActive) throw createHttpError(HttpStatus.FORBIDDEN, HttpResponse.USER_BLOCKED);
            const payload = { id: userExist._id, role: userExist.role, userName: userExist.userName, userEmail: userExist.userEmail };
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);
        
            return {user:userExist,accessToken,refreshToken};
        }

        const uniqueUsername = await generateUniqueUsername(googleUser.name);
        
        const user = {
            userName:uniqueUsername,
            name:googleUser.given_name,
            userEmail:googleUser.email,
            role:UserRole.STUDENT,
            password: 'itsdummypassword',
        }

        const createdUser = await this._userRepository.createUser(user as IUserModel);
        if(!createdUser) throw createHttpError(HttpStatus.CONFLICT, HttpResponse.USER_CREATION_FAILED);

        const payload = { id: createdUser._id, role: createdUser.role, userName: createdUser.userName, userEmail: createdUser.userEmail };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        
        return {user:createdUser,accessToken,refreshToken};
    }

    checkUserBlocked = async (userId:string) => {

        const user = await this._userRepository.findUserById(userId);
        if(!user) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
        if(!user.isActive) throw createHttpError(HttpStatus.FORBIDDEN, HttpResponse.USER_BLOCKED);
        return {message:HttpResponse.USER_ACTIVE};
        
    }

    getUserById(id: string): Promise<IUserModel | null> {
        return this._userRepository.findUserById(id);
    }    
    tutorVerify = async ({ userId, status, tutorDetails }: { userId: string; status: UserStatus; tutorDetails?: Partial<IUserModel['tutorDetails']> }) => {
        console.log(userId, status, tutorDetails, 'user service');
        
        if(userId && status ){
            const user = await this._userRepository.findUserById(userId);
            if(!user) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);

            let update: Partial<IUserModel> = {};

            if(status === 'pending') {
                update = {
                    role: user.role === UserRole.STUDENT ? UserRole.TUTOR : user.role,
                    isVerified: status,
                    tutorDetails: tutorDetails ? {
                        qualification: tutorDetails.qualification || '',
                        experience: Number(tutorDetails.experience) || 0,
                        expertise: tutorDetails.expertise || '',
                        about: tutorDetails.about || '',
                        resume: tutorDetails.resume || '',
                        rejectReason: tutorDetails.rejectReason || ''
                    } : undefined
                };
            }else if(status === 'rejected') {
                update = { 
                    isVerified: status,
                    tutorDetails: user.tutorDetails && tutorDetails ? {
                        qualification: user.tutorDetails.qualification || '',
                        experience: Number(user.tutorDetails.experience) || 0,
                        expertise: user.tutorDetails.expertise || '',
                        about: user.tutorDetails.about || '',
                        resume: user.tutorDetails.resume || '',
                        rejectReason: tutorDetails.rejectReason || ''
                    } : undefined
                };
            }else{
                update = { 
                    isVerified: status,
                    tutorDetails: user.tutorDetails ? {
                        qualification: user.tutorDetails.qualification || '',
                        experience: Number(user.tutorDetails.experience) || 0,
                        expertise: user.tutorDetails.expertise || '',
                        about: user.tutorDetails.about || '',
                        resume: user.tutorDetails.resume || '',
                        rejectReason: user.tutorDetails.rejectReason || ''
                    } : undefined
                };
            }

            console.log(update,'update');
            
            const newUser = await this._userRepository.updateUser(userId, update);
            console.log(newUser,'newUser');    

            if(!newUser) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
            return { message: HttpResponse.RESOURCE_UPDATED };
        }

        return { message:'no change' };
    }

}