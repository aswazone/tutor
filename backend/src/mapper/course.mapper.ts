import { CourseStatus, ICourseModel } from "@/models/interface/course.model.interface";
import { IStudentCoursesAfterAggregation } from "@/types/course.type";
import { Types } from "mongoose";


export interface IInstructorCourseDTO {
    _id: string;
    title: string;
    category: string;
    level: string;
    pricing: string;
    thumbnailKey: string;
    students: {
            studentId:string;
            studentName: string;
            studentEmail: string;
            paidAmount: string;
        }[];
    modules: Array<{
        id: string;
        title: string;
        description: string;
        chapters: Array<{
            id: string;
            title: string;
            content: string;
        }>;
    }>;
    isDeleted: boolean;
    isPublished: boolean;
    publishDate?: Date;
    isScheduled?: boolean;
    rating: number;
    isActive: boolean;
    isVerified: CourseStatus;
    rejectReason?: string;
    createdAt: Date;
}

export const toInstructorCourseDTO = (course: ICourseModel): IInstructorCourseDTO => {
    return {
        _id: (course._id as Types.ObjectId).toString(),
        title: course.title,
        category: course.category,
        level: course.level,
        pricing: course.pricing,
        thumbnailKey: course.thumbnailKey,
        students: course.students,
        modules: course.modules,
        isDeleted: course.isDeleted,
        isPublished: course.isPublished,
        publishDate: course.publishDate,
        isScheduled: course.isScheduled,
        rating: course.rating,
        isActive: course.isActive,
        isVerified: course.isVerified,
        rejectReason: course.rejectReason,
        createdAt: course.createdAt
    }
}

export const toInstructorCourseDTOs = (courses: ICourseModel[]): IInstructorCourseDTO[] => {
    return courses.map(toInstructorCourseDTO);
}


export interface IStudentCourseDTO {
    courseId: string;
    title: string;
    tutorId: string;
    tutorName: string;
    dateOfPurchase: Date;
    courseImage: string;
}

export const toStudentCourseDTO = (studentCourse: IStudentCoursesAfterAggregation): IStudentCourseDTO => {
    return {
        courseId: studentCourse.courseId,
        title: studentCourse.title,
        tutorId: studentCourse.tutorId,
        tutorName: studentCourse.tutorName,
        dateOfPurchase: studentCourse.dateOfPurchase,
        courseImage: studentCourse.courseImage
    }
}

export const toStudentCourseDTOs = (studentCourses: IStudentCoursesAfterAggregation[]): IStudentCourseDTO[] => {
    return studentCourses.map(toStudentCourseDTO);
}