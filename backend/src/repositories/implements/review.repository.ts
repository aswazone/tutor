import { IReviewModel } from "@/models/interface/review.model.interface";
import { BaseRepository } from "../base.repository";
import { IReviewRepository } from "../interface/review.repository.interface";
import { ReviewModel } from "@/models/implements/review.model";
import { FilterQuery } from "mongoose";

export class ReviewRepository extends BaseRepository<IReviewModel> implements IReviewRepository {
    constructor() {
        super(ReviewModel);
    }

    async createReview(data: Partial<IReviewModel>) {
        return this.model.create(data);
    }

    async deleteReview(reviewId: string) {
        return this.model.findByIdAndDelete(reviewId);
    }

    async getTutorReviews(tutorId: string, page: number, limit: number) {

        console.log(tutorId, page, limit,'tutorId');

        const filter: FilterQuery<IReviewModel> = { relatedId: tutorId, reviewType: "User" };

        const data: IReviewModel[] = await this.model.find(filter).populate({ path: 'reviewerId', select: 'userName userEmail profileImage' }).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
        const total: number = await this.model.countDocuments(filter);

        console.log(data,'backend-data');

        return { data, total };
    }

    async getCourseReviews(courseId: string, page: number, limit: number) {

        const filter: FilterQuery<IReviewModel> = { relatedId: courseId, reviewType: "Course" };

        const data: IReviewModel[] = await this.model.find(filter).populate({ path: 'reviewerId', select: 'userName userEmail profileImage' }).skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 });
        const total: number = await this.model.countDocuments(filter);

        return { data, total };
    }
}