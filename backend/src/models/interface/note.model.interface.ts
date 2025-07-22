import { Document } from "mongoose";

export interface INoteModel extends Document {
    _id: string;
    userId: string;
    courseId: string;
    chapterId: string;
    timestamp: number;
    text: string;
    createdAt: Date;
    updatedAt: Date
}