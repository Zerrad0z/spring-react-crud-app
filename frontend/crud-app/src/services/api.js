import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // ill use JWT later 
        console.log("");
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
        console.error('APP Error:', error.response?.data || error.message);

        if(error.response?.this.status === 401){
            console.log('Unauthorized access');
        }

        if(error.response?.status === 403){
            console.log('Access forbidden');
        }

        return Promise.reject(error);
    }
);

export default api;