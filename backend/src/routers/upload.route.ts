import { Router } from 'express';
import { authenticateToken } from '@/middlewares/auth.middleware';
import { uploadController } from '@/dependencies/upload.di';


const router = Router();

router.get('/presigned-url', authenticateToken, uploadController.getPresignedUrl);

export default router;
