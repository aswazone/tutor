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