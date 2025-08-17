import { IStudentCoursesRepository } from "@/repositories/interface/studentCourses.repository.interface";
import { ICourseProgressRepository } from "@/repositories/interface/courseProgress.repository.interface";
import { ICourseProgressService } from "../interface/courseProgress.service.interface";
import { HttpError } from "@/utils/http-error.utils";
import { HttpStatus } from "@/constants/status.constant";
import { Types } from "mongoose";
import { ICourseRepository } from "@/repositories/interface/course.repository.interface";
import { ICourseProgressResponse, IIntialCourseProgressResponse } from "@/types/courseProgress.type";
import { CourseProgressModel } from "@/models/implements/courseProgress.model";
import { ICourseProgressModel } from "@/models/interface/courseProgress.model.interface";

export class CourseProgressService implements ICourseProgressService {

    constructor(
        private readonly _courseRepository: ICourseRepository,
        private readonly _courseProgressRepository: ICourseProgressRepository,
        private readonly _studentCourseRepository: IStudentCoursesRepository
    ) {}

    getCurrentCourseProgress = async (userId: string, courseId: string): Promise<ICourseProgressResponse | {isPurchased: boolean, message: string} | IIntialCourseProgressResponse> => {
        if (!Types.ObjectId.isValid(courseId)) 
            throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid course id');
        if (!Types.ObjectId.isValid(userId)) 
            throw new HttpError(HttpStatus.BAD_REQUEST, 'Invalid user id');
        
          const studentCourses = await this._studentCourseRepository.getStudentCourses(userId)
          const course = await this._courseRepository.getById(courseId,{path:'tutor'})
          const progress = await this._courseProgressRepository.getCurrentUserCourseProgress(userId, courseId)
        

        // if (!studentCourses) throw new HttpError(HttpStatus.NOT_FOUND, 'Student courses not found');
        if (!course) throw new HttpError(HttpStatus.NOT_FOUND, 'Course not found');

        const isPurchased = studentCourses?.courses.some(c => 
            c.courseId.toString() === courseId
        );

        console.log('check isPurchased:', isPurchased);

        if (!isPurchased) {
            return {
                isPurchased: false,
                message: 'You have not purchased this course!'
            };
        }

        // console.log('isPurchased:', isPurchased);

        // If no progress exists yet, initialize with course structure
        if (!progress || progress.moduleProgress.length === 0) {

            const initialProgress: IIntialCourseProgressResponse = {
                courseDetails: course,
                progress: {
                    studentId: userId,
                    courseId: courseId,
                    moduleProgress: [],
                    completed: false,
                    lastAccessed: new Date(),
                },
                isPurchased: true,
                overallProgress: 0,
                moduleCompletionStatus: course.modules.map(module => ({
                    moduleId: module.id,
                    completed: false
                })),
                lastAccessed: new Date()
            }

            return initialProgress;
        }

        // Calculate progress metrics
        const progressData = {
            courseDetails: course,
            progress: progress,
            isPurchased: true,
            overallProgress: progress.getProgressPercentage(),
            moduleCompletionStatus: course.modules.map(module => ({
                moduleId: module.id,
                completed: progress.isModuleCompleted(module.id)
            })),
            lastAccessed: progress.lastAccessed
        };

        return progressData;
    };

