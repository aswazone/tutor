import { motion } from 'framer-motion';
import { StarIcon, Clock, Users, GraduationCap, Trash, Edit, FileCheck2, FileClock } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ICourse } from '@/types/course.type';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState, memo } from 'react';
import axiosInstance from '@/config/axios.config';
import { setActiveTab } from '@/store/auth/authSlice';
import CardSkeleton from '@/components/common/CardSkeleton';
import Loader from '@/components/ui/loader';
import { toast } from 'sonner';
import { env } from '@/config/env.config';

type CourseCardProps = {
  course: ICourse;
  onNavigate: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

// Memoized Course Card Component
const CourseCard = memo(({ course, onNavigate, onEdit, onDelete }: CourseCardProps) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(course._id);
  };

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
      <motion.div
        whileHover={{ y: [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: 0.6 }}
        className={`absolute z-30 -top-2 -left-2 shadow-xl bg-gradient-to-br ${
          course.isPublished 
            ? 'from-green-500/70 border-green-500/50 to-green-800/40' 
            : 'from-amber-500/70 border-amber-500/50 to-amber-800/40'
        } border-r-2 border-b-1 rounded-b-2xl rounded-tr-2xl p-2`}
      >
        {course.isPublished ? <FileCheck2 size={15} /> : <FileClock size={15} />}
      </motion.div>

      <Card className="pt-0 z-10 relative overflow-hidden border-border/60 bg-card/50 backdrop-blur-xl hover:bg-card/80 hover:border-sky-500/20 transition-all duration-300">
        <div className="relative aspect-video overflow-hidden">
          <button
            onClick={handleDelete}
            className="absolute z-20 top-10 right-2 w-8 h-8 text-red-500/70 bg-black/50 rounded-3xl p-2 hover:bg-red-900/50 hover:text-white"
          >
            <Trash size={16} />
          </button>
          <button
            onClick={handleEdit}
            className="absolute z-20 top-20 right-2 w-8 h-8 text-sky-500/70 bg-black/50 rounded-3xl p-2 hover:bg-sky-900/50 hover:text-white"
          >
            <Edit size={16} />
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
              <span>{course.modules.length} Modules</span>
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

CourseCard.displayName = 'CourseCard';

export const TutorCoursesTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleNavigate = useCallback((id: string) => {
    navigate(`/course/${id}`);
  }, [navigate]);

  const handleEdit = useCallback((id: string) => {
    // Add edit functionality
    console.log('Edit course:', id);
  }, []);

  const handleDelete = useCallback((id: string) => {
    // Add delete functionality
    console.log('Delete course:', id);
  }, []);

  useEffect(() => {
 

    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/api/v1/courses/tutor');
        setCourses(response.data);
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'AbortError') return;
          const message = error instanceof Error ? error.message : 'Failed to fetch courses';
          setError(message);
          toast(message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();

    return () => {

    };
  }, [navigate, dispatch]);

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-destructive">
        <p>{error}</p>
        <Button 
          variant="link" 
          onClick={() => window.location.reload()}
          className="mt-2"
        >
          Try again
        </Button>
      </div>
    );
  }

  if (!courses?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] text-muted-foreground">
        <p>No courses found</p>
        <Button 
          variant="link" 
          onClick={() => dispatch(setActiveTab("create-course"))}
          className="mt-2"
        >
          Create your first course
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-2">
        {courses.map((course) => (
          <CourseCard 
            key={course._id} 
            course={course} 
            onNavigate={handleNavigate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </motion.div>
  );
};