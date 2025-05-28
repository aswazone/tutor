import { IUserModel } from "@/models/interface/user.model.interface";
import { UserRole } from "@/types/user.type";

export interface IAdminRepository {
    findAllUsers(role: UserRole): Promise<IUserModel[]>
}