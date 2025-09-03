import { IInterviewModel } from "@/models/interface/interview.model.interface";
import { model, Schema } from "mongoose";

const InterviewSchema = new Schema({
    domain: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    interviewTypes: {
        type: [String],
        required: true
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        }
    }],
    userEmail: {
        type: String,
        required: true
    }
},{ timestamps: true });


export const Interview = model<IInterviewModel>('Interview', InterviewSchema);