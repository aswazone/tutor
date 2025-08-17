import { IQuizDTO } from "@/mapper/quiz.mapper";
import { IQuizModel } from "@/models/interface/quiz.model.interface";

export interface IQuizService {
    getQuizzes: (tutorId: string, page: number, limit: number) => Promise<{ data: IQuizDTO[]; total: number }>;
    getQuiz: (id: string) => Promise<IQuizDTO>;
    createQuiz: (quiz: Partial<IQuizModel>) => Promise<{ success: boolean; message: string }>;
    updateQuiz: (id: string, quiz: Partial<IQuizModel>) => Promise<{ success: boolean; message: string }>;
    deleteQuiz: (id: string) => Promise<{ success: boolean; message: string }>;
}