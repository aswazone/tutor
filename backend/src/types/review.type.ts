import { IReviewModel } from "@/models/interface/review.model.interface";

export interface FindReviewsResult {
    data: IReviewModel[];
    total: number;
}