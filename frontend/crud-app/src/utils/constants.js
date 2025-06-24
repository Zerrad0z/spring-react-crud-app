export const API_BASE_URL = 'http://localhost:8080/api/v1';

// API Endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/users/login',

    // Users
    USERS: '/users',

    // Products
    PRODUCTS: '/products',

    // Categories
    CATEGORIES: '/categories'
}

// User Roles
export const USER_ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER'
}

//Local Storage Keys (this is just for dev;
//  ill change it later to use sessions with jwt)
export const STORAGE_KEYS = {
    USER: 'user'
}