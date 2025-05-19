import { config } from "dotenv";
import process from "process";
import { existsSync } from "fs";
import { resolve } from "path";

export default function loadEnv(env = process.env.NODE_ENV) {
    const environment:string = env || 'development';
    const envFile:string = `src/.env.${environment}.local`;
    const envPath:string = resolve(process.cwd(), envFile);

    if(existsSync(envFile)){
        config({path: envPath});
        console.log(`loaded env on.. ${envFile}`);
    }else{
        console.warn(`not found env on.. ${envFile} , fallback to .env`);
        config();
    }
}

loadEnv();

export const {

    PORT,
    NODE_ENV,
    SERVER_URL,
    CLIENT_URL,
    MONGO_URI,
    SENDER_EMAIL,
    SENDER_PASSKEY,
    RESET_PASS_URL,
    REDIS_URL,
    JWT_ACCESS_SECRET_KEY,
    JWT_REFRESH_SECRET_KEY,
    AWS_REGION,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_S3_BUCKET

} = process.env

