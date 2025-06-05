import { IStudentCoursesModel } from "@/models/interface/studentCourses.model.interface";
import { Schema, model } from "mongoose";


const StudentCoursesSchema = new Schema({
    studentId: String,
    courses:[
        {
            courseId: String,
            title: String,
            tutorId: String,
            tutorName: String,
            dateOfPurchase: Date,
            courseImage: String
        }
    ]
},{timestamps: true});

export const StudentCourses = model<IStudentCoursesModel>("StudentCourses", StudentCoursesSchema);