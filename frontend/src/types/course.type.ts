
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
  pdfUrl?: string
  freePreview?: boolean
  progressValue?:number
  videoKey?: string // S3 object key after upload
  videoUploadStatus: "idle" | "uploading" | "success" | "error";
  videoUploadError?: string
}
export interface IStudent {
  studentId: string;
  studentName: string;
  studentEmail: string;
  paidAmount: string;
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
  students?: IStudent[];
  publishDate?: Date;
  isActive?: boolean;
  hasQuiz?: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface ITutor {
  _id: string
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
  pdfUrl?: string
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
