import { Document } from "mongoose";

export interface IQuizModel extends Document {
    tutorId: string;
    courseId: string;
    questions:{
        questionText: string;
        options: {
            text: string;
            isCorrect: boolean;
        }[]
    }[];
    createdAt: Date
    updatedAt: Date
}