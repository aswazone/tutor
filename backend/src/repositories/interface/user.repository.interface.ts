import { UserModelIF } from "@/models/interface/user.model.interface";

export interface UserRepositoryIF {
    create(data: Partial<UserModelIF>): Promise<UserModelIF>;
    findByEmail(email: string): Promise<UserModelIF | null>;
    findOneByEmailOrUsername(identifier: string): Promise<UserModelIF | null>;
}