import { ChatController } from "@/controllers/implements/chat.controller";
import { StudentCoursesRepository } from "@/repositories/implements/studentCourses.repository";
import { UserRepository } from "@/repositories/implements/user.repository";
import { ChatService } from "@/services/implements/chat.service";

export const chatController = new ChatController(new ChatService(new UserRepository(), new StudentCoursesRepository()));