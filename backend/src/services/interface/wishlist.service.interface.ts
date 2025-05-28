import { ICourse } from "@/types/course.type";

export interface IWishlistService {
    addToWishlist(userId: string, courseId: string): Promise<void>;
    removeFromWishlist(userId: string, courseId: string): Promise<void>;
    getWishlist(userId: string): Promise<ICourse[]>;
}