import { IUserRepository } from "@/repositories/interface/user.repository.interface";
import { IChatService } from "../interface/chat.service.interface";
import { IStudentCoursesRepository } from "@/repositories/interface/studentCourses.repository.interface";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { createHttpError } from "@/utils/http-error.utils";
import { UserRole } from "@/types/user.type";
import { IChatRoomRepository } from "@/repositories/interface/chatRoom.repository.interface";
import { ICourseRepository } from "@/repositories/interface/course.repository.interface";

export class ChatService implements IChatService {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _chatRoomRepository: IChatRoomRepository,
        private readonly _courseRepository: ICourseRepository,
        private readonly _studentCourseRepository: IStudentCoursesRepository
    ){}

    getAllChatRooms = async (userId: string) => {
        const chatRooms = await this._chatRoomRepository.getAllChatRooms(userId);
        return chatRooms;
    }

    searchContacts = async (userId: string, searchTerm: string) => {

        console.log(searchTerm,'searchTerm');

        const user = await this._userRepository.findUserById(userId);
        if(!user) createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);
        const sanitizedSearchTerm = searchTerm.toLowerCase();

        if(user?.role === UserRole.STUDENT) {
            
            const studentCourses = await this._studentCourseRepository.getStudentCourses(userId);
            if(!studentCourses) createHttpError(HttpStatus.NOT_FOUND, 'Courses not found');

            const tutorIds = studentCourses?.courses.map((course) => course.tutorId.toString());

            // console.log(tutorIds,'tutorIds');
            const uniqueTutorIds = [...new Set(tutorIds)];
            console.log(uniqueTutorIds,'uniqueTutorIds');

            const tutors = await this._userRepository.findTutorsByIds(uniqueTutorIds);
            // console.log(tutors,'tutors');
            return tutors.filter(tutor => tutor.name.toLowerCase().includes(sanitizedSearchTerm) || tutor.userEmail.toLowerCase().includes(sanitizedSearchTerm) || tutor.userName.toLowerCase().includes(sanitizedSearchTerm));

        }else {
            const tutorCourses = await this._courseRepository.getByInstructor(userId);
            if(!tutorCourses) createHttpError(HttpStatus.NOT_FOUND, 'Courses not found');

            const studentIds = tutorCourses?.map((course) => course.students.map((student) => student.studentId.toString()));

            
            const uniqueStudentIds = [...new Set(studentIds.flat())];
            // console.log(uniqueStudentIds,'studentIds');

            const students = await this._userRepository.findStudentsByIds(uniqueStudentIds);
            // console.log(students,'students');
            return students.filter(student => student.name.toLowerCase().includes(sanitizedSearchTerm) || student.userEmail.toLowerCase().includes(sanitizedSearchTerm) || student.userName.toLowerCase().includes(sanitizedSearchTerm));

        }
    }

    getOrCreateChatRoom = async (userId: string, participantId: string) => {

        const user = await this._userRepository.findUserById(userId);
        if(!user) createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);

        const participant = await this._userRepository.findUserById(participantId);
        if(!participant) createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);

        const chatRoom = await this._chatRoomRepository.existingChatRoom(userId, participantId);

        if(!chatRoom) {
            const newChatRoom = await this._chatRoomRepository.createChatRoom(userId, participantId);
            return newChatRoom;
        }

        return chatRoom;
    }
    
}