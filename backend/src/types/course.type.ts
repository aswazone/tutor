import { ICourseModel } from '@/models/interface/course.model.interface';
import { IStudentCoursesModel } from '@/models/interface/studentCourses.model.interface';
import { Document, Types} from 'mongoose';

export interface ITutor {
  _id: string;
  name: string;
  userEmail: string;
  userName: string;
  isActive: boolean;
}
export interface IChapter {
  id: string;
  title: string;
  content: string;
  videoKey?: string;
  pdfUrl?: string;
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
  tutor?: Types.ObjectId;
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
  publishDate?: Date;
  isScheduled?: boolean;
  modules: IModule[];
}

export interface IPresignedUrlResponse {
  url: string;
  key: string;
}


export interface IOrderDataDTO extends Document {
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
  tutor: ITutor;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourseInsights {
    courseId: string;
    courseTitle: string;
    enrolledStudents?: number;
    totalRevenue?: number;
    activeStudentsThisWeek: number;
    completionRate: number;
    averageRating?: string | number;
    mostActiveModule: string;
    mostRewatchedChapter: string;
    feedback: string[];
    weeklyTrends: {
        week: string;
        activeStudents?: number;
        newEnrollments?: number;
    }[];
    moduleProgress: {
        module: string;
        completion: number;
    }[];
}

export interface FindCoursesByInstructorResult {
  data: ICourseModel[],
  total: number
}
export interface FindCoursesByStudentResult {
  data: IStudentCoursesModel[],
  total: number
}

export interface IStudentCoursesAfterAggregation {
  courseId: string;
  title: string;
  tutorId: string;
  tutorName: string;
  dateOfPurchase: Date;
  courseImage: string;
}

export interface FindCoursesByStudentResultAfterAggregation  {
  data: IStudentCoursesAfterAggregation[],
  total: number
}
