import { IFeedbackModel } from "@/models/interface/feedback.model.interface";
import { model, Schema } from "mongoose";

const feedbackSchema = new Schema({
    userName: String,
    userEmail: String,
    interviewId:{
        type: Schema.Types.ObjectId,
        ref: 'Interview',
        required: true
    },
    feedback: {
        rating: {
            technicalSkills: Number,
            communication: Number,
            problemSolving: Number,
            experience: Number
        },
        summary: String,
        recommendation: String,
        recommendationMsg: String
    },
    recommendation: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export const Feedback = model<IFeedbackModel>('Feedback', feedbackSchema);