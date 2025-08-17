import { Response, NextFunction } from "express";
import { IQuizController } from "../interfaces/quiz.controller.interface";
import { HttpStatus } from "@/constants/status.constant";
import { AuthenticatedRequest } from "@/types/auth.type";
import { IQuizService } from "@/services/interface/quiz.service.interface";
// import { HttpResponse } from "@/constants/response.constant";

export class QuizController implements IQuizController {
    constructor(private readonly _quizService: IQuizService) {}

    getQuizzes = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { page, limit } = req.query;
            const quizzes = await this._quizService.getQuizzes(req.user?.id as string, Number(page), Number(limit));
            res.json(quizzes);
        } catch (error) {
            next(error);
        }
    }

    getQuiz = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const quiz = await this._quizService.getQuiz(id);
            res.json(quiz);
        } catch (error) {
            next(error);
        }
    }

    createQuiz = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const quiz = await this._quizService.createQuiz({tutorId: req.user?.id, ...req.body});
            res.status(HttpStatus.CREATED).json(quiz);
        } catch (error) {
            next(error);
        }
    }

    updateQuiz = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const quiz = await this._quizService.updateQuiz(id, req.body);
            res.json(quiz);
        } catch (error) {
            next(error);
        }
    }

    deleteQuiz = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const quiz = await this._quizService.deleteQuiz(id);
            res.json(quiz);
        } catch (error) {
            next(error);
        }
    }


}