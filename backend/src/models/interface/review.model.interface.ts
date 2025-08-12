import { Document } from "mongoose";

export interface IReviewModel extends Document {
    reviewerId: string;
    reviewType: string;
    relatedId: string;
    rating: number;
    review: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IReviewPopulatedModel extends Document {
    reviewerId: string;
    reviewType: string;
    relatedId:{
        _id: string;
        userName: string;
        userEmail: string;
        profileImage: string;
    }
    rating: number;
    review: string;
    createdAt: Date;
    updatedAt: Date;
}