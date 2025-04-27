import { corsConfig } from "@/config/cors.config";
import { CLIENT_URL } from "@/config/env.config";
import cors from "cors";

export const corsMiddleware = cors(corsConfig(CLIENT_URL as string));