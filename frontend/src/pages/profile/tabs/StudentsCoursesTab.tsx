import { motion } from 'framer-motion'
import { StarIcon, Clock, Users, Loader, Heart } from 'lucide-react'
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
import { fetchWishlist, addToWishlist, removeFromWishlist } from '@/store/wishlist'
import { toast } from 'sonner'
import { env } from '@/config/env.config';

export const StudentsCoursesTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const { isLoading: coursesLoading } = useSelector((state: RootState) => ({
    isLoading: state.course.courseEditor.uploadStatus === 'uploading'
  }));

  const { items: wishlistItems, isLoading: wishlistLoading } = useSelector(
    (state: RootState) => state.wishlist
  );

  useEffect(() => {
    // Fetch all public courses
    const fetchCourses = async () => {
      try {        
        const response = await axiosInstance.get<ICourse[]>('/api/v1/courses');
        setCourses(response.data);    
    } catch (error) {
      if (error instanceof Error) {
        console.error('Failed to fetch courses:', error);
        toast.error(error.message);
      } else {
        console.error('Failed to fetch courses:', error);
        toast.error('Failed to fetch courses');
      }
      }
    };

    fetchCourses();
    dispatch(fetchWishlist());
  }, [dispatch]);
  const handleWishlistToggle = async (courseId: string, isInWishlist: boolean) => {
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(courseId)).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(courseId)).unwrap();
        toast.success('Added to wishlist');
      }
      // Refresh wishlist after toggle
      void dispatch(fetchWishlist());
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to update wishlist');
      }
    }
  };

  const isLoading = coursesLoading || wishlistLoading;

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
          onClick={() => dispatch(setActiveTab("courses"))}
          className="mt-2"
        >
          Comming soon !!
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
        {courses.map((course) => {
          const isInWishlist = wishlistItems.some(item => item._id === course._id);
          
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
                      handleWishlistToggle(course._id, isInWishlist);
                    }}
                    whileHover={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6 }}
                    className={`absolute z-30 -top-2 -left-2 shadow-xl bg-gradient-to-br from-rose-500/70 border-rose-500/50 to-rose-800/40 border-r-2 border-b-1 rounded-b-2xl rounded-tr-2xl p-2`}
                >
                    {isInWishlist ? <Heart fill='white' size={15} /> : <Heart size={15} />}
                </motion.div>   
              <Card className="pt-0 overflow-hidden border-border/60 bg-card/50 backdrop-blur-xl hover:bg-card/80 hover:border-sky-500/20 transition-all duration-300">
                <div className="relative aspect-video overflow-hidden">
                               
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
};