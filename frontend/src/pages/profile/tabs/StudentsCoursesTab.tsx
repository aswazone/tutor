import { motion } from 'framer-motion'
import { StarIcon, Clock, Users, GraduationCap } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ICourse } from '@/types/course.type'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axiosInstance from '@/config/axios.config'
import { setActiveTab } from '@/store/auth/authSlice'
import CardSkeleton from '@/components/common/CardSkeleton'
import Loader from '@/components/ui/loader'

// const mockCourses: ICourse[] = [
//   {
//     _id: "6829ec1838254c892a477604",
//     title: "Javascript - Beginner to Advance",
//     category: "web-development",
//     level: "advanced",
//     primaryLanguage: "japanese",
//     subtitle: "Master Modern JavaScript",
//     description: "Master Modern JavaScript — the most essential language for web development!",
//     pricing: "2000",
//     objectives: "Understand the basics of Frontend using Javascript.",
//     welcomeMessage: "Welcome to All Feature Developer !!",
//     thumbnailKey: "course-thumbnails/1747577879983-Gemini_Generated_Image_6uxkjz6uxkjz6uxk.png",
//     modules: [],
//     tutor: "6829dba238254c892a477602",
//     isPublished: false,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   },
//   {
//     _id: "6829ec1838254c892a477605",
//     title: "React & Next.js Masterclass",
//     category: "web-development",
//     level: "intermediate",
//     primaryLanguage: "english",
//     subtitle: "Build Modern Web Apps",
//     description: "Learn to build modern web applications with React and Next.js",
//     pricing: "2500",
//     objectives: "Master React and Next.js fundamentals",
//     welcomeMessage: "Welcome to React Journey!",
//     thumbnailKey: "course-thumbnails/1747577879983-Gemini_Generated_Image_6uxkjz6uxkjz6uxk.png",
//     modules: [],
//     tutor: "6829dba238254c892a477602",
//     isPublished: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   },
//   {
//     _id: "6829ec1838254c892a477606",
//     title: "Python for Data Science",
//     category: "data-science",
//     level: "beginner",
//     primaryLanguage: "japanese",
//     subtitle: "Data Analysis with Python",
//     description: "Learn Python for Data Science from scratch",
//     pricing: "1800",
//     objectives: "Learn Python basics and data analysis",
//     welcomeMessage: "Welcome to Data Science!",
//     thumbnailKey: "course-thumbnails/1747577879983-Gemini_Generated_Image_6uxkjz6uxkjz6uxk.png",
//     modules: [],
//     tutor: "6829dba238254c892a477602",
//     isPublished: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   },
//   {
//     _id: "6829ec1838254c892a477607",
//     title: "TypeScript Deep Dive",
//     category: "programming",
//     level: "advanced",
//     primaryLanguage: "english",
//     subtitle: "Advanced TypeScript Concepts",
//     description: "Master TypeScript for large-scale applications",
//     pricing: "2200",
//     objectives: "Advanced TypeScript features and patterns",
//     welcomeMessage: "Welcome to TypeScript Journey!",
//     thumbnailKey: "course-thumbnails/1747577879983-Gemini_Generated_Image_6uxkjz6uxkjz6uxk.png",
//     modules: [],
//     tutor: "6829dba238254c892a477602",
//     isPublished: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   },
//   {
//     _id: "6829ec1838254c892a477608",
//     title: "Machine Learning Fundamentals",
//     category: "machine-learning",
//     level: "intermediate",
//     primaryLanguage: "english",
//     subtitle: "Practical ML with Python",
//     description: "Build real-world machine learning models from scratch",
//     pricing: "2800",
//     objectives: "Understanding ML algorithms and implementation",
//     welcomeMessage: "Welcome to the world of Machine Learning!",
//     thumbnailKey: "course-thumbnails/1747577879983-Gemini_Generated_Image_6uxkjz6uxkjz6uxk.png",
//     modules: [],
//     tutor: "6829dba238254c892a477602",
//     isPublished: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   },
//   {
//     _id: "6829ec1838254c892a477609",
//     title: "Cloud Architecture on AWS",
//     category: "cloud-computing",
//     level: "advanced",
//     primaryLanguage: "japanese",
//     subtitle: "Enterprise Cloud Solutions",
//     description: "Design and implement scalable cloud architectures on AWS",
//     pricing: "3000",
//     objectives: "Master AWS services and cloud architecture patterns",
//     welcomeMessage: "Welcome to Cloud Architecture Mastery!",
//     thumbnailKey: "course-thumbnails/1747577879983-Gemini_Generated_Image_6uxkjz6uxkjz6uxk.png",
//     modules: [],
//     tutor: "6829dba238254c892a477602",
//     isPublished: true,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   },
//   {
//     _id: "6829ec1838254c892a477610",
//     title: "Mobile Development with Flutter",
//     category: "mobile-development",
//     level: "beginner",
//     primaryLanguage: "english",
//     subtitle: "Cross-platform Mobile Apps",
//     description: "Create beautiful mobile applications with Flutter",
//     pricing: "2100",
//     objectives: "Learn Flutter and Dart programming for mobile development",
//     welcomeMessage: "Welcome to Flutter Development!",
//     thumbnailKey: "course-thumbnails/1747577879983-Gemini_Generated_Image_6uxkjz6uxkjz6uxk.png",
//     modules: [],
//     tutor: "6829dba238254c892a477602",
//     isPublished: false,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString()
//   }
// ];

