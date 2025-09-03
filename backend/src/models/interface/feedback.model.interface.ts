import { Document } from "mongoose";

export interface IFeedbackModel extends Document {
    userName: string;
    userEmail: string;
    interviewId: string;
    feedback: {
        rating: {
            technicalSkills: number;
            communication: number;
            problemSolving: number;
            experience: number;
        };
        summary: string;
        recommendation: string;
        recommendationMsg: string;
    };
    recommendation: boolean;
    createdAt: Date;
    updatedAt: Date;
}