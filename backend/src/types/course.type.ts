import { Document, Types } from 'mongoose';

export interface IChapter {
  id: string;
  title: string;
  content: string;
  videoKey?: string;
  pdfUrl?: string;
  subtitleUrl?: string;
  videoUploadStatus: 'idle' | 'uploading' | 'success' | 'error';
  videoUploadError?: string;
}

export interface IModule {
  id: string;
  title: string;
  description: string;
  chapters: IChapter[];
}

export interface ICourse extends Document {
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
  isPublished: boolean;
  isVerified?: string;
  rejectReason?: string;
  modules: IModule[];
  tutor: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCourseDTO {
  courseDetails: {
    title: string;
    category: string;
    level: string;
    primaryLanguage: string;
    subtitle?: string;
    description: string;
    pricing: string;
    objectives?: string;
    welcomeMessage?: string;
  };
  thumbnailKey: string;
  isPublished: boolean;
  modules: IModule[];
}

export interface IPresignedUrlResponse {
  url: string;
  key: string;
}
