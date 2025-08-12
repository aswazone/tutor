import { IReviewModel } from "@/models/interface/review.model.interface";
import { IReviewService } from "../interface/review.service.interface";
import { IReviewRepository } from "@/repositories/interface/review.repository.interface";
import { toReviewDTOs } from "@/mapper/review.mapper";

export class ReviewService implements IReviewService {

    constructor(
        private readonly _reviewRepository: IReviewRepository
    ){}

    getTutorReviews = async (tutorId: string, page: number, limit: number) => {
        const { data, total } = await this._reviewRepository.getTutorReviews(tutorId, page, limit);
        return { data: toReviewDTOs(data), total };
    }

    getCourseReviews = async (courseId: string, page: number, limit: number) => {
        const { data, total } = await this._reviewRepository.getCourseReviews(courseId, page, limit);
        return { data: toReviewDTOs(data), total };
    }

    createReview = async (data: Partial<IReviewModel>) => {
        await this._reviewRepository.createReview(data);
        return { success: true, message: "Review created successfully" };
    }

    deleteReview = async (reviewId: string) => {
        await this._reviewRepository.deleteReview(reviewId);
        return { success: true, message: "Review deleted successfully" };
    }

}