export const StudentsCoursesTab = () => {

  const dispatch = useDispatch<AppDispatch>();
  const [mockCourses, setMockCourses] = useState<ICourse[]>([]);

  useEffect(() => {
    const reponse = axiosInstance.get('/api/v1/courses/public');

    reponse.then((res) => {
      console.log(res.data);
      setMockCourses(res.data);
    });

  }, []);



  const navigate = useNavigate();
  const { isLoading } = useSelector((state: RootState) => ({
    isLoading: state.course.courseEditor.uploadStatus === 'uploading'
  }));

  if (isLoading) {
    return (
      <>
      <div className='grid grid-cols-3 gap-4'>
        <CardSkeleton/>
        <CardSkeleton/>
        <CardSkeleton/>
      </div>
      <div className='flex items-center mt-2 animate-caret-blink text-sky-400/30'>
        <Loader className='mr-2 text-sky-400/50'/>
        Loading..
      </div>
      </>
    );
  }

  if (!mockCourses?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">
        <p>No courses found</p>
        <Button 
          variant="link" 
          onClick={() => dispatch(setActiveTab("public-course"))}
          className="mt-2"
        >
          Go and Explore !!
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockCourses.map((course: ICourse) => (
          <motion.div
            whileHover={{ y: -6 }}
            key={course._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{  type: "spring", stiffness: 300, damping: 10 }}
            className="group cursor-pointer"
            onClick={() => navigate(`/course/${course._id}`)}
          >
            <Card className="pt-0 overflow-hidden border-border/60 bg-card/50 backdrop-blur-xl hover:bg-card/80 hover:border-sky-500/20 transition-all duration-300">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={`https://lms-upload-s3-bucket.s3.eu-north-1.amazonaws.com/${course.thumbnailKey}`}
                  alt={course.title}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20" />
                <Badge 
                  className="absolute top-2 right-2 uppercase"
                  variant={course.level === 'beginner' ? 'default' : 
                          course.level === 'intermediate' ? 'secondary' : 'destructive'}
                >
                  {course.level}
                </Badge>
              </div>
              
              <div className="px-4 space-y-4">
                <h3 className="font-bold text-lg line-clamp-2">{course.title}</h3>
                
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.modules.length} Modules</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>42 Students</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 text-yellow-500" />
                    <span>4.5 Rating</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    <span>{course.primaryLanguage}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">₹ {course.pricing}</span>
                  </div>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    View Course
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}