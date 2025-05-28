import { IUserModel } from "@/models/interface/user.model.interface";
import { IUserRepository } from "../interface/user.repository.interface";
import { BaseRepository } from "../base.repository";
import { User } from "@/models/implements/user.model";
import { UpdateQuery } from "mongoose";
import { UserRole } from "@/types/user.type";

export class UserRepository extends BaseRepository<IUserModel> implements IUserRepository {
    constructor() {
        super(User);
    }
    async findAllUsers(role: UserRole): Promise<IUserModel[]> {
        return await super.find({ role });
    }
    
    async createUser(data: Partial<IUserModel>): Promise<IUserModel> {
        return await super.create(data);
    }

    async findUserById(id: string): Promise<IUserModel | null> {
        return await super.findById(id)
    }

    async findUserByEmail(email:string): Promise<IUserModel | null> {
        return await super.findOne({ userEmail: email });
    }
    async findOneByEmailOrUsername(identifier: string): Promise<IUserModel | null> {
        return await super.findOne({ $or: [{ userEmail: identifier }, { userName: identifier }] });
    }  
    
    async updatePassword(email: string, hashedPassword: string): Promise<IUserModel | null> {
        return super.findOneAndUpdate({ userEmail: email }, { $set: { password: hashedPassword } });
    }
    
    async findByIdAndUpdate(id: string, update: UpdateQuery<IUserModel>, options?: { new: boolean; }): Promise<IUserModel | null> {
        return super.findByIdAndUpdate(id, update, options);
    }

    async findByIdAndPopulateWishlist(id: string): Promise<IUserModel | null> {
        return this.model.findById(id).populate({
            path: 'wishlist',
            select: 'title description thumbnail price modules rating',
            match: { isDeleted: false }
        });
    }
}