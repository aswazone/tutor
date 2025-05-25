import { wishlistController } from '@/dependencies/wishlist.di';
import { authenticateToken } from '@/middlewares/auth.middleware';
import { Router } from 'express';

const wishlistRouter = Router();

wishlistRouter.get('/', authenticateToken, wishlistController.getWishlist)
wishlistRouter.delete('/:courseId', authenticateToken, wishlistController.removeFromWishlist)
wishlistRouter.post('/:courseId', authenticateToken, wishlistController.addToWishlist)

export default wishlistRouter;