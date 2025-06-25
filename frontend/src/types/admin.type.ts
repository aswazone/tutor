
import { IFormControl } from "@/config/helper.config";
import { SignInFormData } from ".";

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