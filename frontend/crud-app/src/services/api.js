import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // JWT token 
        // const token = localStorage.getItem('token');
        // if (token) {
        //     config.headers.Authorization = `Bearer ${token}`;
        // }
        
        console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.data || error.message);

        // Fixed: Changed from this.status to status
        if(error.response?.status === 401){
            console.log('Unauthorized access - redirecting to login');
            // Handle unauthorized access (redirect to login, clear tokens, etc.)
            // window.location.href = '/login';
        }

        if(error.response?.status === 403){
            console.log('Access forbidden');
        }

        if(error.response?.status === 500){
            console.log('Server error - please try again later');
        }

        return Promise.reject(error);
    }
);

export default api;