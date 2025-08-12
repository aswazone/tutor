import { IReviewModel } from "@/models/interface/review.model.interface";
import { model, Schema, Types } from "mongoose";

const ReviewSchema = new Schema({
    reviewerId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    reviewType: {
        type: String,
        enum: ["Course", "User"],
        required: true,
    },
    relatedId: {
        type: Types.ObjectId,
        refPath: "reviewType", 
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

export const Review = model<IReviewModel>("Review", ReviewSchema);