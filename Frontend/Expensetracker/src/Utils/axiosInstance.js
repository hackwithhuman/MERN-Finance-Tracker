import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,

    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },

});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// response interceptor to handle responses globally
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {

        // handle common error globally
        if (error.response) {
            // Server responded with a status other than 2xx
            if (error.response.status === 401) {
                // handle unauthorized access, e.g., redirect to login
                window.location.href = '/login';
                // window.location.href = '/login'; // Uncomment to enable redirection
            }
            else if (error.response.status === 500) {
                console.log('Server error occurred. Please try again later.');
            }
            else if (error.code === 'ECONNABORTED') {
            }
        }
        return Promise.reject(error);
    });




export default axiosInstance;
