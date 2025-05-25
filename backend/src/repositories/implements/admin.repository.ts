import { UserModelIF } from "@/models/interface/user.model.interface";
import { AdminRepositoryIF } from "../interface/admin.repository.interface";
import { User } from "@/models/implements/user.model";
import { BaseRepository } from "../base.repository";
import { UserRole } from "@/types/user.type";

export class AdminRepository extends BaseRepository<UserModelIF> implements AdminRepositoryIF {
    constructor(){
        super(User);
    }

    async findAll(role: UserRole): Promise<UserModelIF[]> {
        return await super.find({ role });
    }

}