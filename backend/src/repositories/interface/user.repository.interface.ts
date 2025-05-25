import { UserModelIF } from "@/models/interface/user.model.interface";
import { UpdateQuery } from "mongoose";



export interface UserRepositoryIF {
    create(data: Partial<UserModelIF>): Promise<UserModelIF>;
    findById(id: string): Promise<UserModelIF | null>;
    findByEmail(email: string): Promise<UserModelIF | null>;
    updatePassword(email: string, hashedPassword: string): Promise<UserModelIF | null>;
    findOneByEmailOrUsername(identifier: string): Promise<UserModelIF | null>;
    findByIdAndUpdate(id: string, update: UpdateQuery<UserModelIF>, options?: { new: boolean; }): Promise<UserModelIF | null>;
    findByIdAndPopulateWishlist(id: string): Promise<UserModelIF | null>;
}