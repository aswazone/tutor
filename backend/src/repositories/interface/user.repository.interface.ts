import { IUserModel } from "@/models/interface/user.model.interface";
import { UpdateQuery } from "mongoose";



export interface IUserRepository {
    createUser(data: Partial<IUserModel>): Promise<IUserModel>;
    findUserById(id: string): Promise<IUserModel | null>;
    findUserByEmail(email: string): Promise<IUserModel | null>;
    updatePassword(email: string, hashedPassword: string): Promise<IUserModel | null>;
    findOneByEmailOrUsername(identifier: string): Promise<IUserModel | null>;
    findByIdAndUpdate(id: string, update: UpdateQuery<IUserModel>, options?: { new: boolean; }): Promise<IUserModel | null>;
    findByIdAndPopulateWishlist(id: string): Promise<IUserModel | null>;
}