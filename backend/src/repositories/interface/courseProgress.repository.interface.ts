import { ICourseProgressModel } from "@/models/interface/courseProgress.model.interface";

// export interface ICourseProgressRepository {
//     getCurrentUserCourseProgress: (userId: string, courseId: string) => Promise<ICourseProgressModel | null>
// }

export interface ICourseProgressRepository {
    getCurrentUserCourseProgress(userId: string, courseId: string): Promise<ICourseProgressModel | null>;
    createProgress(data: Partial<ICourseProgressModel>): Promise<ICourseProgressModel>;
    resetProgress(courseProgressId: string): Promise<void>;
}