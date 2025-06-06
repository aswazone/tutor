import { Router } from 'express';
import { courseController } from '@/dependencies/course.di';
import { authenticateToken } from '@/middlewares/auth.middleware';


const router = Router();

router.get('/', courseController.getAllCourses);
router.post('/', authenticateToken, courseController.createCourse);
router.put('/:courseId', authenticateToken, courseController.updateCourse);
router.get('/tutor', authenticateToken, courseController.getInstructorCourses);
router.get('/student', authenticateToken, courseController.getStudentCourses);
router.get('/:courseId', courseController.getCourse);
router.delete('/:courseId', authenticateToken, courseController.deleteCourse);
router.patch('/:courseId/:status', authenticateToken, courseController.toggleCourseStatus);
router.patch('/:courseId/verify/:status', authenticateToken, courseController.verifyCourse);

export default router;
