import { quizController } from "@/dependencies/quiz.di";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { Router } from "express";

const quizRouter = Router();

quizRouter.get('/tutor', authenticateToken, quizController.getQuizzes);
quizRouter.get('/:id', authenticateToken, quizController.getQuiz);
quizRouter.post('/create', authenticateToken, quizController.createQuiz);
quizRouter.patch('/edit/:id', authenticateToken, quizController.updateQuiz);
quizRouter.delete('/delete/:id', authenticateToken, quizController.deleteQuiz);


export default quizRouter;