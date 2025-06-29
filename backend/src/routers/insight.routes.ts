import { insightController } from '@/dependencies/insight.di';
import { Router } from 'express';

const router = Router();

router.get('/:tutorId/:courseId', insightController.getAllCoursesInsights);

export default router;