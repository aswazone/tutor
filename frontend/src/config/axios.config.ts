import axios from 'axios';
import { env } from './env.config';

const BASE_URL = env.API_URL as string;

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Utility function to extract error message
export function axiosErrorMessage(err: unknown): string {
    let message = "Something went wrong";

    if (isAxiosError(err)) {
        if (err.response?.data) {
            const responseData = err.response.data;

            // Check if the response is HTML
            if (typeof responseData === "string" && responseData.includes("<html")) {
                // Extract the error message from the HTML
                const match = responseData.match(/<pre>(.*?)<\/pre>/s);
                if (match && match[1]) {
                    message = match[1].split('<br>')[0].trim(); // Extract the first line of the <pre> tag
                    message = message.replace(/^Error:\s*/, ""); // Remove the "Error:" prefix
                }
            } else if (typeof responseData === "object" && responseData.error) {
                message = responseData.error; // Handle structured JSON error
            } else if (typeof responseData === "object" && responseData.message) {
                message = responseData.message; // Fallback to message field
            }
        }
    } else if (err instanceof Error) {
        message = err.message;
    }

    return message;
}

// Helper function to check if the error is an Axios error
export  function isAxiosError(error: unknown): error is { response?: { data?: { message?: string } } } {
    return typeof error === "object" && error !== null && "response" in error;
}

export default axiosInstance;