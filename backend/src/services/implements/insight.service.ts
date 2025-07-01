import { ICourseRepository } from "@/repositories/interface/course.repository.interface";
import { ICourseProgressRepository } from "@/repositories/interface/courseProgress.repository.interface";
import { IStudentCoursesRepository } from "@/repositories/interface/studentCourses.repository.interface";
import { IInsightService } from "../interface/insight.service.interface";
import { ICourseInsights } from "@/types/course.type";
import { IUserRepository } from "@/repositories/interface/user.repository.interface";

export class InsightService implements IInsightService {
  constructor(
    private readonly _courseRepository: ICourseRepository,
    private readonly _courseProgressRepository: ICourseProgressRepository,
    private readonly _studentCourseRepository: IStudentCoursesRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  getSingleCourseInsights = async (tutorId: string, courseId: string): Promise<ICourseInsights> => {
    const course = await this._courseRepository.getById(courseId, { path: "tutor modules.chapters" });
    if (!course) throw new Error("Course not found");

    const studentCourses = await this._studentCourseRepository.getAllStudentCourses();
    const progressDocs = await this._courseProgressRepository.getAllCourseProgress();

    // Filter relevant student enrollments for this tutor & course
    const studentsForCourse = studentCourses.flatMap(studentDoc =>
      studentDoc.courses.filter(
        c => c.courseId === courseId && c.tutorId === tutorId
      ).map(c => ({
        studentId: studentDoc.studentId,
        dateOfPurchase: new Date(c.dateOfPurchase)
      }))
    );

    const enrolledStudents = studentsForCourse.length;
    const totalRevenue = course.students.reduce((sum, s) => {
        const amountForTutor = Number(s.paidAmount) * 0.9;
        return sum + amountForTutor;
    }, 0);

    // Filter relevant progress docs
    const progressForCourse = progressDocs.filter(
      p => p.courseId === courseId &&
           studentsForCourse.some(s => s.studentId === p.studentId)
    );

    // Total chapters in the course
    const totalChapters = course.modules.reduce(
      (sum, m) => sum + (m.chapters?.length || 0),
      0
    );

    // Average completion rate
    const completions = progressForCourse.map(p => {
      let viewed = 0;
      p.moduleProgress?.forEach(m =>
        m.chapterProgress?.forEach(ch => { if (ch.viewed) viewed++; })
      );
      return totalChapters > 0 ? (viewed / totalChapters) * 100 : 0;
    });
    const avgCompletion = completions.length > 0 ?
      completions.reduce((a, b) => a + b, 0) / completions.length : 0;

    // Active students this week
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const activeStudentsThisWeek = progressForCourse.filter(
      p => new Date(p.lastAccessed) >= oneWeekAgo
    ).length;

    // Module progress
    const moduleMap = new Map();
    progressForCourse.forEach(p => {
      p.moduleProgress?.forEach(m => {
        const chaptersViewed = m.chapterProgress?.filter(ch => ch.viewed).length || 0;
        const totalChaptersInModule = course.modules.find(mod => mod.id === m.moduleId)?.chapters.length || 0;
        const percent = totalChaptersInModule ? (chaptersViewed / totalChaptersInModule) * 100 : 0;

        if (!moduleMap.has(m.moduleId)) {
          moduleMap.set(m.moduleId, []);
        }
        moduleMap.get(m.moduleId).push(percent);
      });
    });

    const moduleProgress = Array.from(moduleMap.entries()).map(([moduleId, percents]) => ({
      module: course.modules.find(m => m.id === moduleId)?.title || "Unknown",
      completion: Math.round(percents.reduce((a: number, b: number) => a + b, 0) / percents.length)
    }));

    const mostActiveModule =
      moduleProgress.sort((a, b) => b.completion - a.completion)[0]?.module || "";

    // Weekly trends
    const week1Start = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const week2Start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weeklyTrends = [
      {
        week: "Week 1",
        activeStudents: progressForCourse.filter(p =>
          new Date(p.lastAccessed) >= week1Start && new Date(p.lastAccessed) < week2Start
        ).length,
        newEnrollments: studentsForCourse.filter(s =>
          s.dateOfPurchase >= week1Start && s.dateOfPurchase < week2Start
        ).length,
      },
      {
        week: "Week 2",
        activeStudents: progressForCourse.filter(p =>
          new Date(p.lastAccessed) >= week2Start
        ).length,
        newEnrollments: studentsForCourse.filter(s =>
          s.dateOfPurchase >= week2Start
        ).length,
      }
    ];

    // Dummy feedback — replace with real feedback if you have reviews
    const feedback = [
      "Clear explanations and good pace.",
      "Very practical examples — helpful for beginners!"
    ];

    

    const insight:ICourseInsights = {
      courseId: course._id as string,
      courseTitle: course.title,
      enrolledStudents,
      totalRevenue,
      activeStudentsThisWeek,
      completionRate: Math.round(avgCompletion),
      averageRating: course.rating || 4.5,
      mostActiveModule,
      mostRewatchedChapter: course.modules[0]?.chapters[0]?.title || "",
      feedback,
      weeklyTrends,
      moduleProgress
    };

    return insight;
  };

  getTutorDashboardInsights = async(tutorId: string):Promise<{noOfCourses: number, enrolledStudents: number, tutorRating: number}> => {
    
    console.log(tutorId,'===getTutorDashboardInsights');

    const course = await this._courseRepository.getByInstructor(tutorId);
    const noOfCourses = course.length;
    const enrolledStudents = course.reduce((sum, c) => sum + c.students.length, 0);
    const tutorRating = course.reduce((sum, c) => sum + (c.rating || 0), 0) / course.length;

    return {
      noOfCourses,
      enrolledStudents,
      tutorRating
    };
  };


  getStudentDashboardInsights = async(studentId: string):Promise<{enrolled: number, wishlist: number, completed: number}> => {

    const studentdata = await this._userRepository.findUserById(studentId);
    const studentCourses = await this._studentCourseRepository.getStudentCourses(studentId);
    const studentCourseProgress = await this._courseProgressRepository.getAllCourseProgress();

    const enrolled = studentCourses?.courses?.length || 0;
    const wishlist = studentdata?.wishlist?.length || 0;
    const completed = studentCourseProgress.reduce((sum, progress) => sum + (progress.studentId === studentId && progress.completed ? 1 : 0), 0);
    
    console.log(studentId,'===getStudentDashboardInsights');
    return {
      enrolled,
      wishlist,
      completed
    }
    
  };

}