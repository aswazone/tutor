import { Document } from "mongoose";

export interface IStudentCoursesModel extends Document {
    studentId: string;
    courses: {
        courseId: string;
        title: string;
        tutorId: string;
        tutorName: string;
        dateOfPurchase: Date;
        courseImage: string;
    }[];
}