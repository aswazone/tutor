import { Model } from "mongoose";
import { IReviewModel } from "../interface/review.model.interface";
import { Review } from "@/schema/review.schema";

export const ReviewModel:Model<IReviewModel> = Review;