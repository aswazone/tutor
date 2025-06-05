import { StudentCourses } from "@/schema/studentCourses.schema";
import { IStudentCoursesModel } from "../interface/studentCourses.model.interface";
import { Model } from "mongoose";

export const StudentCoursesModel :Model<IStudentCoursesModel> = StudentCourses;