import {CorsOptions} from "cors";

export const corsConfig = (origin:string):CorsOptions => ({
    origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control','Expires', 'Pragma'],
    credentials: true
})