import { IUserModel } from "@/models/interface/user.model.interface";
import { FindUsersForAdminResult } from "@/types/admin.type";
import { UserRole } from "@/types/user.type";

export interface IAdminRepository {
    findAllUsers(role: UserRole): Promise<IUserModel[]>
    findTutorsForAdmin(page: number, limit: number,search: string, tab: string): Promise<FindUsersForAdminResult>
    findStudentsForAdmin(page: number, limit: number,search: string): Promise<FindUsersForAdminResult>
}