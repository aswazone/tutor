export interface IInsightService {
    getAllCoursesInsights: (tutorId: string, courseId: string) => Promise<void>
}