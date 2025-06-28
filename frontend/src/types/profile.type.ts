import { UserRole } from ".";
import { ICourse } from "./course.type";

export type CourseCardProps = {
  course: ICourse;
  onNavigate: (id: string) => void;
  onDelete: (id: string) => void;
};

export interface User {
  _id: string
  userName: string
  userEmail: string
  name?: string
  role: UserRole
  profileImage?: string
  isVerified?: string
  tutorDetails?: {
    qualification?: string
    experience?: number
    expertise?: string
    about?: string
    resume?: string
    rejectReason?: string
  }
  createdAt?: Date
}

export interface ChapterFormValues {
  title: string;
  content: string;
  video: File | string | undefined;
  pdf: File | string | undefined;
  freePreview: boolean
}

export interface ChapterFormProps {
  onSubmit: (values: ChapterFormValues) => void;
  onCancel: () => void;
  initialData?: {
    title: string;
    content: string;
    video?: string | File;
    pdfUrl?: string | File;
    freePreview?: boolean
  }
}