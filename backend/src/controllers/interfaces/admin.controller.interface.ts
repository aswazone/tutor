import { Response, Request, NextFunction } from "express";

export interface AdminControllerIF {
    getAllTutors: (req:Request, res:Response, next:NextFunction) => Promise<void>
    getAllStudents: (req:Request, res:Response, next:NextFunction) => Promise<void>
    toggleUserStatus: (req:Request, res:Response, next:NextFunction) => Promise<void>
    toggleCourseStatus: (req:Request, res:Response, next:NextFunction) => Promise<void>
}