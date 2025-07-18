import { Router } from 'express';
import { courseController } from '@/dependencies/course.di';
import { authenticateToken } from '@/middlewares/auth.middleware';
import { checkRole } from '@/middlewares/checkrole.middleware';


const router = Router();

router.get('/', courseController.getAllCourses);
router.post('/', authenticateToken,checkRole("tutor"), courseController.createCourse);
router.put('/:courseId', authenticateToken,checkRole("tutor"), courseController.updateCourse);
router.get('/tutor', authenticateToken, courseController.getInstructorCourses);
router.get('/student', authenticateToken, courseController.getStudentCourses);
router.get('/:courseId', courseController.getCourse);
router.get('/check-purchased/:courseId/:userId', courseController.checkIfCoursePurchased);
router.delete('/:courseId', authenticateToken,checkRole("tutor"), courseController.deleteCourse);
router.patch('/:courseId/:status', authenticateToken,checkRole("tutor"), courseController.toggleCourseStatus);
router.patch('/:courseId/verify/:status', authenticateToken, courseController.verifyCourse);

export default router;
