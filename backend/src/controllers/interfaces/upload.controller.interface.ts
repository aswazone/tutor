import { Request, Response, NextFunction } from "express";

export interface IUploadController {
    getPresignedUrl(req: Request, res: Response, next: NextFunction): Promise<void>;
}
