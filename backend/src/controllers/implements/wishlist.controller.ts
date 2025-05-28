import { HttpStatus } from "@/constants/status.constant";
import { AuthenticatedRequest } from "@/types/auth.type";
import { Response,NextFunction } from "express";
import { IWishlistController } from "../interfaces/wishlist.controller.interface";
import { IWishlistService } from "@/services/interface/wishlist.service.interface";

export class WishlistController implements IWishlistController {
  constructor(private readonly _wishlistService: IWishlistService) {}

  addToWishlist = async (req: AuthenticatedRequest, res: Response ,next:NextFunction):Promise<void> => {
    try {
        if(!req.user?.id) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' })
            return;
        }
        const userId = req.user?.id;
        const courseId = req.params.courseId;
        await this._wishlistService.addToWishlist(userId, courseId);
        res.status(HttpStatus.OK).json({ message: 'Added to wishlist' });
    } catch (error) {
        next(error)
    }
  }

  removeFromWishlist = async (req: AuthenticatedRequest, res: Response ,next:NextFunction):Promise<void> => {
    try {
        if(!req.user?.id) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' })
            return;
        }
        const userId = req.user?.id;
        const courseId = req.params.courseId;
        await this._wishlistService.removeFromWishlist(userId, courseId);
        res.status(HttpStatus.OK).json({ message: 'Removed from wishlist' });
    } catch (error) {
        next(error)
    }
  }

  getWishlist = async (req: AuthenticatedRequest, res: Response ,next:NextFunction) :Promise<void> => {
    try {
        if(!req.user?.id) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' })
            return;
        }
        const userId = req.user?.id;
        const wishlist = await this._wishlistService.getWishlist(userId);
        res.status(HttpStatus.OK).json(wishlist);
    } catch (error) {
        next(error)
    }
  }
}