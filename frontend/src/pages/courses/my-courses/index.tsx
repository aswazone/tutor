import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button";
import axiosInstance from "@/config/axios.config";
import { Play, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { env } from '@/config/env.config';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface IBoughtCourse {
  _id: string;
 courseId: string;
 title: string;
 courseImage: string;
 dateOfPurchase: string;
 tutorId: string;
 tutorName: string;
}


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

  if(!studentBoughtCourses){
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">
        <p>No Enrolled Courses found</p>
        <Button 
          variant="link" 
          onClick={() => navigate('/courses')}
          className="mt-2"
        >
          Explore !!
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>
         
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
              {studentBoughtCourses && studentBoughtCourses.length > 0 && 
              studentBoughtCourses.map((course) => 
                
                (
                  <motion.div
                    whileHover={{ y: -6 }}
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}              
                    className="group relative"
                  >  
                    <Card className="pt-0 overflow-hidden border-border/60 bg-card/50 backdrop-blur-xl hover:bg-card/80 hover:border-sky-800/50 transition-all duration-300">
                      <div className="relative aspect-video overflow-hidden">
                                    
                        <img
                          src={`${env.AMZ_BUCKET_NAME}/${course.courseImage}`}
                          alt={course.title}
                          loading="lazy"
                          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20" />
                      </div>
                      
                      <div className="px-4 space-y-4 py-4">
                        <h3 className="font-bold h-12 text-lg line-clamp-2">{course.title}</h3>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>Tutor: {course.tutorName}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <Button size='sm' className="text-sky-500 opacity-60 grayscale-20 group-hover:opacity-100 hover:grayscale-0 transition-opacity" variant={'outline'} onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/course/${course._id}`);
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
          </motion.div>
        
      </div>
    // </div>
  )
}

export default MyCourses