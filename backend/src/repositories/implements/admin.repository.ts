import { IUserModel } from "@/models/interface/user.model.interface";
import { IAdminRepository } from "../interface/admin.repository.interface";
import { User } from "@/models/implements/user.model";
import { BaseRepository } from "../base.repository";
import { UserRole } from "@/types/user.type";
import { FindUsersForAdminResult } from "@/types/admin.type";
import { FilterQuery } from "mongoose";
import { HttpError } from "@/utils/http-error.utils";
import { HttpStatus } from "@/constants/status.constant";

export class AdminRepository extends BaseRepository<IUserModel> implements IAdminRepository {
    constructor(){
        super(User);
    }

    async findAllUsers(role: UserRole): Promise<IUserModel[]> {
        return await super.find({ role });
    }

    async findTutorsForAdmin(page: number, limit: number,search: string, tab: string): Promise<FindUsersForAdminResult> {
        const filter: FilterQuery<IUserModel> = { role: UserRole.TUTOR};

        if(tab === 'approved'){
            filter.isVerified = 'verified';
        } else {
            filter.isVerified = { $ne: 'verified' };
        }

        if (search) {
            filter.$or = [
                { userName: { $regex: search, $options: 'i' } },
                { userEmail: { $regex: search, $options: 'i' } },
            ];
        }
        try {
            const data: IUserModel[] = await this.model.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
            const total: number = await this.model.countDocuments(filter);

            return {data, total};
        } catch (error) {
            if (error instanceof HttpError) throw error;
            throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch users');
        }
    }

    async findStudentsForAdmin(page: number, limit: number,search: string): Promise<FindUsersForAdminResult> {
        const filter: FilterQuery<IUserModel> = { role: UserRole.STUDENT};
        if (search) {
            filter.$or = [
                { userName: { $regex: search, $options: 'i' } },
                { userEmail: { $regex: search, $options: 'i' } },
            ];
        }
        try {
            const data: IUserModel[] = await this.model.find(filter).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
            const total: number = await this.model.countDocuments(filter);
            return {data, total};
        } catch (error) {
            if (error instanceof HttpError) throw error;
            throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch users');
        }
    }
}