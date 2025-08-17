import { IQuizModel } from "@/models/interface/quiz.model.interface";
import { FindQuizzesForTutor } from "@/types/quiz.type";

export interface IQuizRepository {
    getQuizzes: (tutorId: string, page: number, limit: number) => Promise<FindQuizzesForTutor>;
    getQuiz: (id: string) => Promise<IQuizModel | null>;
    createQuiz: (quiz: Partial<IQuizModel>) => Promise<IQuizModel>;
    updateQuiz: (id: string, quiz: Partial<IQuizModel>) => Promise<IQuizModel | null>;
    deleteQuiz: (id: string) => Promise<IQuizModel | null>;
}