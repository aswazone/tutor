import express,{Express} from 'express';
import { corsMiddleware } from '@/middlewares/cors.middleware';
import cookieParser from 'cookie-parser';
import { validateEnv } from '@/utils/validate-env.utils';
import errorMiddleware from './middlewares/error.middleware';
import authRouter from './routers/auth.route';
import courseRouter from './routers/course.route';
import uploadRouter from './routers/upload.route';
import adminRouter from './routers/admin.routes';
import categoryRouter from './routers/category.route';
import wishlistRouter from './routers/wishlist.route';
import orderRouter from './routers/order.routes';
import progressRouter from './routers/courseProgress.routes';
import insightRouter from './routers/insight.routes';
import chatRouter from './routers/chat.routes';
import noteRouter from './routers/note.routes';
import { initializeCoursePublisher } from './utils/course-schedule-publisher.utils';
import notificationRouter from './routers/notification.routes';

const app:Express = express();
validateEnv();
initializeCoursePublisher();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(corsMiddleware);
app.use(errorMiddleware);
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/upload', uploadRouter);
app.use('/api/v1/courses', courseRouter);
app.use('/api/v1/wishlist', wishlistRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/category', categoryRouter)
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/course-progress', progressRouter);
app.use('/api/v1/insights', insightRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/notes', noteRouter);
app.use('/api/v1/notifications', notificationRouter);

export default app;