
import { Socket } from "socket.io";
import { User } from "@/models/implements/user.model";

interface SocketAuthMiddleware {
  (socket: Socket, next: (err?: Error) => void): Promise<void>;
}

export const socketAuthMiddleware: SocketAuthMiddleware = async (socket, next) => {
  try {
    const userId = socket.handshake?.auth?.userId
    console.log(userId);
    
    if (!userId) {
      return next(new Error('No user id provided'));
    }

    
    const user = await User.findById(userId);

    console.log(user);
    if (!user) {
      return next(new Error('User not found'));
    }

    socket.handshake.auth.userId = user._id as string;
    socket.handshake.auth.user = user;
    
    next();
  } catch (error) {
    next(new Error('Invalid token'));
    console.error(error);
  }
};