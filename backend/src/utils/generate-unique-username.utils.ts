import { UserRepository } from "@/repositories/implements/user.repository";

const userReposiory = new UserRepository();

export const generateUniqueUsername = async (userName: string): string => {
    const baseUserName = userName.trim().toLowerCase().replace(/\s+/g, '_');

    let newUserName = baseUserName;
    
    while (await userReposiory.findByEmail(newUserName)) {
        const counter = Math.floor(Math.random() * 100);
        newUserName = `${baseUserName}${counter}`;
    }

    return newUserName;
};