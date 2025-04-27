import { PORT, NODE_ENV, SERVER_URL, CLIENT_URL } from "@/config/env.config";

export const validateEnv = ():void => {
    if (!PORT) {
        throw new Error("PORT is not found in ENV !");
    }
    if (!NODE_ENV) {
        throw new Error("NODE_ENV is not found in ENV !");
    }
    if (!SERVER_URL) {
        throw new Error("SERVER_URL is not found in ENV !");
    }
    if (!CLIENT_URL) {
        throw new Error("CLIENT_URL is not found in ENV !");
    }
};