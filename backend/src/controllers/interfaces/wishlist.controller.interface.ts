import { AuthenticatedRequest } from "@/types/auth.type";
import { Response, NextFunction } from "express";

export interface IWishlistController {
    addToWishlist: (req:AuthenticatedRequest, res: Response, next:NextFunction) => Promise<void>;
    removeFromWishlist: (req:AuthenticatedRequest, res: Response, next:NextFunction) => Promise<void>;
    getWishlist: (req:AuthenticatedRequest, res: Response, next:NextFunction) => Promise<void>;
}