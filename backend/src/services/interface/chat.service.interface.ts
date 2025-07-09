import { IUserModel } from "@/models/interface/user.model.interface";

export interface IChatService {
    searchContacts: (userId: string, searchTerm: string) => Promise<IUserModel[]>
}