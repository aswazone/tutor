import { adminController } from "@/dependencies/admin.di";
import { authenticateToken } from "@/middlewares/auth.middleware";
import { checkRole } from "@/middlewares/checkrole.middleware";
import { Router } from "express";

const adminRouter = Router();
adminRouter.get("/tutors",authenticateToken,checkRole("admin"), adminController.getAllTutors);
adminRouter.get("/students",authenticateToken,checkRole("admin"), adminController.getAllStudents);
adminRouter.get("/courses",authenticateToken,checkRole("admin"), adminController.getAllCourses);
adminRouter.get("/revenue/:page/:limit",authenticateToken,checkRole("admin"), adminController.getRevenue);
adminRouter.patch("/toggle-user-status/:id/:status",authenticateToken,checkRole("admin"), adminController.toggleUserStatus);
adminRouter.patch("/toggle-course-status/:id/:status",authenticateToken,checkRole("admin"), adminController.toggleCourseStatus);

export default adminRouter;