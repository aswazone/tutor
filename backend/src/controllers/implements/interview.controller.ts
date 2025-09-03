import { IInterviewService } from "@/services/interface/interview.service.interface";
import { IInterviewController } from "../interfaces/interview.controller.interface";
import { HttpStatus } from "@/constants/status.constant";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "@/types/auth.type";

export class InterviewController implements IInterviewController {
    constructor(private readonly _interviewService: IInterviewService) {}

    generateQuestions = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const questions = await this._interviewService.generateQuestions(req.body);
            res.status(HttpStatus.OK).json(questions);
        } catch (err) {
            next(err);
        }
    }

    generateFeedback = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const feedback = await this._interviewService.generateFeedback(req.body);
            res.status(HttpStatus.OK).json(feedback);
        } catch (err) {
            next(err);
        }
    }

    createInterview = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const interview = await this._interviewService.createInterview(req.body);
            res.status(HttpStatus.OK).json(interview);
        } catch (err) {
            next(err);
        }
    }

    createInterviewFeedback = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const feedback = await this._interviewService.createFeedback(req.body);
            res.status(HttpStatus.OK).json(feedback);
        } catch (err) {
            next(err);
        }
    }

    getInterview = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const interview = await this._interviewService.getInterview(req.params.interviewId);
            res.status(HttpStatus.OK).json(interview);
        } catch (err) {
            next(err);
        }
    }
    
    getTutorCreatedInterviews = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { page, limit , email} = req.query;
            console.log('trigger2');
            const interviews = await this._interviewService.getTutorCreatedInterviews(email as string,Number(page),Number(limit));
            res.status(HttpStatus.OK).json(interviews);
        } catch (err) {
            next(err);
        }
    }

    deleteInterview = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const interview = await this._interviewService.deleteInterview(req.params.interviewId);
            res.status(HttpStatus.OK).json(interview);
        } catch (err) {
            next(err);
        }
    }
}