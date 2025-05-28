import { motion } from 'framer-motion';
import { StarIcon, Clock, Users, Trash, Edit, FileCheck2, FileClock, ShieldAlert } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import {  useCallback, useEffect, useState} from 'react';
import { setActiveTab } from '@/store/auth/authSlice';
import CardSkeleton from '@/components/common/CardSkeleton';
import Loader from '@/components/ui/loader';
import { toast } from 'sonner';
import { env } from '@/config/env.config';
import { deleteCourse, fetchTutorCourses, toggleCourseStatus } from '@/store/fetch';
import { DeleteConfirmDialog } from '@/components/common/DeleteConfirmDialog';
import { setEditMode } from '@/store/course';


export const TutorCoursesTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [toggleLoading, setToggleLoading] = useState<string>('');
  const [openDailog, setOpenDailog] = useState(false);
  const [tooltipStates, setTooltipStates] = useState<{ [key: string]: boolean }>({});


  useEffect(() => {
    dispatch(fetchTutorCourses());
  }, [dispatch]);


  const { items: courses, isLoading } = useSelector((state:RootState ) => state.fetch);

  const handleToggleStatus = useCallback(async (courseId: string, currentStatus: boolean) => {
    try {
      setToggleLoading(courseId);
    
      await dispatch(toggleCourseStatus({ courseId, status: !currentStatus })).unwrap();
      await dispatch(fetchTutorCourses()).unwrap();
      
      toast.success(`Course ${!currentStatus ? 'published' : 'drafted'} successfully`);
    } catch (error) {

      toast.error('Failed to update course status');
      console.error('Toggle status error:', error);
    } finally {
      setToggleLoading('');
    }
  }, [dispatch]);
  const handleDelete = useCallback(async (courseId: string) => {
    try {
      setToggleLoading(courseId);
    
      await dispatch(deleteCourse(courseId)).unwrap();
      await dispatch(fetchTutorCourses()).unwrap();
      
      toast.success(`Course deleted successfully`);
    } catch (error) {

      toast.error('Failed to update course status');
      console.error('Toggle status error:', error);
    } finally {
      setToggleLoading('');
    }
  }, [dispatch]);
  const handleEditCourse = (courseId: string) => {
    // toast(`Editing course with ID: ${courseId}`);
    dispatch(setActiveTab('create-course'));
    dispatch(setEditMode({status:true,courseId:courseId}));
  }

  const handleMouseEnter = (courseId:string) => {
    setTooltipStates((prevStates) => ({ ...prevStates, [courseId]: true }));
  };

  const handleMouseLeave = (courseId:string) => {
    setTooltipStates((prevStates) => ({ ...prevStates, [courseId]: false }));
  };



  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="flex items-center mt-2 animate-caret-blink text-sky-400/30">
          <Loader className="mr-2 text-sky-400/50"/>
          Loading courses...
        </div>
      </div>
    );
  }

  if (!courses?.length) {
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
      <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => {
                   
          return (
            <motion.div
              
              whileHover={{ y: -6 }}
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}              
              className="group relative"
            >
              
              <motion.div
                
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleStatus(course?._id, course?.isPublished);
                }}
                whileHover={{ y: [0, -5, 0] }}
                onMouseEnter={() => handleMouseEnter(course._id)}
                onMouseLeave={() => handleMouseLeave(course._id)}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className={`absolute z-30 -top-2 -left-2 shadow-xl bg-gradient-to-br ${
                  course?.isActive ?
                    course?.isPublished  
                    ? 'from-green-500/70 border-green-500/50 to-green-800/40' 
                    : 'from-amber-500/40 border-amber-500/20 to-amber-800/10'
                  : 'from-red-500/40 border-red-500/20 to-red-800/10 pointer-events-none'
                } border-r-2 border-b-1 rounded-b-2xl rounded-tr-2xl p-2`}
              >
                 {course.isActive && tooltipStates[course._id] && (
                    <Badge variant={'outline'} className="w-[95px] text-center absolute top-0 left-25 md:-top-2 md:-left-15 transform -translate-x-1/2 text-xs rounded py-0.5 px-2">
                      {course?.isPublished ? 'Published' : 'Draft'}
                    </Badge>
                  )}
                {toggleLoading === course._id ? (
                  <Loader className="w-4 h-4" />
                ) : (
                  course?.isActive ?
                    course?.isPublished 
                    ? <FileCheck2 size={15} /> 
                    : <FileClock size={15} />
                  : <ShieldAlert size={15} />
                )}
              </motion.div>
              <Card className={
                course.isVerified && course.isActive
                ? `pt-0 overflow-hidden border-border/60 bg-card/50 backdrop-blur-xl hover:bg-card/80 hover:border-sky-500/20 transition-all duration-300`
                : 'grayscale-50 opacity-50 pt-0 overflow-hidden border-border/60 bg-card/50 backdrop-blur-xl hover:bg-card/80 hover:border-sky-500/20 transition-all duration-300'}>
                <DeleteConfirmDialog  
                    title="Delete course"
                    description="Are you sure you want to delete this course?" 
                    onConfirm={() => handleDelete(course._id)}
                    open={openDailog}
                    onClose={() => setOpenDailog(false)} 
                />
                <div className="relative aspect-video overflow-hidden">
                  {!course.isVerified && <Badge className='absolute z-20 top-20 left-20 bg-black/50 text-white'><Loader className="w-4 h-4" /> Verifying...</Badge>}
                  {!course.isActive && <Badge variant={'destructive'} className='absolute z-20 top-20 left-23 bg-black/50 text-white'>Blocked</Badge>}
                  {course.isVerified && 
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDailog(true);
                    }}

                    className="absolute z-20 top-10 right-2 w-8 h-8 p-0 bg-black/50 rounded-full hover:bg-red-900/50"
                    variant="ghost"
                  > 
                    
                    <Trash size={16}/>
                  </Button>}             
                  {course.isVerified && 
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(course)
                      handleEditCourse(course._id);
                    }}
                    className="absolute z-20 top-20 right-2 w-8 h-8 p-0 bg-black/50 rounded-full hover:bg-red-900/50"
                    variant="ghost"
                  >
                    <Edit size={16}/>
                  </Button>}
                          
                  <img
                    src={`${env.AMZ_BUCKET_NAME}/${course.thumbnailKey}`}
                    alt={course.title}
                    loading="lazy"
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20" />
                  <Badge 
                    className="absolute top-2 right-2 uppercase text-[9px] py-0.4 px-2"
                    variant={course.level === 'beginner' ? 'default' : 
                            course.level === 'intermediate' ? 'secondary' : 'destructive'}
                  >
                    {course.level}
                  </Badge>
                </div>
                
                <div className="px-4 space-y-4 py-4">
                  <h3 className="font-bold text-lg line-clamp-2">{course.title}</h3>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{course.modules.length} Modules</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>42 Students</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-2.5 w-2.5 ${
                            i < Math.floor(Number(course.rating || 0))
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1">
                      {/* <GraduationCap className="h-4 w-4" /> */}
                      <Badge variant="secondary" className="rounded-sm w-full text-[10px]">
                        {course.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">                    
                    <span className="font-semibold">₹ {course.pricing}</span>
                    <Button size='sm' className="opacity-0 group-hover:opacity-100 transition-opacity" variant={'outline'} onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/course/${course._id}`);
                    }}>
                      View Course
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );



}