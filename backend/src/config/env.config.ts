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
    MONGO_URI

} = process.env

