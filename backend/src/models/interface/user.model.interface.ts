import { UserRole } from "@/types/user.type";
import { Document } from "mongoose";

export interface IUserModel extends Document {
    userName: string;
    userEmail: string;
    name: string;
    password: string;
    isActive: boolean;
    isDeleted: boolean;
    specialization?: string;
    rating?: number;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    wishlist: string[];
}