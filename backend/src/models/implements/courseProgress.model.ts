import { Model } from "mongoose";
import { ICourseProgressModel } from "../interface/courseProgress.model.interface";
import { CourseProgress } from "@/schema/courseProgress.schema";

export const CourseProgressModel: Model<ICourseProgressModel> = CourseProgress;
