import { IReviewDTO } from "@/mapper/review.mapper";
import { IReviewModel } from "@/models/interface/review.model.interface";

export interface IReviewService {
    getTutorReviews: (tutorId: string, page: number, limit: number) => Promise<{ data: IReviewDTO[]; total: number }>;
    getCourseReviews: (courseId: string, page: number, limit: number) => Promise<{ data: IReviewDTO[]; total: number }>;
    createReview: (data: Partial<IReviewModel>) => Promise<{ success: boolean; message: string }>;
    deleteReview: (reviewId: string) => Promise<{ success: boolean; message: string }>;
}