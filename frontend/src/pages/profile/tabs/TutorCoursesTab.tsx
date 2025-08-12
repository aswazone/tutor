import { motion } from 'framer-motion';
import { StarIcon, Clock, Users, Trash, Edit, FileCheck2, FileClock, ShieldAlert, BarChart, Search} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {  ChangeEvent, useCallback, useEffect, useState} from 'react';
import { setActiveTab } from '@/store/auth/authSlice';
import CardSkeleton from '@/components/common/CardSkeleton';
import Loader from '@/components/ui/loader';
import { toast } from 'sonner';
import { env } from '@/config/env.config';
import { deleteCourse, fetchTutorCourses, toggleCourseStatus } from '@/store/fetch';
import { setEditMode } from '@/store/course';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import CustomAlert from '@/components/common/CustomAlert';
import axiosInstance from '@/config/axios.config';
import { format } from 'date-fns';
import CourseInsightsModal from '@/components/course/CourseInsightModal';
import { ICourseInsights } from '@/types/course.type';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/ui/pagination';




export const TutorCoursesTab = () => {
  const [searchParams,setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const searchTerm = searchParams.get('search') || '';
  const id = searchParams.get('id');
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 3;

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [toggleLoading, setToggleLoading] = useState<string>('');
  const [tooltipStates, setTooltipStates] = useState<{ [key: string]: boolean }>({});
  const [courseInsight, setCourseInsight] = useState<ICourseInsights | null>(null);
  const [isDataFetching, setIsDataFetching] = useState(false);
  const [isPeek, setIsPeek] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {

    if(id !== null && id !== user?._id){
      setIsPeek(true);
    }

    const payload = {
      id: id || user?._id || '',
      page,
      limit: pageSize,
      search: searchTerm
    }
    
    const result = dispatch(fetchTutorCourses(payload)).unwrap();
      result.then(({total}) => {
        setTotalPages(Math.ceil(total/pageSize))
        setTotalItems(total)
      })
  }, [dispatch,id,user,searchTerm,page]);

  const onPageChange = (newPage: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', String(newPage));
      if (id) params.set('id', id); 
      setSearchParams(params);
  };

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      const params = new URLSearchParams(searchParams);
      params.set('search', val);
      params.set('page', '1'); 
      if (id) params.set('id', id); 
      setSearchParams(params);
  };


  const getAllStudentsProgress = async (courseId: string, tutorId: string) => {
      try {
          const response = await axiosInstance.get(`/api/v1/insights/${tutorId}/${courseId}`);
          return response.data;
      } catch (error) {
          console.log(error);
      }
  };

  const { items: courses, isLoading } = useSelector((state:RootState ) => state.fetch);
  const handleToggleStatus = useCallback(async (courseId: string, currentStatus: boolean) => {
    try {
      setToggleLoading(courseId);
    
      await dispatch(toggleCourseStatus({ courseId, status: !currentStatus })).unwrap();
      await dispatch(fetchTutorCourses({id:'',page:page,limit:pageSize,search:searchTerm})).unwrap();
      
      toast.success(`Course ${!currentStatus ? 'published' : 'drafted'} successfully`);
    } catch (error) {

      toast.error('Failed to update course status');
      console.error('Toggle status error:', error);
    } finally {
      setToggleLoading('');
    }
  }, [dispatch,page,searchTerm]);

  const handleDelete = useCallback(async (courseId: string) => {
    try {
      setToggleLoading(courseId);
      toast("Are you sure you want to delete this course ?",{
          position: "top-right",
          className: "mt-10",
          action: {
              label: "Delete",
              onClick: async () => {
                  await dispatch(deleteCourse(courseId)).unwrap();
                  await dispatch(fetchTutorCourses({id:''})).unwrap();
                  toast.success('Course deleted successfully');
              }
          }
      });
    } catch (error) {

      toast.error('Failed to update course status');
      console.error('Toggle status error:', error);
    } finally {
      setToggleLoading('');
    }
  }, [dispatch]);

  const handleEditCourse = (courseId: string) => {
    dispatch(setActiveTab('create-course'));
    dispatch(setEditMode({status:true,courseId:courseId}));
  }

  const handleDashboardCourse = async (courseId: string) => {
    try {
      if(user){
        setIsDataFetching(true);
        const insights = await getAllStudentsProgress(courseId, user._id);
        setIsDataFetching(false);
        setCourseInsight(insights);
      }
    } catch (error) {
      setIsDataFetching(false);
      console.log(error);
    }
  }

  const handleMouseEnter = (courseId:string) => {
    setTooltipStates((prevStates) => ({ ...prevStates, [courseId]: true }));
  };

  const handleMouseLeave = (courseId:string) => {
    setTooltipStates((prevStates) => ({ ...prevStates, [courseId]: false }));
  };

  const handleVerifyRequest = async(courseId: string, isVerified: string, rejectReason?: string) =>{

    console.log(courseId, isVerified, rejectReason);
    
    try {
      toast('Requested..');
      await axiosInstance.patch(`/api/v1/courses/${courseId}/verify/${isVerified}`, { rejectReason });
      await dispatch(fetchTutorCourses({id:''})).unwrap();
    } catch (error) {
      toast.error('Failed to update course status');
      console.error('Toggle status error:', error);
    }

  }

  return (
  <div>
    <div className="flex absolute -top-35 right-5">
      <Input value={searchTerm} onChange={onSearchChange} placeholder="Search Courses..." className="w-full" /> 
      <Search className="text-sky-400/50 h-4 w-4 absolute cursor-pointer right-2 top-1/2 transform -translate-y-1/2" /> 
    </div>
    {isLoading ? 
      (<div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
         {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="flex items-center mt-2 animate-caret-blink text-sky-400/30">
          <Loader className="mr-2 text-sky-400/50"/>
          Loading courses...
        </div>
      </div>
    )
    :
    (<motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {isDataFetching && <div className='absolute flex justify-center text-sky-400 w-full h-full z-40 bg-black/40 backdrop-blur-[1px] shadow-black/60 shadow-[0_0_20px_10px] rounded-xl'>
        <div className="flex sticky mt-30">
          <Loader className='w-6 h-6 mr-1'/><span>Wait..</span>
        </div>
      </div>}
      <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {(() => {
        const filteredCourses = courses.filter(course => 
          !isPeek || (isPeek && course.isPublished && course.isVerified === 'verified')
        );

        if (filteredCourses.length === 0) {
          return (
            <div className="col-span-full flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">
              <p>No {isPeek ? 'published' : ''} courses available</p>
              {!isPeek && (
                <Button 
                  variant="link" 
                  onClick={() => dispatch(setActiveTab("create-course"))}
                  className="mt-2"
                >
                  Create Your First Course
                </Button>
              )}
            </div>
          );
        }

        return filteredCourses.map((course) => (
          console.log(course.title),
            <motion.div
              whileHover={{ y: -6 }}
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}              
              className="group relative"
            >
              
              {!isPeek && <motion.div
                
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleStatus(course?._id, course?.isPublished);
                }}
                whileHover={{ y: [0, -5, 0] }}
                onMouseEnter={() => handleMouseEnter(course._id)}
                onMouseLeave={() => handleMouseLeave(course._id)}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className={`absolute z-30 -top-2 -left-2 shadow-xl bg-gradient-to-br ${
                course?.isScheduled 
                ? 'from-sky-500/50 border-sky-500/20 to-sky-800/10 pointer-events-none' 
                : course?.isActive ?
                    course?.isPublished  
                    ? 'from-green-500/70 border-green-500/50 to-green-800/40' 
                    : 'from-amber-500/40 border-amber-500/20 to-amber-800/10'
                  : 'from-red-500/40 border-red-500/20 to-red-800/10 pointer-events-none'
                } border-r-2 border-b-1 rounded-b-2xl rounded-tr-2xl p-2`}
              >
                 {course.isActive && tooltipStates[course._id] && (
                    <Badge variant={'outline'} className="w-[95px] text-center absolute top-0 left-25 md:-top-2 md:-left-15 transform -translate-x-1/2 text-xs rounded py-0.5 px-2">
                      {
                        course?.isScheduled ? `Scheduled on ${course?.publishDate}` :
                        course?.isPublished ? 'Published' : 'Draft'
                      }
                    </Badge>
                  )}
                {toggleLoading === course._id ? (
                  <Loader className="w-4 h-4" />
                ) : (
                  course?.isScheduled 
                  ? <Clock size={15} />
                  : course?.isActive ?
                      course?.isPublished 
                      ? <FileCheck2 size={15} /> 
                      : <FileClock size={15} />
                    : <ShieldAlert size={15} />
                )}
              </motion.div>}
              <Card className={
                course.isVerified === 'verified' && course.isActive
                ? `pt-0 overflow-hidden border-border/60 bg-card/50 backdrop-blur-xl hover:bg-card/80 hover:border-sky-500/20 transition-all duration-300`
                : 'grayscale-50 opacity-50 pt-0 overflow-hidden border-border/60 bg-card/50 backdrop-blur-xl hover:bg-card/80 hover:border-sky-500/20 transition-all duration-300'}>
                <div className="relative aspect-video overflow-hidden">
                  {!isPeek && course?.isScheduled && course?.publishDate && (
                    <div className='flex items-center justify-between absolute z-20 top-23 left-16 bg-black/50 text-white text-[10px] px-2 py-1 rounded gap-3'>
                      <Clock size={16} />
                      <div className='w-[80px]'>Scheduled on {format(course?.publishDate, 'MMMM d, yyyy')}</div>
                    </div>
                  )}
                  {course.isVerified === 'pending' && <Badge className='absolute z-20 top-15 left-30 md:top-15 md:left-16 bg-black/50 text-white text-[9px]'><Loader className="w-4 h-4" /> Verification Pending</Badge>}
                  {course.isVerified === 'rejected' && (
                          <HoverCard>
                            <HoverCardTrigger asChild>  
                              <Badge variant={'outline'} className='absolute z-20 top-20 left-32 md:top-15 md:left-20 bg-black/50 text-white'><ShieldAlert size={16}/> Rejected</Badge>
                            </HoverCardTrigger>
                            <HoverCardContent className="relative w-70 md:mt-20 bg-card/95 backdrop-blur-lg rounded-tl-2xl rounded-br-2xl rounded-bl-none rounded-tr-none border-sky-900/40 shadow-[0px_17px_22px_4px_rgba(3,_7,_13,_0.95)]">
                              <div className="absolute inset-y-auto left-0 h-80% w-px bg-neutral-200/80 dark:bg-neutral-800/80">
                                <div className="absolute top-0 h-50% w-px bg-gradient-to-b from-transparent via-sky-500 to-transparent" />
                              </div>
                              <div className="absolute inset-x-3 top-0 h-px w-80% bg-neutral-200/80 dark:bg-neutral-800/80">
                                <div className="absolute mx-auto h-px w-30 bg-gradient-to-r from-transparent via-sky-500 to-transparent" />
                              </div>
                              
                              <div className="flex-col justify-between space-x-4">
                                <div className="space-y-2">
                                    {!isPeek && course?.isVerified === 'rejected' && course?.rejectReason && <CustomAlert 
                                      className="bg-red-950/10 text-red-400/50 hover:text-red-400/60 hover:bg-red-950/30"
                                      title="Admin Rejected !" 
                                      description={course?.rejectReason || "No reason provided."} 
                                      isLoading={false}
                                      />}
                                  
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <span className='text-[10px] text-muted-foreground'>~ for re-verify, click on the button below or edit the course.</span>
                                    </div>                                  
                                  <div className="flex items-center justify-between gap-2 pt-2">
                                    <button
                                      onClick={()=> handleVerifyRequest(course._id, 'pending', '')}
                                      className="text-white px-3 py-1 text-xs rounded-tl-md rounded-br-md bg-gradient-to-br from-sky-900/30 to-sky-900/60 
                                        border border-sky-800/30 hover:from-sky-900/40 hover:to-sky-900/70 
                                        transition-colors"
                                    >
                                      Request Verify
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        )
                    }
                  {!isPeek && !course.isActive && <Badge variant={'destructive'} className='absolute z-20 top-20 left-23 bg-black/50 text-white'>Blocked</Badge>}
                  {!isPeek && course.isVerified !== 'pending' && 
                  <Button
                    onClick={() => handleDelete(course._id)}

                    className="absolute z-20 top-7 right-2 w-8 h-8 p-0 bg-black/50 rounded-full hover:bg-red-900/50"
                    variant="ghost"
                  > 
                    
                    <Trash size={16}/>
                  </Button>}             
                  {!isPeek && course.isVerified !== 'pending' && 
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log(course)
                      handleEditCourse(course._id);
                    }}
                    className="absolute z-20 top-16 right-2 w-8 h-8 p-0 bg-black/50 rounded-full hover:bg-red-900/50"
                    variant="ghost"
                  >
                    <Edit size={16}/>
                  </Button>}
                  {!isPeek && course.isVerified !== 'pending' && 
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDashboardCourse(course._id);
                    }}
                    className="absolute z-20 top-25 right-2 w-8 h-8 p-0 bg-black/50 rounded-full hover:bg-red-900/50"
                    variant="ghost"
                  >
                    <BarChart size={16}/>
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
          ))
        })()}
      </div>
      {courseInsight && <CourseInsightsModal open={courseInsight ? true : false} onClose={() => setCourseInsight(null)} insights={courseInsight!} />}
    </motion.div>)}
    <Pagination 
      className="mt-4 justify-end"
      currentPage={page}
      totalPages={totalPages}
      onPageChange={onPageChange}
      showTotal
      totalItems={totalItems}
      itemsPerPage={pageSize}
    />
    </div>
  );



}