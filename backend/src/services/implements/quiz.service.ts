import { IQuizRepository } from "@/repositories/interface/quiz.repository.interface";
import { IQuizService } from "../interface/quiz.service.interface";
import { IQuizModel } from "@/models/interface/quiz.model.interface";
import { toQuizDTO, toQuizDTOs } from "@/mapper/quiz.mapper";
import { ICourseRepository } from "@/repositories/interface/course.repository.interface";

export class QuizService implements IQuizService {
    constructor(
        private readonly _quizRepository: IQuizRepository,
        private readonly _courseRepository: ICourseRepository
    ) {}

    getQuizzes = async (tutorId: string, page: number, limit: number) => {
        const { data, total } = await this._quizRepository.getQuizzes(tutorId, page, limit);
        return { data: toQuizDTOs(data), total };
    }

    getQuiz = async (id: string) => {
        const quiz = await this._quizRepository.getQuiz(id);
        return toQuizDTO(quiz!);
    }

    createQuiz = async (quiz: Partial<IQuizModel>) => {
        const newQuiz = await this._quizRepository.createQuiz(quiz);
        if(newQuiz) {
            await this._courseRepository.findByIdAndUpdate(newQuiz.courseId, { hasQuiz: true }, { new: true });
            return { success: true, message: "Successfully created quiz" };
        }
        return { success: false, message: "Failed to create quiz" };
    }

    updateQuiz = async (id: string, quiz: Partial<IQuizModel>) => {
        const updatedQuiz = await this._quizRepository.updateQuiz(id, quiz);
        if (!updatedQuiz) return { success: false, message: "Failed to update quiz" };
        return { success: true, message: "Successfully updated quiz" };
    }

    deleteQuiz = async (id: string) => {

        const quiz = await this._quizRepository.getQuiz(id);
        if (quiz) {
            await this._courseRepository.findByIdAndUpdate(quiz.courseId, { hasQuiz: false }, { new: true });
        }else {
            return { success: false, message: "Failed to delete quiz" };
        }

        const deletedQuiz = await this._quizRepository.deleteQuiz(id);
        if (!deletedQuiz) return { success: false, message: "Failed to delete quiz" };
        return { success: true, message: "Successfully deleted quiz" };
    }
}