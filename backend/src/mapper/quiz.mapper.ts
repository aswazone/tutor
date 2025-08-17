import { IQuizModel } from "@/models/interface/quiz.model.interface";

export interface IQuizDTO {
    _id: string;
    courseId: string;
    questions: {
        questionText: string;
        options: {
            text: string;
            isCorrect: boolean;
        }[];
    }[];
    createdAt: Date;
}

export const toQuizDTO = (quiz: IQuizModel): IQuizDTO => {
    return {
        _id: (quiz._id as string).toString(),
        courseId: quiz.courseId,
        questions: quiz.questions.map((question) => ({
            questionText: question.questionText,
            options: question.options.map((option) => ({
                text: option.text,
                isCorrect: option.isCorrect,
            })),
        })),
        createdAt: new Date(quiz.createdAt),
    };
}

export const toQuizDTOs = (quizzes: IQuizModel[]): IQuizDTO[] => quizzes.map(toQuizDTO);