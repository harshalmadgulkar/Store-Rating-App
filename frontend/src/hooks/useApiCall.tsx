import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logout } from '@features/auth/authSlice'; // Adjust path if necessary

// Define HTTP Methods for clarity and type safety
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Define the interface for API call options
interface ApiCallOptions {
    endpoint: string;
    method: HttpMethod;
    payload?: object | FormData | string | null; // Payload can be a plain object, FormData, or a string
    routeParams?: Record<string, string | number | boolean>;
    queryParams?: Record<string, string | number | boolean>;
    responseType?: "json" | "text" | "blob";
}

const useApiCall = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // Select the authentication token from Redux store
    const token = useAppSelector((state) => state.auth?.token);

    // Handler for logging out the user and redirecting
    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    // 👇 Simplified and now driven by responseType only
    async function handleResponse<T>(response: Response, responseType: "json" | "text" | "blob"): Promise<T> {
        // --- 1. Handle Authentication Errors (403 Forbidden) ---
        if (response.status === 403 || response.status === 401) {
            handleLogout(); // Log out the user
            return Promise.reject({
                message: 'Unauthorized: Session expired or invalid token. Logging out.',
                statusCode: 403,
            });
        }

        // --- 2. Handle Non-OK HTTP Statuses (e.g., 400, 404, 500) ---
        if (!response.ok) {
            let errorData: any;
            try {
                // Attempt to parse JSON error details from the response body
                errorData = await response.json();
            } catch {
                errorData = {
                    message: response.statusText || `Request failed with status ${response.status}`,
                    statusCode: response.status,
                };
            }
            // Reject the promise with the structured error data
            return Promise.reject(errorData);
        }

        switch (responseType) {
            case "blob": return (await response.blob()) as T;
            case "text": return (await response.text()) as T;
            case "json":
            default: try {
                return await response.json();
            } catch (jsonError) {
                console.warn("Failed to parse JSON response:", jsonError);
                return {} as T;
            }
        }
    }

    const apiCall = async <T = any,>({
        endpoint,
        method,
        payload,
        routeParams,
        queryParams,
        responseType = "json", // 👈 Default type
    }: ApiCallOptions): Promise<T> => {
        try {
            // --- Step 1: Construct the Full API URL ---
            let apiUrl = import.meta.env.VITE_APP_API_URL + endpoint;

            // Replace route parameters (e.g., /users/:id with actual ID)
            if (routeParams) {
                Object.entries(routeParams).forEach(([key, val]) => {
                    apiUrl = apiUrl.replace(`:${key}`, encodeURIComponent(String(val)));
                });
            }

            // Append query parameters to the URL
            if (queryParams) {
                const queryString = new URLSearchParams(
                    Object.entries(queryParams).reduce((acc, [key, val]) => {
                        acc[key] = String(val); // Ensure all query values are strings
                        return acc;
                    }, {} as Record<string, string>)
                ).toString();
                apiUrl += `?${queryString}`;
            }

            // --- Step 2: Prepare Request Options for `fetch` ---
            const options: RequestInit = { method };
            // Initialize headers object. Authorization will be added here.
            const headers: HeadersInit = {};

            // Add Authorization header if a token is available
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            // --- Step 3: Handle Payload and Content-Type Dynamically ---
            if (payload instanceof FormData) {
                // If payload is FormData, assign it directly to `body`.
                // Crucially, DO NOT set 'Content-Type' header. The browser will automatically
                // set 'multipart/form-data' with the correct boundary.
                options.body = payload;
                // Don't set Content-Type for FormData — browser handles it
            } else if (payload !== undefined && ['POST', 'PUT', 'PATCH'].includes(method)) {
                headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify(payload);
            }

            options.headers = headers;

            const response = await fetch(apiUrl, options);
            return await handleResponse<T>(response, responseType);
        } catch (err) {
            // Log the error for debugging purposes
            console.error('API Call Error:', err);
            // Re-throw the error so the calling component can catch it
            // and display appropriate user-facing messages (e.g., toast.error)
            throw err;
        }
    };

    // Return the apiCall function from the hook
    return { apiCall };
};

export default useApiCall;