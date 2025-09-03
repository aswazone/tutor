import { Document } from "mongoose";

export interface IInterviewModel extends Document {
    domain: string;
    description: string;
    duration: string;
    interviewTypes: string[];
    questions: {
        question: string;
        type: string;
    }[];
    userEmail: string;
    createdAt: Date;
    updatedAt: Date
}