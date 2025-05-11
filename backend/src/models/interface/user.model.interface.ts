import { UserRole } from "@/types/user.type";
import { Document } from "mongoose";

export interface UserModelIF extends Document {
    userName: string;
    userEmail: string;
    name: string;
    password: string;
    role: UserRole;
}