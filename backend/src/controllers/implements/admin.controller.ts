import { Response, Request, NextFunction } from "express";
import { IAdminController } from "../interfaces/admin.controller.interface";
import { IAdminService } from "@/services/interface/admin.service.interface";
import { HttpStatus } from "@/constants/status.constant";

export class AdminController implements IAdminController {

    constructor(private readonly _adminService: IAdminService) {}

    getAllTutors = async (req: Request, res:Response, next: NextFunction):Promise<void> => {
        try {

            console.log('get-all-tutors');

            const tutors = await this._adminService.getAllTutors();

            console.log(tutors);

            res.status(HttpStatus.OK).json(tutors);
            
        } catch (err) {
            next(err);
        }
    }

    getAllStudents = async (req: Request, res:Response, next: NextFunction):Promise<void> => {
        try {

            console.log('get-all-students');

            const students = await this._adminService.getAllStudents();
            res.status(HttpStatus.OK).json(students);
            
        } catch (err) {
            next(err);
        }
    }

    getAllCourses = async (req: Request, res:Response, next: NextFunction):Promise<void> => {
        try {

            console.log('get-all-Courses');

            const courses = await this._adminService.getAllCourses();
            res.status(HttpStatus.OK).json(courses);
            
        } catch (err) {
            next(err);
        }
    }

    toggleUserStatus = async (req: Request, res:Response, next: NextFunction):Promise<void> => {
        try {

            const user = await this._adminService.toggleUserStatus(req.params.id,req.params.status);
            res.status(HttpStatus.OK).json(user);
            
        } catch (err) {
            next(err);
        }
    }

    toggleCourseStatus = async (req: Request, res:Response, next: NextFunction):Promise<void> => {
        try {

            const course = await this._adminService.toggleCourseStatus(req.params.id,req.params.status);
            res.status(HttpStatus.OK).json(course);
            
        } catch (err) {
            next(err);
        }
    }
}