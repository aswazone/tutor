import { IReviewModel } from "@/models/interface/review.model.interface";

export interface IReviewDTO {
    reviewerId: string;
    reviewType: string;
    relatedId: string;
    rating: number;
    review: string;
    createdDate: string;
}


export const toReviewDTO = (review: IReviewModel): IReviewDTO => {
    return {
        reviewerId: review.reviewerId,
        reviewType: review.reviewType.toString(),
        relatedId: review.relatedId.toString(),
        rating: review.rating,
        review: review.review,
        createdDate: review.createdAt.toISOString(),
    }
}

export const toReviewDTOs = (reviews: IReviewModel[]): IReviewDTO[] => reviews.map(toReviewDTO);