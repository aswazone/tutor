import { ChatController } from "@/controllers/implements/chat.controller";
import { ChatRoomRepository } from "@/repositories/implements/chatRoom.repository";
import { CourseRepository } from "@/repositories/implements/course.repository";
import { MessageRepository } from "@/repositories/implements/message.repository";
import { StudentCoursesRepository } from "@/repositories/implements/studentCourses.repository";
import { UserRepository } from "@/repositories/implements/user.repository";
import { ChatService } from "@/services/implements/chat.service";
import { MessageService } from "@/services/implements/message.service";

export const chatController = new ChatController(
    new ChatService(
        new UserRepository(),
        new ChatRoomRepository(), 
        new CourseRepository(),
        new StudentCoursesRepository()
    ),
    new  MessageService(
        new ChatRoomRepository(),
        new MessageRepository()
    )
);