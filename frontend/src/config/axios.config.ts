import axios from 'axios';
import { env } from './env.config';
import { toast } from 'sonner';

export const BASE_URL = env.API_URL as string;

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});


axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry && (originalRequest._retryCount || 0) < 3) {
            originalRequest._retry = true;
            originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

            try {

                const response = await axiosInstance.post('/api/v1/auth/refresh-token', {}, {withCredentials: true});

                const { accessToken } = response.data;
                if (!accessToken) throw new Error('No access token received');
                localStorage.setItem('accessToken', accessToken);

                // Update the Authorization header
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axiosInstance(originalRequest);

            } catch (refreshError) {
                console.error("Token refresh failed:", refreshError);

                localStorage.removeItem('accessToken');
                toast.error("Token refresh failed. Please login again.");

                window.location.href = '/home';
                return Promise.reject(refreshError);
            }
        }

        // If the error is not 401 or refresh failed
        return Promise.reject(error);
    }
);


// Utility function to extract error message
export function axiosErrorMessage(err: unknown): string {
    let message = "Something went wrong";

    if (isAxiosError(err)) {
        if (err.response?.data) {
            const responseData = err.response.data;

            // Check if the response is HTML
            if (typeof responseData === "string" && responseData.includes("<html")) {
                // Extract the error msg from the HTML
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
        console.log(err,'axios interceptor error');
        message = err.message;
    }

    return message;
}

// Helper function to check if the error is an Axios error
export  function isAxiosError(error: unknown): error is { response?: { data?: { message?: string } } } {
    return typeof error === "object" && error !== null && "response" in error;
}

export default axiosInstance;