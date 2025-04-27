import express,{Express ,Request, Response} from 'express';
import { corsMiddleware } from '@/middlewares/cors.middleware';
import cookieParser from 'cookie-parser';
import { validateEnv } from '@/utils/validate-env.utils';

const app:Express = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(corsMiddleware);
app.use(cookieParser());
validateEnv();

app.get('/', (req:Request, res:Response) => {
    res.send('Welcome to Tutor E learning app !!')
})

export default app;