import axiosInstance from "@/config/axios.config";
import { ICourse } from "@/types/course.type";

class Course {
    async fetchCourses(sort: string, limit: number, page: number) {
        try {
            const response = await axiosInstance.get<{courses:ICourse[] , count: number}>(`/api/v1/courses?sort=${sort}&limit=${limit}&page=${page}`);
            return response.data.courses;
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    }
}

export const courseService = new Course();