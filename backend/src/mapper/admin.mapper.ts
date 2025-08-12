import { CategoryDocument } from "@/models/interface/category.model.interface";
import { ICourseModel } from "@/models/interface/course.model.interface";
import { IUserModel } from "@/models/interface/user.model.interface";
import { Document } from "mongoose";


export interface IAdminCourseDTO {
    id: string;
    title: string;
    status: string;
    category: string;
    isDeleted: boolean;
    isVerified: string;
    rejectReason: string;
    isActive: boolean;
    level: string;
    tutor: string;
    price: string;
    rating: number;
    thumbnailKey: string;
    enrollments: number;
    createdDate: string;
}

export const toAdminCourseDTO = (course: ICourseModel): IAdminCourseDTO => {
    return {
        id: (course._id as string).toString(),
        title: course.title,
        status: course.isPublished ? 'published' : 'draft',
        category: course.category,
        isDeleted: course.isDeleted,
        isVerified: course.isVerified,
        rejectReason: course.rejectReason || '',
        isActive: course.isActive,
        level: course.level,
        tutor: (course.tutor?.userName as string).toString(),
        price: course.pricing,
        rating: course.rating,
        thumbnailKey: course.thumbnailKey,
        enrollments: course.students.length,
        createdDate: new Date(course.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    }
}
    
export const toAdminCourseDTOs = (courses: ICourseModel[]): IAdminCourseDTO[] => {
    return courses.map(toAdminCourseDTO);
}

export interface IAdminUserDTO {
    id: string;
    userName: string;
    userEmail: string;
    name: string;
    role: string;
    isActive: boolean;
    isDeleted: boolean;
    createdDate: string;
    profileImage: string;
    isVerified: string;
    tutorDetails?:{
        qualification?: string;
        experience?: number;
        expertise?: string;
        about?: string;
        resume?: string;
        rejectReason?: string;
    }
    onlineStatus?: boolean;
    studentDetails?:{
        qualification?: string;
        about?: string;
        expertise?: string;
    }
}


export const toAdminUserDTO = (user: IUserModel): IAdminUserDTO => {
    return {
        id: (user._id as string).toString(),
        userName: user.userName,
        userEmail: user.userEmail,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        isDeleted: user.isDeleted,
        createdDate: new Date(user.createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }),
        profileImage: user.profileImage as string,
        isVerified: user.isVerified,
        tutorDetails: user.tutorDetails,
        onlineStatus: user.onlineStatus,
        studentDetails: user.studentDetails
    }
}

export const toAdminUserDTOs = (users: IUserModel[]): IAdminUserDTO[] => {
    return users.map(toAdminUserDTO);
}

export interface IAdminCategoryDTO {
  _id: string;
  name: string;
  isListed: boolean;
  subCategories: Array<{
    _id: string;
    name: string;
    isListed: boolean;
    coursesCount: number;
    parentId:Document['_id'];
    createdAt: Date;
    updatedAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export const toAdminCategoryDTO = (category:CategoryDocument): IAdminCategoryDTO =>{
    return {
        _id: (category._id as string).toString(),
        name: category.name,
        isListed: category.isListed,
        subCategories: category.subCategories.map(sub => ({
            _id: (sub._id as string).toString(),
            name: sub.name,
            isListed: sub.isListed,
            coursesCount: sub.coursesCount,
            parentId: sub.parentId,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt  
        })),
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
    }
}

export const toAdminCategoryDTOs = (categories:CategoryDocument[]): IAdminCategoryDTO[] => {
    return categories.map(toAdminCategoryDTO);
}