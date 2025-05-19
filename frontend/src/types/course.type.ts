
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
  videoKey?: string // S3 object key after upload
  video?: File // Temporary field for file upload
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
  tutor: string;
  rating:string
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
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
  videoKey?: string // S3 object key after upload
  video?: File // Temporary field for file upload
  videoUploadStatus: "idle" | "uploading" | "success" | "error";
  videoUploadError?: string
}