    markCurrentChapterAsViewed = async (userId: string, courseId: string, chapterId: string, moduleId: string): Promise<ICourseProgressResponse> => {
        let progress = await this._courseProgressRepository.getCurrentUserCourseProgress(userId, courseId);
        const course = await this._courseRepository.getById(courseId);



        if (!course) throw new HttpError(HttpStatus.NOT_FOUND, 'Course not found');
        if (!progress || progress.moduleProgress.length === 0) {
            console.log('-----if ');

            const newProgress =  new CourseProgressModel({
                    studentId: userId,
                    courseId: courseId,
                    moduleProgress: [
                        {
                            moduleId: moduleId,
                            viewed: true,
                            dateViewed: new Date(),
                            chapterProgress: [
                                {
                                    chapterId: chapterId,
                                    viewed: true,
                                    dateViewed: new Date()
                                }
                            ]
                        }
                    ],
                    getProgressPercentage: () => 0,
                    isModuleCompleted: () => false,
                    completed: false,
                    lastAccessed: new Date(),
            })
            
            // if(!progress) throw new HttpError(HttpStatus.NOT_FOUND, 'Progress not found');
            progress = await this._courseProgressRepository.createProgress(newProgress);
            await progress.save();

        } else {
            const moduleIndex = progress.moduleProgress.findIndex(module => module.moduleId === moduleId);
            console.log(moduleIndex, 'moduleIndex-else case');
            if (moduleIndex === -1) {
                progress.moduleProgress.push({
                    moduleId: moduleId,
                    viewed: true,
                    dateViewed: new Date(),
                    chapterProgress: [
                        {
                            chapterId: chapterId,
                            viewed: true,
                            dateViewed: new Date()
                        }
                    ]
                });
            } else {
                const chapterIndex = progress.moduleProgress[moduleIndex].chapterProgress.findIndex(chapter => chapter.chapterId === chapterId);
                if (chapterIndex === -1) {
                    progress.moduleProgress[moduleIndex].chapterProgress.push({
                        chapterId: chapterId,
                        viewed: true,
                        dateViewed: new Date()
                    });
                } else {
                    progress.moduleProgress[moduleIndex].chapterProgress[chapterIndex].viewed = true;
                    progress.moduleProgress[moduleIndex].chapterProgress[chapterIndex].dateViewed = new Date();
                }
            }
            await progress.save();
        }


        const lengthOfChapterInCourseData = course.modules.reduce((total, module) => total + module.chapters.length, 0);
        const lengthOfChapterInProgressData = progress.moduleProgress.reduce((total, module) => total + module.chapterProgress.length, 0);
        const allChaptersViewed = lengthOfChapterInCourseData === lengthOfChapterInProgressData && progress.moduleProgress.every(module => module.chapterProgress.every(chapter => chapter.viewed ));

        if(allChaptersViewed){
            progress.completed = true;
            progress.completionDate = new Date();
            
            await progress.save();
        }

        console.log(progress, 'progress-updated-backend-------');


        return {
            courseDetails: course,
            progress: progress,
            isPurchased: true,
            overallProgress: progress.getProgressPercentage(),
            moduleCompletionStatus: course.modules.map(module => ({
                moduleId: module.id,
                completed: progress.isModuleCompleted(module.id)
            })),
            lastAccessed: progress.lastAccessed
        };
        

    }

    resetCurrentCourseProgress = async(userId: string, courseId: string): Promise<IIntialCourseProgressResponse> => {
        const progress = await this._courseProgressRepository.getCurrentUserCourseProgress(userId, courseId);
        const course = await this._courseRepository.getById(courseId);
        if (!progress) throw new HttpError(HttpStatus.NOT_FOUND, 'Progress not found');
        if (!course) throw new HttpError(HttpStatus.NOT_FOUND, 'Course not found');

        await this._courseProgressRepository.resetProgress(progress?._id as string)

        const resetData = {
            courseDetails: course,
            progress: {
                studentId: userId,
                courseId: courseId,
                moduleProgress: [],
                completed: false,
                lastAccessed: new Date(),
            },
            isPurchased: true,
            overallProgress: progress.getProgressPercentage(),
            moduleCompletionStatus: course.modules.map(module => ({
                moduleId: module.id,
                completed: progress.isModuleCompleted(module.id)
            })),
            lastAccessed: progress.lastAccessed
        };


        return resetData;
    }

    updateStageAndProgress = async(userId: string, courseId: string, data:Partial<ICourseProgressModel>): Promise<ICourseProgressModel | null> => {
        return await this._courseProgressRepository.updateStageAndProgress(userId, courseId, data);
    }
}