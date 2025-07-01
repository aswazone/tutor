import { insightController } from '@/dependencies/insight.di';
import { Router } from 'express';

const router = Router();

router.get('/:tutorId/:courseId', insightController.getSingleCourseInsights);
router.get('/dashboard/:tutorId/tutor', insightController.getTutorDashboardInsights);
router.get('/dashboard/:studentId/student', insightController.getStudentDashboardInsights);

export default router;