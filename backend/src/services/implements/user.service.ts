import { UserRepositoryIF } from "@/repositories/interface/user.repository.interface";
import { AuthServiceIF } from "../interface/user.service.inteface";
import { UserModelIF } from "@/models/interface/user.model.interface";
import { createHttpError } from "@/utils/http-error.utils";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { generateOtp } from "@/utils/otp-generate.utils";
import { sendOtpEmail } from "@/utils/send-email.utils";
import { redisClient } from "@/config/redis.config";
import { generateUniqueUsername } from "@/utils/generate-unique-username.utils";
import {generateAccessToken,generateRefreshToken, verifyRefreshToken} from "@/utils";
import { comparePassword, hashPassword } from "@/utils/bcrypt.utils";
import { JwtPayload } from "jsonwebtoken";
import { UserRole } from "@/types/user.type";

export class AuthService implements AuthServiceIF {
    constructor(private readonly _userRepository:UserRepositoryIF) {}

    signin = async ({role,userEmail,password}: {role:UserRole,userEmail:string,password:string})=> {

        const user = await this._userRepository.findOneByEmailOrUsername(userEmail);
        if(!user) throw createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);

        if (user.role !== role) {
            throw createHttpError(
                HttpStatus.UNAUTHORIZED, 
                `This email is registered as a '${(user.role).toUpperCase()}'. Please login with correct role.`
            );
        }

        const isMatch = await comparePassword(password,user?.password);
        if(!isMatch) throw createHttpError(HttpStatus.UNAUTHORIZED, HttpResponse.PASSWORD_INCORRECT);
        

        const payload = { id: user._id, role: user.role, userName: user.userName, userEmail: user.userEmail };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        return {user:payload,accessToken,refreshToken};
    }

    signup = async (user: UserModelIF): Promise<{userEmail:string}> => {

        const existingUser = await this._userRepository.findByEmail(user.userEmail);
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

        const newUser = await this._userRepository.create(user);
        if(!newUser) throw createHttpError(HttpStatus.CONFLICT, HttpResponse.USER_CREATION_FAILED);

        await redisClient.del(email);

        const payload = { id: newUser._id, role: newUser.role, userName: newUser.userName, userEmail: newUser.userEmail };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        
        return {user:payload,accessToken,refreshToken};
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

}