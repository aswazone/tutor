import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Pagination } from '@/components/ui/pagination';
import axiosInstance from '@/config/axios.config';
import { env } from '@/config/env.config';
import { IReview } from '@/types/review.type';
import { motion } from 'framer-motion'
import { StarIcon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format } from 'timeago.js';

export const CourseReviews = ({ courseId }: { courseId: string }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [reviews, setReviews] = useState<IReview[]>([]);

  const [searchParams,setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 4;


  const fetchReviews = useCallback(async (pageNum = page, size = pageSize) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/api/v1/reviews/course', {
        params: { page: pageNum, limit: size , relatedId: courseId }
      });

      setIsLoading(false);
      const { data, total } = response.data;
      setReviews(data);
      setTotalPages(Math.ceil(total / size));
      setTotalItems(total);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching reviews:', error);
    }
  }, [page, pageSize, courseId]);

  useEffect(() => {
    if(courseId){
      fetchReviews();
    }
  }, [fetchReviews, courseId]);


  const onPageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(newPage));
    setSearchParams(params);
  };
  
  return (
  <div className='relative'>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 border-b-1"
    >
      {isLoading ? (
        <div className='text-center text-sky-500/40'>Loading...</div>
      ) : reviews.length === 0 ? (
        <div className='text-center text-sky-500/60'>No reviews found.</div>
      ) : (
        reviews.map((review, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={`${env.AMZ_BUCKET_NAME}/${review.reviewerId?.profileImage}`} />
                <AvatarFallback>RV</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{review.reviewerId?.userName?.charAt(0).toUpperCase() + review.reviewerId?.userName?.slice(1).toLowerCase()}</h3>
                <p className="text-sm text-muted-foreground">{format(new Date(review.createdDate))}</p>
              </div>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, starIndex) => (
                <StarIcon
                  key={starIndex}
                  className={`h-5 w-5 ${
                    starIndex < review.rating ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground">{review.review}</p>
        </motion.div>
      )))}
    </motion.div>
    <Pagination 
      className=" mt-4 justify-end"
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