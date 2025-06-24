import React, {createContext, useContext, useState, useEffect, Children} from "react";
import { STOTAGE_KEYS, USER_ROLES } from "../utils/constants";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // load user from LocalStorage on app start
    useEffect(() => {
        const savedUser = localStorage.getItem(STOTAGE_KEYS.USER);
        if(savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error(error);
                localStorage.removeItem(STOTAGE_KEYS.USER);
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem(STOTAGE_KEYS.USER, JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(STOTAGE_KEYS.USER);
    };

    const isAuthenticated = () => {
        return user !== null;
    };

    const isAdmin = () => {
        return user?.role === USER_ROLES.ADMIN;
    };

    const isUser = () => {
        return user?.role === USER_ROLES.USER;
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        isUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};