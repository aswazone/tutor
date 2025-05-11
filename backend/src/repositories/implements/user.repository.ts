import { UserModelIF } from "@/models/interface/user.model.interface";
import { UserRepositoryIF } from "../interface/user.repository.interface";
import { BaseRepository } from "../base.repository";
import { User } from "@/models/implements/user.model";

export class UserRepository extends BaseRepository<UserModelIF> implements UserRepositoryIF {
    constructor() {
        super(User);
    }
    
    async create(data: Partial<UserModelIF>): Promise<UserModelIF> {
        return await super.create(data);
    }
    async findByEmail(email:string): Promise<UserModelIF | null> {
        return this.findOne({ userEmail: email });
    }
    async findOneByEmailOrUsername(identifier: string): Promise<UserModelIF | null> {
        return this.findOne({ $or: [{ userEmail: identifier }, { userName: identifier }] });
    }
}