import { s3Client } from '../../config/s3.config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { HttpError } from '../../utils/http-error.utils';
import { AWS_S3_BUCKET } from '@/config/env.config';
import { UploadServiceIF } from '../interface/upload.service.interface';
import { HttpStatus } from '@/constants/status.constant';

interface FolderConfig {
  path: string;
  contentType: string;
}

export class UploadService implements UploadServiceIF {
    private readonly folderConfigs: Record<string, FolderConfig> = {
        'image': {
            path: 'course-thumbnails',
            contentType: 'image/*'
        },
        'video': {
            path: 'course-videos',
            contentType: 'video/*'
        },
        'pdf': {
            path: 'course-documents',
            contentType: 'application/pdf'
        },
        'subtitle': {
            path: 'course-subtitles',
            contentType: 'text/vtt'
        }
    };

    getPresignedUrl = async (fileName: string, contentType: string) => {
        try {

            
            // Extract file type from content type
            const type = contentType.split('/')[0];
            
            // Get folder configuration
            const config = this.folderConfigs[type];
            if (!config) throw new HttpError( HttpStatus.BAD_REQUEST, `Unsupported file type: ${type}`);
            

            // Build folder path
            let folderPath = config.path;
            if (type === 'video') {
                const [moduleId, chapterId] = fileName.split('/');
                if (!moduleId || !chapterId) throw new HttpError( HttpStatus.BAD_REQUEST, 'Invalid video file path format. Expected: moduleId/chapterId/filename');
                folderPath = `${folderPath}/${moduleId}/${chapterId}`;
            }

            // Generate unique key
            const sanitizedFileName = fileName.split('/').pop()!;
            const key = `${folderPath}/${Date.now()}-${sanitizedFileName}`;


            const command = new PutObjectCommand({
                Bucket: AWS_S3_BUCKET!,
                Key: key,
                ContentType: config.contentType,
            });
            


            const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            if (!url) throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to generate presigned URL');
            

            return { url, key };
        } catch (error) {
            if (error instanceof HttpError) {
                throw error;
            }
            throw new HttpError(
                HttpStatus.INTERNAL_SERVER_ERROR,
                'Error generating presigned URL'
            );
        }
    }
}