import axios from 'axios';
import { BASE_URL } from "./apiPaths";
// axios sends HTTP requests to the backend server and handles responses

const axiosInstance = axios.create({
    baseURL: BASE_URL, //backend API base url
    timeout: 10000, //10 seconds for the server to respond, else throw an error
    headers: {
        'Content-Type': 'application/json', //tells server what format the data is in
        'Accept': 'application/json', //tells server what format of the response we want
    },
})

// Request interceptor to automatically add the token to the headers of every request
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if(accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`; // adds the token to the headers of the request
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to watch every response the frontend receives from the backend especially errors
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors globally
        if (error.response) {
            if (error.response.status === 401){
                // Redirect to login page if unauthorized
                window.location.href = "/login";
            } else if (error.response.status === 500){
                console.error("Server error. Please try again later.");
            }
        } else if (error.code === "ECONNABORTED") { // means request timed out likely due to network issues
            console.error("Request timed out. Please try again.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;