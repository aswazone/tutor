import { IUserRepository } from "@/repositories/interface/user.repository.interface";
import { IChatService } from "../interface/chat.service.interface";
import { IStudentCoursesRepository } from "@/repositories/interface/studentCourses.repository.interface";
import { HttpStatus } from "@/constants/status.constant";
import { HttpResponse } from "@/constants/response.constant";
import { createHttpError } from "@/utils/http-error.utils";
import { UserRole } from "@/types/user.type";

export class ChatService implements IChatService {
    constructor(
        private readonly _userRepository: IUserRepository,
        private readonly _studentCourseRepository: IStudentCoursesRepository
    ){}

    searchContacts = async (userId: string, searchTerm: string) => {

        console.log(searchTerm,'searchTerm');

        const user = await this._userRepository.findUserById(userId);
        if(!user) createHttpError(HttpStatus.NOT_FOUND, HttpResponse.USER_NOT_FOUND);

        if(user?.role === UserRole.STUDENT) {
            
            const studentCourses = await this._studentCourseRepository.getStudentCourses(userId);
            if(!studentCourses) createHttpError(HttpStatus.NOT_FOUND, 'Courses not found');

            const tutorIds = studentCourses?.courses.map((course) => course.tutorId.toString());

            // console.log(tutorIds,'tutorIds');
            const uniqueTutorIds = [...new Set(tutorIds)];
            // console.log(uniqueTutorIds,'uniqueTutorIds');

            const sanitizedSearchTerm = searchTerm.toLowerCase();
            const tutors = await this._userRepository.findTutorsByIds(uniqueTutorIds);
            // console.log(tutors,'tutors');
            return tutors.filter(tutor => tutor.name.toLowerCase().includes(sanitizedSearchTerm) || tutor.userEmail.toLowerCase().includes(sanitizedSearchTerm) || tutor.userName.toLowerCase().includes(sanitizedSearchTerm));

        }

        return [];
    }
}