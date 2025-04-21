// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, logoutUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // To check initial auth status
    const [error, setError] = useState(null);

    // TODO: Add a function to check initial auth status (e.g., by verifying cookie/token with backend)
    // For now, we assume the user is logged out initially.
    useEffect(() => {
        // Placeholder for checking initial auth status
        // e.g., call a '/api/auth/status' endpoint
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const data = await loginUser(email, password);
            setUser({ id: data.user_id, email }); // Store minimal user info
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.message || 'Login failed');
            setLoading(false);
            return false;
        }
    };

    const register = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            await registerUser(email, password);
            // Optionally log in the user immediately after registration
            // await login(email, password);
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.message || 'Registration failed');
            setLoading(false);
            return false;
        }
    };

    const logout = async () => {
        setLoading(true);
        setError(null);
        try {
            await logoutUser();
            setUser(null);
            setLoading(false);
        } catch (err) {
            // Handle logout error (e.g., network issue)
            // Even if API call fails, clear user state locally
            setError(err.message || 'Logout failed');
            setUser(null);
            setLoading(false);
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};