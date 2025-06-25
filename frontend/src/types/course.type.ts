
export interface Module {
  id: string
  title: string
  description: string
  chapters: Chapter[]
}

export interface Chapter {
  id: string
  title: string
  content: string
  pdfUrl?: File
  subtitleUrl?: File
  freePreview?: boolean
  progressValue?:number
  videoKey?: string // S3 object key after upload
  videoUploadStatus: "idle" | "uploading" | "success" | "error";
  videoUploadError?: string
}

export interface ICourse {
  _id: string;
  title: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  primaryLanguage: string;
  subtitle: string;
  description: string;
  pricing: string;
  objectives: string;
  welcomeMessage: string;
  thumbnailKey: string;
  modules: IModule[];
  tutor: ITutor;
  rating?:string;
  isVerified?: string; 
  rejectReason?: string;
  isScheduled?: boolean;
  publishDate?: Date;
  isActive?: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface ITutor {
  id: string
  userName: string
  userEmail: string
  isActive: boolean
}
export interface IModule {
  id: string
  title: string
  description: string
  chapters: IChapter[]
}

export interface IChapter {
  id: string
  title: string
  content: string
  pdfUrl?: File
  subtitleUrl?: File
  freePreview?: boolean
  videoKey?: string // S3 object key after upload
  video?: File // Temporary field for file upload
  videoUploadStatus: "idle" | "uploading" | "success" | "error";
  videoUploadError?: string
}


export interface IOptionBase {
  id: string;
}

export interface ISubcategoryOption extends IOptionBase {
  parentId: string;
}

export type IOptions = IOptionBase | ISubcategoryOption;

export type Filters = {
  [key: string]: string[] | ISubcategoryOption[];
};

export interface IProgressData {
  isPurchased: boolean;
  message: string;
  progress: {
    completed: boolean;
    completionDate: Date;
    moduleProgress: {
      moduleId: string;
      viewed: boolean;
      dateViewed: Date;
      chapterProgress: {
        chapterId: string;
        viewed: boolean;
        dateViewed: Date;
      }[];
    }[];
  };
  courseDetails: ICourse;
}


export interface IBoughtCourse {
  _id: string;
 courseId: string;
 title: string;
 courseImage: string;
 dateOfPurchase: string;
 tutorId: string;
 tutorName: string;
}