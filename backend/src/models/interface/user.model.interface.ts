import { UserRole, UserStatus } from "@/types/user.type";
import { Document } from "mongoose";

export interface IUserModel extends Document {
    userName: string;
    userEmail: string;
    name: string;
    password: string;
    isActive: boolean;
    isDeleted: boolean;
    isVerified: UserStatus;
    tutorDetails?:{
        qualification?: string;
        experience?: number;
        expertise?: string;
        about?: string;
        resume?: string;
        rejectReason?: string;
    }
    studentDetails?:{
        qualification?: string;
        about?: string;
        expertise?: string;
    }
    profileImage?: string;
    rating?: number;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    wishlist: string[];
    onlineStatus: boolean;
    lastSeen: Date;
}