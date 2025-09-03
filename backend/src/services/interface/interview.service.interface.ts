import { IInterviewDTO } from "@/mapper/interview.mapper";
import { IFeedbackModel } from "@/models/interface/feedback.model.interface";
import { IInterviewModel } from "@/models/interface/interview.model.interface";
import { InterviewFeedbackResponse, interviewFormData, QuestionResponse } from "@/types/interview.type";
// import { ChatCompletionMessage } from "openai/resources/index";

export interface IInterviewService {
    generateQuestions: (data: interviewFormData) => Promise<QuestionResponse | null>;
    generateFeedback: (data: { role: string; content: string }[]) => Promise<InterviewFeedbackResponse | null>;
    createInterview: (data: IInterviewModel) => Promise<{ success: boolean; message: string; interviewId: string; }>;
    createFeedback: (data: IFeedbackModel) => Promise<{ success: boolean; message: string; }>;
    getInterview: (id: string) => Promise<IInterviewModel | null>;
    getTutorCreatedInterviews: (email: string, page: number, limit: number) => Promise<{ data: IInterviewDTO[]; total: number }>;
    deleteInterview: (id: string) => Promise<{ success: boolean; message: string; }>;
}