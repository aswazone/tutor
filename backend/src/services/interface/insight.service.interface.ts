import { ICourseInsights } from "@/types/course.type";

export interface IInsightService {
    getSingleCourseInsights: (tutorId: string, courseId: string) => Promise<ICourseInsights>
    getTutorDashboardInsights: (tutorId: string) => Promise<{noOfCourses: number, enrolledStudents: number, tutorRating: number}>
    getStudentDashboardInsights: (studentId: string) => Promise<{enrolled: number, wishlist: number, completed: number}>
}