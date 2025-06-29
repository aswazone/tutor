import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button";
import axiosInstance from "@/config/axios.config";
import { Play, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { env } from '@/config/env.config';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
// import { BackgroundBeamsWithCollision } from '@/components/magicui/background-beam';
import { GridLineHorizontal, GridLineVertical } from '@/components/common/GridLines';
import { IBoughtCourse } from '@/types/course.type';

const MyCourses = () => {

  const [studentBoughtCourses, setStudentBoughtCourses] = useState<IBoughtCourse[]>([]);
  console.log(studentBoughtCourses,'student-bought-courses');
  const navigate = useNavigate();

  useEffect(()=>{

    const fetchBoughtCourses = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/courses/student');
        setStudentBoughtCourses(response.data.courses);
      } catch (error) {
        console.error('Error fetching bought courses:', error);
      }
    };

    fetchBoughtCourses();

  },[])

  return (
    // <BackgroundBeamsWithCollision className='bg-gradient-to-tl from-sky-700/12 to-100% from-5% to-sky-950/15 h-screen md:h-[43rem] flex items-start'>
    <div className="flex-col">
      <GridLineHorizontal className="top-13 bg-sky-700/30 w-1/2 pt-1 opacity-50"  />
      <GridLineVertical className='bg-sky-700/10 right-3 p-1.5 opacity-40'/>
      <h1 className="text-3xl font-bold mb-8 text-sky-300/70 bg-gradient-to-l from-transparent to-sky-700/20 px-15 py-2 my-0">My Courses</h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
          {studentBoughtCourses.length && studentBoughtCourses.length > 0 ?
            (<div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 px-15">
              { studentBoughtCourses.map((course) => 
                
                (
                  <motion.div
                    whileHover={{ y: -6 }}
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}              
                    className="group relative"
                  >  
                    <Card className="rounded-lg pt-0 overflow-hidden border-x-2 border-sky-800/20 bg-card/50 backdrop-blur-xl hover:bg-card/80 hover:border-sky-800/50 transition-all duration-300 shadow-lg shadow-sky-900/20 gap-0">
                      <div className="relative aspect-video overflow-hidden">
                                    
                        <img
                          src={`${env.AMZ_BUCKET_NAME}/${course.courseImage}`}
                          alt={course.title}
                          loading="lazy"
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20" />
                      </div>
                      
                      <div className="px-4 space-y-4 py-4 bg-gradient-to-b from-background to-transparent">
                        <h3 className="font-bold h-15 text-lg line-clamp-2">{course.title}</h3>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>Tutor: {course.tutorName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <Button size='sm' className="text-sky-500 opacity-60 grayscale-20 group-hover:opacity-100 hover:grayscale-0 transition-opacity" variant={'outline'} onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/course-progress/${course.courseId}`);
                            }}>
                              <Play className="h-4 w-4 mr-2 text-sky-500" />
                              Watch
                            </Button>
                          </div>
                          <div className="flex items-center gap-1">
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
            </div>
            )
            :
            (
              <div className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">
                <p className='text-xl text-sky-200/60'>~ No Enrolled Courses ~</p>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/courses')}
                  className="mt-4"
                >
                  Browse Courses <span className='animate-caret-blink'>✨</span>
                </Button>
              </div>
            )
            }

          </motion.div>
        
      </div>
    // </BackgroundBeamsWithCollision>
  )
}

export default MyCourses