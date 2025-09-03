import { interviewController } from "@/dependencies/interview.di";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { Router } from "express";

const interviewRouter = Router();
interviewRouter.get('/tutor', authenticateToken,interviewController.getTutorCreatedInterviews);
interviewRouter.post('/generate/feedback', authenticateToken,interviewController.generateFeedback);
interviewRouter.post('/generate/questions', authenticateToken,interviewController.generateQuestions);
interviewRouter.post('/create', authenticateToken,interviewController.createInterview);
interviewRouter.post('/feedback/create', authenticateToken,interviewController.createInterviewFeedback);
interviewRouter.get('/:interviewId', authenticateToken,interviewController.getInterview);
interviewRouter.delete('/:interviewId', authenticateToken,interviewController.deleteInterview);

export default interviewRouter;