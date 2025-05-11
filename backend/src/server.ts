import { PORT, SERVER_URL } from '@/config/env.config'; 
import Database from '@/config/mongo.config';
import app from '@/app';
import { connectRedis } from './config/redis.config';


const startServer = async () => {
    try {
        await Database.getInstance();
        connectRedis(); 
        const server = app.listen(PORT, () => {
            console.log(`🚀 Tutor App running on ${SERVER_URL} !`);
        });

        process.on('SIGINT', async () => {
            await Database.disconnect();
            server.close(() => {
                console.log('MongoDB server is closed 🔴');
                process.exit(0);
            });
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

