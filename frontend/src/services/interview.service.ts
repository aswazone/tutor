import axiosInstance from "@/config/axios.config";
import { InterviewFormData } from "@/schemas/interview";
import { InterviewData, InterviewFeedbackData, SavedMessage } from "@/types/interview.type";

class InterviewService {
    generateQuestions = async (data:InterviewFormData) => {
        const response = await axiosInstance.post('/api/v1/interview/generate/questions',data);
        return response.data
    }

    generateFeedback = async (data:SavedMessage[]) => {
        const response = await axiosInstance.post('/api/v1/interview/generate/feedback',data);
        return response.data
    }

    createInterview = async (data:InterviewData) => {
        const response = await axiosInstance.post('/api/v1/interview/create',data);
        return response.data
    }

    createInterviewFeedback = async (data:InterviewFeedbackData) => {
        const response = await axiosInstance.post('/api/v1/interview/feedback/create',data);
        return response.data
    }

    getInterview = async (id:string) => {
        const response = await axiosInstance.get(`/api/v1/interview/${id}`);
        return response.data
    }

    getTutorCreatedInterviews = async (email:string,page=1,limit=3) => {
        const response = await axiosInstance.get(`/api/v1/interview/tutor?email=${email}&page=${page}&limit=${limit}`);
        return response.data
    }

    deleteInterview = async (id:string) => {
        const response = await axiosInstance.delete(`/api/v1/interview/${id}`);
        return response.data
    }
}

export const interviewService = new InterviewService();