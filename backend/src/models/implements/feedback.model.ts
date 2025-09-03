import { Model } from "mongoose";
import { IFeedbackModel } from "../interface/feedback.model.interface";
import { Feedback } from "@/schema/feedback.schema";

export const FeedbackModel:Model<IFeedbackModel> = Feedback;