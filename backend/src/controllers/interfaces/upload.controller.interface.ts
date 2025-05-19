import { Request, Response, NextFunction } from "express";

export interface UploadControllerIF {
    getPresignedUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
}
