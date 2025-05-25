import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { addToWishlist, removeFromWishlist } from '@/store/wishlist';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface WishlistButtonProps {
  courseId: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const WishlistButton = ({ 
  courseId, 
  className, 
  variant = 'ghost',
  size = 'icon'
}: WishlistButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: wishlist } = useSelector((state: RootState) => state.wishlist);
  const [isLoading, setIsLoading] = useState(false);

  const isInWishlist = wishlist.some(item => item._id === courseId);
  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsLoading(true);
      if (isInWishlist) {
        await dispatch(removeFromWishlist(courseId)).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(courseId)).unwrap();
        // After adding, fetch the updated wishlist
        await dispatch(fetchWishlist()).unwrap();
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(isInWishlist ? 'Failed to remove from wishlist' : 'Failed to add to wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        'transition-all duration-200',
        isInWishlist ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground',
        className
      )}
    >
      <Heart className={cn(
        'h-[1.2rem] w-[1.2rem] transition-all',
        isInWishlist ? 'fill-current' : ''
      )} />
      <span className="sr-only">
        {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </span>
    </Button>
  );
};
