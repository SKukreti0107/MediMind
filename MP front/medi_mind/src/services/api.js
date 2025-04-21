// src/services/api.js

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'; // Default to local backend API


const request = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

   
    const config = {
        ...options,
        headers,
        credentials: 'include', 
    };

    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            
            let errorData;
            try {
                errorData = await response.json();
            } catch (e) {
            }
            const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
            console.error(`API Error (${response.status}) on ${options.method || 'GET'} ${url}:`, errorData);
            throw new Error(errorMessage);
        }
        if (response.status === 204) {
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error(`Network or other error calling ${url}:`, error);
        throw error; 
    }
};

// --- Authentication --- FR001, FR009
export const registerUser = (email, password) => {
    return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

export const loginUser = (email, password) => {
    return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

export const logoutUser = () => {
    
    return request('/auth/logout', {
        method: 'POST',
    });
};

// --- Chat Management --- FR004, FR007, FR005
export const getChats = () => {
    return request('/chats', { method: 'GET' });
};

export const createChat = () => {
    return request('/chats', { method: 'POST' });
};

export const renameChat = (chatId, title) => {
    return request(`/chats/${chatId}`, {
        method: 'PATCH',
        body: JSON.stringify({ title }),
    });
};


export const getMessages = (chatId) => {
    return request(`/chats/${chatId}/messages`, { method: 'GET' });
};

export const sendMessage = (chatId, content) => {
    return request(`/chats/${chatId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content }),
    });
};
