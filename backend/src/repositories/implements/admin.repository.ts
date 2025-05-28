import { IUserModel } from "@/models/interface/user.model.interface";
import { IAdminRepository } from "../interface/admin.repository.interface";
import { User } from "@/models/implements/user.model";
import { BaseRepository } from "../base.repository";
import { UserRole } from "@/types/user.type";

export class AdminRepository extends BaseRepository<IUserModel> implements IAdminRepository {
    constructor(){
        super(User);
    }

    async findAllUsers(role: UserRole): Promise<IUserModel[]> {
        return await super.find({ role });
    }

}