import { WishlistController } from "@/controllers/implements/wishlist.controller";
import { WishlistService } from "@/services/implements/wishlist.service";
import { UserRepository } from "@/repositories/implements/user.repository";
import { CourseRepository } from "@/repositories/implements/course.repository";


export const wishlistController = new WishlistController(new WishlistService(new UserRepository(), new CourseRepository()));