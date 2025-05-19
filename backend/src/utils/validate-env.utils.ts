import { PORT, NODE_ENV, SERVER_URL, CLIENT_URL } from "@/config/env.config";

export const validateEnv = (requiredVars: string[] = []): void => {
    const defaultVars = {
        PORT,
        NODE_ENV,
        SERVER_URL,
        CLIENT_URL
    };

    // Validate default environment variables
    Object.entries(defaultVars).forEach(([key, value]) => {
        if (!value) {
            throw new Error(`${key} is not found in ENV !`);
        }
    });

    // Validate additional required variables
    requiredVars.forEach(variable => {
        if (!process.env[variable]) {
            throw new Error(`${variable} is not found in ENV !`);
        }
    });
};