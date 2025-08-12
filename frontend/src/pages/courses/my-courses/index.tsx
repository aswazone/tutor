import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button";
import axiosInstance from "@/config/axios.config";
import { Loader, Play, Search, Users } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { env } from '@/config/env.config';
import { Card } from '@/components/ui/card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { GridLineHorizontal, GridLineVertical } from '@/components/common/GridLines';
import { IBoughtCourse } from '@/types/course.type';
import { Pagination } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';

const MyCourses = () => {

  const [studentBoughtCourses, setStudentBoughtCourses] = useState<IBoughtCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams,setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(Number(searchParams.get('page') || 1));
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 5; 
  const navigate = useNavigate();


  const fetchBoughtCourses = useCallback(async (pageNum = page, size = pageSize, search ='') => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/api/v1/courses/student', {
        params: { page: pageNum, limit: size, search }
      });

      setIsLoading(false);
      const { data, total } = response.data;
      console.log(data,'bought courses');
      setTotalPages(Math.ceil(total / size));
      setTotalItems(total);
      setStudentBoughtCourses(data);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching bought courses:', error);
    }
  }, [page]);

  const onPageChange = (newPage: number) => {
      setPage(newPage);
      setSearchParams({
          page: String(newPage),
          search: searchTerm
      });
  };

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setSearchTerm(val);
      setPage(1);
      setSearchParams({
          page: "1",
          search: val
      });
  };

  useEffect(()=>{
    fetchBoughtCourses(page, pageSize, searchTerm);
  },[fetchBoughtCourses, page, pageSize, searchTerm]);

  return (
    <div className="flex-col relative">
      <GridLineHorizontal className="top-13 bg-sky-700/30 w-1/2 pt-1 opacity-50"  />
      <GridLineVertical className='bg-sky-700/10 right-3 p-1.5 opacity-40'/>
      <h1 className="text-3xl font-bold mb-8 text-sky-300/70 bg-gradient-to-l from-transparent to-sky-700/20 px-15 py-2 my-0">My Courses</h1>
          <div className="absolute top-2 right-8">
            <Input value={searchTerm} onChange={onSearchChange} placeholder="Search courses..." className="w-full" />  
            <Search className="h-5 w-5 text-sky-300/60 absolute top-2 right-2" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
          {
          isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader className="animate-spin" />
              <span className="ml-2">Loading courses...</span>
            </div>
          )
          :
          
          studentBoughtCourses.length && studentBoughtCourses.length > 0 ?
            (<div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 px-15">
              { studentBoughtCourses.map((course) => 
                
                (
                  <motion.div
                    whileHover={{ y: -6 }}
                    key={course.courseId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}              
                    className="group relative"
                  >  
                    <Card className="rounded-lg pt-0 overflow-hidden border-x-2 border-sky-800/20 bg-card/50 backdrop-blur-xl hover:bg-card/80 hover:border-sky-800/50 transition-all duration-300 shadow-lg shadow-sky-900/20 gap-0 md:h-[400px]">
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
            <Pagination 
              className="mt-4 mx-14 justify-end"
              currentPage={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
              showTotal
              totalItems={totalItems}
              itemsPerPage={pageSize}
            />
      </div>
  )
}

export default MyCourses