import { Router } from 'express';
import { courseController } from '@/dependencies/course.di';
import { authenticateToken } from '@/middlewares/auth.middleware';


const router = Router();


router.post('/', authenticateToken, courseController.createCourse);
router.get('/tutor', authenticateToken, courseController.getInstructorCourses);
router.get('/:courseId', courseController.getCourse);

export default router;
