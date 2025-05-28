import { Request, Response, NextFunction } from 'express';
import { IUploadService } from '@/services/interface/upload.service.interface';
import { IUploadController } from '../interfaces/upload.controller.interface';
import { HttpError } from '@/utils/http-error.utils';
import { HttpStatus } from '@/constants/status.constant';
export class UploadController implements IUploadController {
    constructor(private readonly _uploadService: IUploadService) {}

    
    getPresignedUrl = async (req: Request, res: Response, next: NextFunction) => {
        try {

            console.log('reached')
            const { fileName, fileType } = req.query;

            if (!fileName || !fileType || typeof fileName !== 'string' || typeof fileType !== 'string') {
                throw new HttpError(HttpStatus.BAD_REQUEST, 'fileName and fileType are required query parameters');
            }
            console.log('before');
            const presignedUrl = await this._uploadService.getPresignedUrl(fileName, fileType);
            console.log(presignedUrl);
            res.json(presignedUrl);

        } catch (err) {
            next(err);
        }
    };

}
