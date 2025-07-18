import { memo, useEffect, useState } from 'react';
import { ICourse } from '@/types/course.type';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '@/store';
import { fetchWishlist, removeFromWishlist } from '@/store/wishlist';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import CardSkeleton from '@/components/common/CardSkeleton';
import Loader from '@/components/ui/loader';
import { StarIcon, Clock, Users, GraduationCap, Trash } from 'lucide-react';
import { env } from '@/config/env.config';
import axiosInstance from '@/config/axios.config';
import { CourseCardProps } from '@/types/profile.type';


// Memoized Course Card Component
const CourseCard = memo(({ course, onNavigate, onDelete}: CourseCardProps) => {


    console.log(course,'course');

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(course._id);
    };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      className="group cursor-pointer relative"
      onClick={() => onNavigate(course._id)}
    >

      <Card className="pt-0 z-10 relative overflow-hidden border-border/60 bg-card/50 backdrop-blur-xl hover:bg-card/80 hover:border-sky-500/20 transition-all duration-300">
        <div className="relative aspect-video overflow-hidden">
          <button
            onClick={handleDelete}
            className="absolute z-20 top-10 right-2 w-8 h-8 text-red-500/70 bg-black/50 rounded-3xl p-2 hover:bg-red-900/50 hover:text-white"
          >
            <Trash size={16} />
          </button>
          <img
            src={`${env.AMZ_BUCKET_NAME}/${course.thumbnailKey}`}
            alt={course.title}
            loading="lazy"
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-background/20" />
          <Badge 
            className="absolute font-bold top-2 right-2 uppercase"
            variant={course.level === 'beginner' ? 'default' : 
                    course.level === 'intermediate' ? 'secondary' : 'destructive'}
          >
            {course.level}
          </Badge>
        </div>
        
        <div className="p-4 space-y-4">
          <h3 className="font-bold text-lg line-clamp-2">{course.title}</h3>
          
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.modules?.length} Modules</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>42 Students</span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => {
                const isFilled = i < Math.floor(Number(course.rating));
                const isHalf = i === Math.floor(Number(course.rating)) && Number(course.rating) % 1 !== 0;
                return (
                  <StarIcon
                    key={i}
                    className={`h-2.5 w-2.5 ${isFilled ? 'text-yellow-500' : isHalf ? 'text-yellow-500/50' : 'text-gray-300'}`}
                  />
                );
              })}
              <span className='text-xs'>({Number(course.rating)})</span>
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
  );
});



export const WishlistTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const { items: wishlist, isLoading, error } = useSelector((state: RootState) => state.wishlist);

    useEffect(() => {
      // Fetch all public courses
      const fetchCourses = async () => {
        setLoading(true);
        try {        
          const response = await axiosInstance.get('/api/v1/courses/wishlist');
          setCourses(response.data);
          console.log(response.data,'wishlist');
          setLoading(false);  
      } catch (error) {
        setLoading(false);
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
      // Fetch wishlist items
      dispatch(fetchWishlist());
    }, [dispatch]);

    const wishlistedCourses = (courses ?? []).filter((course) =>
      (wishlist ?? []).some((wishlistItem) => wishlistItem._id === course._id)
    );
    console.log(wishlistedCourses,'wishlistedCourses');
    

  const handleNavigation = async (courseId: string) => {
      if(user?._id && courseId){
        const isPurchased = await axiosInstance.get(`/api/v1/courses/check-purchased/${courseId}/${user?._id}`);
        console.log('isPurchased:', isPurchased.data);
  
        if(isPurchased.data) navigate(`/course-progress/${courseId}`);
      }
      navigate(`/course/${courseId}`);
  }

//   console.log(wishlist,'wishlistTAb');
//   console.log(courses,'wishlist-TAb');

  const handleRemoveFromWishlist = async (courseId: string) => {
    try {
      await dispatch(removeFromWishlist(courseId)).unwrap();
      toast.success('Course removed from wishlist');
    } catch (error) {
        console.error('Failed to remove course from wishlist:', error);
      toast.error('Failed to remove course from wishlist');
    }
  };

  if (isLoading || loading) {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className='flex items-center mt-2 animate-caret-blink text-sky-400/30'>
          <Loader className='mr-2 text-sky-400/50'/>
          Loading wishlist...
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-destructive">
        <p>{error}</p>
        <Button 
          variant="link" 
          onClick={() => dispatch(fetchWishlist())}
          className="mt-2"
        >
          Try again
        </Button>
      </div>
    );
  }

  if (!wishlist?.length || !courses?.length || !wishlistedCourses?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">
        <p className='text-xl text-sky-200/60'>~ Your wishlist is empty ~</p>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/courses')}
          className="mt-8"
        >
          Browse Courses <span className='animate-caret-blink'>✨</span>
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
        {wishlistedCourses && wishlistedCourses.map((course) => (
          <CourseCard
            key={course._id}
            course={course}
            onNavigate={()=>handleNavigation(course._id)}
            onDelete={handleRemoveFromWishlist}
          />
        ))}
      </div>
    </motion.div>
  );
};