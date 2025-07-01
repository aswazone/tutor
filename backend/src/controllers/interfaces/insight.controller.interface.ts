
export interface IInsightController {
    getSingleCourseInsights: (tutorId: string, courseId: string) => Promise<void>
    getTutorDashboardInsights: (tutorId: string) => Promise<void>
}