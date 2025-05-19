import { Module } from "./course.type";
import { CourseLandingFormData } from "@/schemas/course/course-landing.schema";

export interface UploadCourseResult {
  thumbnailKey: string;
  modules: Module[];
  uploadTimestamp?: Date;
  isValid?: boolean;
  validationErrors?: string[];
}

export interface SubmitCourseData {
  courseDetails: CourseLandingFormData;
  thumbnailKey: string;
  modules: Module[];
  submissionTimestamp: Date;
  isDraft?: boolean;
}

export interface CourseError {
  message: string;
  field?: string;
  code?: string;
}

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';
export type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';