import { IQuizModel } from "@/models/interface/quiz.model.interface";

export interface FindQuizzesForTutor {
    data: IQuizModel[];
    total: number;
}