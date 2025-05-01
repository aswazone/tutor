import express,{Express ,Request, Response} from 'express';
import { corsMiddleware } from '@/middlewares/cors.middleware';
import cookieParser from 'cookie-parser';
import { validateEnv } from '@/utils/validate-env.utils';
import errorMiddleware from './middlewares/error.middleware';

const app:Express = express();
validateEnv();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(corsMiddleware);
app.use(errorMiddleware);
app.use(cookieParser());

app.get('/', (req:Request, res:Response) => {
    res.send('Welcome to Tutor E learning app !!')
})

export default app;