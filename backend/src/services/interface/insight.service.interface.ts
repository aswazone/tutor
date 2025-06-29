import { ICourseInsights } from "@/types/course.type";

export interface IInsightService {
    getAllCoursesInsights: (tutorId: string, courseId: string) => Promise<ICourseInsights>
}