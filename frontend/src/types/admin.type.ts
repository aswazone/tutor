
import { IFormControl } from "@/config/helper.config";
import { SignInFormData } from ".";
import { Module } from "./course.type";

export interface SignInProps {
    handleSignInSubmit: (data: SignInFormData) => void;
    signInFormControl: IFormControl[];
}



export interface ApiStudents {
  _id: string;
  name: string;
  userName: string;
  userEmail: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
}

// // export interface ApiModules {
// //   _id: string;
// //   title: string;
// //   chapters: {
// //     _id: string;
// //     title: string;
// //   }[];
// // }

// export interface IApiChapter {
//   id: string;
//   title: string;
//   content: string;
//   videoKey?: string;
//   pdfUrl?: string;
//   videoUploadStatus?: 'idle' | 'uploading' | 'success' | 'error';
//   videoUploadError?: string;
// }

// export interface IApiModule {
//   id: string;
//   title: string;
//   description: string;
//   chapters: IApiChapter[];
// }

export interface ApiCourses {
  _id: string;
  title: string;
  isPublished: boolean;
  isActive: boolean;
  thumbnailKey: string;
  level: string;
  pricing: string;
  tutor: {
    id: string;
    userName: string;
  };
  modules: Module[];
  rating: string;
  category: string;
  isDeleted: boolean;
  createdAt: Date;
  isVerified: string;
  rejectReason?: string
}

export interface Course {
  id: string
  title: string
  tutor: string
  category: string
  thumbnailKey: string
  level: string
  isVerified: string
  rejectReason?: string
  isActive: boolean
  price: string
  enrollments: number
  rating: number
  status: "draft" | "published" | "archived"
}

interface TutorDetails {
  qualification: string;
  experience: number;
  expertise: string;
  about: string;
  resume?: string;
}

export interface Tutor {
  _id: string;
  userName: string;
  userEmail: string;
  tutorDetails: TutorDetails | null;
  isVerified: 'verified' | 'pending' | 'rejected';
  isActive: boolean;
  createdAt: string;
  rejectReason?: string;
}