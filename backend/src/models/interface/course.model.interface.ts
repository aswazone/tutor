import { Document, Types } from 'mongoose';
import { ICourse } from '@/types/course.type';

// Remove Document from ICourse since we'll extend it here
export type CourseDocumentProps = Omit<ICourse, keyof Document>;

export interface CourseModelIF extends Document {
    title: string;
    category: string;
    level: string;
    primaryLanguage: string;
    subtitle?: string;
    description: string;
    pricing: string;
    objectives?: string;
    welcomeMessage?: string;
    thumbnailKey: string;
    modules: Array<{
        id: string;
        title: string;
        description: string;
        chapters: Array<{
            id: string;
            title: string;
            content: string;
            videoKey?: string;
            pdfUrl?: string;
            subtitleUrl?: string;
            videoUploadStatus: 'idle' | 'uploading' | 'success' | 'error';
            videoUploadError?: string;
        }>;
    }>;
    isDeleted: boolean;
    tutor: Types.ObjectId;
    isPublished: boolean;
    rating: number;
    isActive: boolean;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
