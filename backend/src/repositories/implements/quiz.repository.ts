import { IQuizModel } from "@/models/interface/quiz.model.interface";
import { BaseRepository } from "../base.repository";
import { IQuizRepository } from "../interface/quiz.repository.interface";
import { QuizModel } from "@/models/implements/quiz.model";

export class QuizRepository extends BaseRepository<IQuizModel> implements IQuizRepository {
    constructor() {
        super(QuizModel);
    }

    async getQuizzes(tutorId: string, page: number, limit: number) {
        const data: IQuizModel[] = await this.model.find({ tutorId }).populate({ path : 'courseId', select: 'title hasQuiz' }).skip((page - 1) * limit).limit(limit);
        const total: number = await this.model.countDocuments({ tutorId });
        return { data, total };
    }

    async getQuiz(id: string) {
        return this.model.findOne({ courseId: id }).populate({ path : 'courseId', select: 'title hasQuiz' });
    }

    async createQuiz(quiz: Partial<IQuizModel>) {
        return this.model.create(quiz);
    }

    async updateQuiz(id: string, quiz: Partial<IQuizModel>) {
        return this.model.findByIdAndUpdate(id, quiz, { new: true });
    }

    async deleteQuiz(id: string) {
        return this.model.findByIdAndDelete(id);
    }
}