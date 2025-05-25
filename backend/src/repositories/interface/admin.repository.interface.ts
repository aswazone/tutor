import { UserModelIF } from "@/models/interface/user.model.interface";
import { UserRole } from "@/types/user.type";

export interface AdminRepositoryIF {
    findAll(role: UserRole): Promise<UserModelIF[]>
}