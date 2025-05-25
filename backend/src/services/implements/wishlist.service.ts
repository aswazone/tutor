import { HttpError } from '@/utils/http-error.utils';
import { HttpStatus } from '@/constants/status.constant';
import { UserRepositoryIF } from '@/repositories/interface/user.repository.interface';
import { CourseRepositoryIF } from '@/repositories/interface/course.repository.interface';
import { WishlistServiceIF } from '../interface/wishlist.service.interface';
import { ICourse } from '@/types/course.type';

export class WishlistService implements WishlistServiceIF {
  constructor(
    private readonly _userRepository: UserRepositoryIF,
    private readonly _courseRepository: CourseRepositoryIF
  ) {}
  addToWishlist = async (userId: string, courseId: string): Promise<void> => {
    const [user, course] = await Promise.all([
      this._userRepository.findById(userId),
      this._courseRepository.findById(courseId)
    ]);
    
    if (!user) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'User not found');
    }
    if (!course) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Course not found');
    }

    if (user.wishlist?.includes(courseId)) {
      throw new HttpError(HttpStatus.BAD_REQUEST, 'Course already in wishlist');
    }

    await this._userRepository.findByIdAndUpdate(
      userId,
      { $push: { wishlist: courseId } },
      { new: true }
    );
  };

  removeFromWishlist = async (userId: string, courseId: string): Promise<void> => {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'User not found');
    }

    if (!user.wishlist?.includes(courseId)) {
      throw new HttpError(HttpStatus.NOT_FOUND, 'Course not found in wishlist');
    }

    await this._userRepository.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: courseId } },
      { new: true }
    );
  };
  
  getWishlist = async (userId: string): Promise<ICourse[]> => {
    try {
      const populatedUser = await this._userRepository.findByIdAndPopulateWishlist(userId);
      if (!populatedUser) {
        throw new HttpError(HttpStatus.NOT_FOUND, 'User not found');
      }

      return (populatedUser.wishlist as unknown as ICourse[]) || [];
    } catch (error) {
      if (error instanceof HttpError) throw error;
      throw new HttpError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch wishlist');
    }
  };
}