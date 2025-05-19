import { Request, Response, NextFunction } from 'express';
import { UploadServiceIF } from '@/services/interface/upload.service.interface';
import { UploadControllerIF } from '../interfaces/upload.controller.interface';
import { HttpError } from '@/utils/http-error.utils';
import { HttpStatus } from '@/constants/status.constant';
export class UploadController implements UploadControllerIF {
    constructor(private readonly _uploadService: UploadServiceIF) {}

    
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
