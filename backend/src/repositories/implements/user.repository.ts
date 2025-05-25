import { UserModelIF } from "@/models/interface/user.model.interface";
import { UserRepositoryIF } from "../interface/user.repository.interface";
import { BaseRepository } from "../base.repository";
import { User } from "@/models/implements/user.model";
import { UpdateQuery } from "mongoose";
import { UserRole } from "@/types/user.type";

export class UserRepository extends BaseRepository<UserModelIF> implements UserRepositoryIF {
    constructor() {
        super(User);
    }
    async findAll(role: UserRole): Promise<UserModelIF[]> {
        return await super.find({ role });
    }
    
    async create(data: Partial<UserModelIF>): Promise<UserModelIF> {
        return await super.create(data);
    }

    async findById(id: string): Promise<UserModelIF | null> {
        return await super.findById(id)
    }

    async findByEmail(email:string): Promise<UserModelIF | null> {
        return this.findOne({ userEmail: email });
    }
    async findOneByEmailOrUsername(identifier: string): Promise<UserModelIF | null> {
        return this.findOne({ $or: [{ userEmail: identifier }, { userName: identifier }] });
    }  
    
    async updatePassword(email: string, hashedPassword: string): Promise<UserModelIF | null> {
        return super.findOneAndUpdate({ userEmail: email }, { $set: { password: hashedPassword } });
    }
    
    async findByIdAndUpdate(id: string, update: UpdateQuery<UserModelIF>, options?: { new: boolean; }): Promise<UserModelIF | null> {
        return super.findByIdAndUpdate(id, update, options);
    }

    async findByIdAndPopulateWishlist(id: string): Promise<UserModelIF | null> {
        return this.model.findById(id).populate({
            path: 'wishlist',
            select: 'title description thumbnail price modules rating',
            match: { isDeleted: false }
        });
    }
}