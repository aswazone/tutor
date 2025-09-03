import {  InterviewFeedbackResponse, interviewFormData, QuestionResponse } from "@/types/interview.type";
import { IInterviewService } from "../interface/interview.service.interface";
// import { openai as AI } from "@/config/ai.config";
import { FEEDBACK_PROMPT, FeedbackFallback, QUESTION_PROMPT } from "@/constants/interview.constant";
import { geminiModel } from "@/config/ai.config";
import { IInterviewModel } from "@/models/interface/interview.model.interface";
import { IInterviewRepository } from "@/repositories/interface/interview.repository.interface";
import { IFeedbackModel } from "@/models/interface/feedback.model.interface";
import { IFeedbackRepository } from "@/repositories/interface/feedback.repository.interface";
import { toInterviewDTOs } from "@/mapper/interview.mapper";
import { aiContentToJSON } from "@/utils/content-to-json.utils";
import { IUserRepository } from "@/repositories/interface/user.repository.interface";
import { ICourseRepository } from "@/repositories/interface/course.repository.interface";
import { sendNotificationToUsers } from "@/utils/send-notification-to-users";
import { INotificationModel } from "@/models/interface/notification.model.interface";
import { createHttpError } from "@/utils/http-error.utils";
import { HttpStatus } from "@/constants/status.constant";

export class InterviewService implements IInterviewService {

    constructor( 
        private readonly _interviewRepository: IInterviewRepository,
        private readonly _feedbackRepository: IFeedbackRepository,
        private readonly _userRepository: IUserRepository,
        private readonly _courseRepository: ICourseRepository
    ) {}

    generateQuestions = async ({domain,description,duration,interviewTypes}:interviewFormData) => {
        const FINAL_PROMPT = QUESTION_PROMPT
                                .replaceAll('{{jobTitle}}',domain)
                                .replaceAll('{{jobDescription}}',description)
                                .replaceAll('{{duration}}',duration)
                                .replaceAll('{{type}}',interviewTypes.join('-'));
                                
        console.log(FINAL_PROMPT,'FINAL_PROMPT-testing');

        await new Promise(resolve => setTimeout(resolve, 2000));

        const {candidates} = await geminiModel.models.generateContent({
            model:'gemini-2.5-flash',
            contents:FINAL_PROMPT
        })

        return aiContentToJSON<QuestionResponse>(candidates!);

        // if (candidates?.[0]?.content?.parts?.[0]?.text) {
        //     const jsonText = candidates[0].content.parts[0].text
        //         .replace(/```json\n/, '')
        //         .replace(/```/, '');
        //     const questions = JSON.parse(jsonText);
        //     return questions as QuestionResponse;
        // }

        // return null
    




        //////-- first test code --//////
        // const completion = await AI.chat.completions.create({
        //     model: "mistralai/mistral-small-3.1-24b-instruct:free",
        //     messages:[
        //         { role : 'user' , content : FINAL_PROMPT }
        //     ],
        // });

        // console.log(completion.choices[0].message);
        // return completion.choices[0].message;

    }

    generateFeedback = async (conversations:{role: string, content: string}[]) => {
        const FINAL_PROMPT = FEEDBACK_PROMPT.replaceAll('{{conversation}}',JSON.stringify(conversations));

        console.log(FINAL_PROMPT,'FINAL_PROMPT-testing2');

        await new Promise(resolve => setTimeout(resolve, 2000));

        const {candidates} = await geminiModel.models.generateContent({
            model:'gemini-2.5-flash',
            contents:FINAL_PROMPT,
        })

        const feedback = aiContentToJSON<InterviewFeedbackResponse>(candidates!);
        if (feedback) {
            return feedback;
        }
        return FeedbackFallback.feedback;
        // if (candidates?.[0]?.content?.parts?.[0]?.text) {
        //     const jsonText = candidates[0].content.parts[0].text
        //         .replace(/```json\n/, '')
        //         .replace(/```/, '');
        //     const feedback = JSON.parse(jsonText);
        //     console.log(feedback);
        //     return feedback as InterviewFeedbackResponse;
        // }
        // return FeedbackFallback.feedback;
    }

    createInterview = async (data: IInterviewModel) => {
        const interview = await this._interviewRepository.createInterview(data)   
        console.log(interview,data,'test-ai-interview');
        console.log(interview.userEmail,'interview.userEmail');
        if(interview){
            const tutorIdentified = await this._userRepository.findUserByEmail(interview?.userEmail);
            if(!tutorIdentified) createHttpError(HttpStatus.NOT_FOUND, 'User not found');
            const tutorCourses = await this._courseRepository.getByInstructor((tutorIdentified?._id as string).toString());
            if(!tutorCourses) createHttpError(HttpStatus.NOT_FOUND, 'Courses not found');
    
            const studentIds = tutorCourses?.map((course) => course.students.map((student) => student.studentId.toString()));
            const uniqueStudentIds = [...new Set(studentIds.flat())];
            
            const notificationPayloadForStudents: Partial<INotificationModel> = {
                title: 'New Interview 🎯',
                message: `Your tutor has created a new ${interview.domain} interview. Duration: ${interview.duration}`,
                type: 'INTERVIEW_CREATION',
                isRead: false,
                relatedId: (interview._id as string).toString(),
                onModel: 'Interview',
            };
        
            await sendNotificationToUsers(uniqueStudentIds, notificationPayloadForStudents);
            return { success: true, message: "Successfully created interview", interviewId:interview?._id as string };
        }  
        return { success: false, message: "Failed to create interview" , interviewId:'' };                                                                                                                                                                                                                                                                                                                                                                                                              
    }

    createFeedback = async (data:IFeedbackModel ) => {
        const feedback = await this._feedbackRepository.createFeedback(data);
        if(feedback) {
            return { success: true, message: "Successfully created feedback" };
        }
        return { success: false, message: "Failed to create feedback" };
    }

    getInterview = async (id: string) => {
        return await this._interviewRepository.getInterview(id);
    }

    getTutorCreatedInterviews = async (email: string, page: number, limit: number) => {
        const { data, total} = await this._interviewRepository.getTutorCreatedInterviews(email, page, limit);
        return { data: toInterviewDTOs(data), total };
    }

    deleteInterview = async (id: string) => {
        const result = await this._interviewRepository.deleteInterview(id);
        if(result) {
            return { success: true, message: "Successfully deleted interview" };
        }
        return { success: false, message: "Failed to delete interview" };
    }

}