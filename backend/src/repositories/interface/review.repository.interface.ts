import { IReviewModel } from "@/models/interface/review.model.interface";
import { FindReviewsResult } from "@/types/review.type";

export interface IReviewRepository {
    createReview: (review: Partial<IReviewModel>) => Promise<IReviewModel>;
    deleteReview: (reviewId: string) => Promise<IReviewModel | null>;
    getTutorReviews: (tutorId: string, page: number, limit: number) => Promise<FindReviewsResult>;
    getCourseReviews: (courseId: string, page: number, limit: number) => Promise<FindReviewsResult>;
}