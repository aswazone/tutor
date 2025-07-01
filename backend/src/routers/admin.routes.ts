import { adminController } from "@/dependencies/admin.di";
import { Router } from "express";

const adminRouter = Router();
adminRouter.get("/tutors", adminController.getAllTutors);
adminRouter.get("/students", adminController.getAllStudents);
adminRouter.get("/courses", adminController.getAllCourses);
adminRouter.get("/revenue/:page/:limit", adminController.getRevenue);
adminRouter.patch("/toggle-user-status/:id/:status", adminController.toggleUserStatus);
adminRouter.patch("/toggle-course-status/:id/:status", adminController.toggleCourseStatus);

export default adminRouter;