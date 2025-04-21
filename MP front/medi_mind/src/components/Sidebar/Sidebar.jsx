// src/components/Sidebar/Sidebar.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getChats, createChat, renameChat } from '../../services/api';
import './Sidebar.css';
import { FaPlus, FaSignOutAlt, FaEdit, FaCheck, FaTimes } from 'react-icons/fa'; // Using react-icons

function Sidebar({ onSelectChat, activeChatId }) {
    const [chats, setChats] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingChatId, setEditingChatId] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { user, logout } = useAuth();
    const renameInputRef = useRef(null);

    const fetchChats = async () => {
        if (!user) return;
        setIsLoading(true);
        setError(null);
        try {
            const fetchedChats = await getChats();
            setChats(fetchedChats || []);
        } catch (err) {
            setError('Failed to load chats. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRenameStart = (chatId, currentTitle) => {
        setEditingChatId(chatId);
        setNewTitle(currentTitle || 'Untitled Chat');
    };

    const handleRenameCancel = () => {
        setEditingChatId(null);
        setNewTitle('');
    };

    const handleRenameConfirm = async () => {
        if (!editingChatId || !newTitle.trim()) {
            handleRenameCancel();
            return;
        }
        const originalTitle = chats.find(c => c._id === editingChatId)?.title;
        // Optimistically update UI
        setChats(prevChats => prevChats.map(chat =>
            chat._id === editingChatId ? { ...chat, title: newTitle.trim() } : chat
        ));
        const chatToRename = editingChatId;
        setEditingChatId(null);

        try {
            await renameChat(chatToRename, newTitle.trim());
            // No need to refetch, UI is already updated
        } catch (err) {
            setError('Failed to rename chat.');
            console.error(err);
            // Revert optimistic update on error
            setChats(prevChats => prevChats.map(chat =>
                chat._id === chatToRename ? { ...chat, title: originalTitle } : chat
            ));
        }
    };

    // Handle Enter key press in rename input
    const handleRenameKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleRenameConfirm();
        } else if (e.key === 'Escape') {
            handleRenameCancel();
        }
    };

    useEffect(() => {
        fetchChats();
    }, [user]); // Refetch chats when user logs in

    // Focus input when editing starts
    useEffect(() => {
        if (editingChatId && renameInputRef.current) {
            renameInputRef.current.focus();
            // Select text in input
            renameInputRef.current.select();
        }
    }, [editingChatId]);

    const handleNewChat = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const newChat = await createChat();
            setChats([newChat, ...chats]); // Add new chat to the top
            onSelectChat(newChat._id); // Select the new chat immediately
        } catch (err) {
            setError('Failed to create new chat.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        // No need to navigate here, ProtectedRoute will handle redirection
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <button 
                    onClick={() => setIsCollapsed(!isCollapsed)} 
                    className="collapse-button"
                    title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                >
                    {isCollapsed ? '→' : '←'}
                </button>
                {!isCollapsed && (
                    <>
                        <h2>MediMind Chats</h2>
                        <button onClick={handleNewChat} className="new-chat-button" title="New Chat" disabled={isLoading}>
                            <FaPlus />
                        </button>
                    </>
                )}
            </div>
            {error && <p className="sidebar-error">{error}</p>}
            <div className="chat-list">
                {isLoading && chats.length === 0 && <p>Loading chats...</p>}
                {chats.length === 0 && !isLoading && <p>No chats yet. Start a new one!</p>}
                {chats.map((chat) => (
                    <div
                        key={chat._id}
                        className={`chat-item ${chat._id === activeChatId ? 'active' : ''}`}
                        onClick={() => editingChatId !== chat._id && onSelectChat(chat._id)} // Prevent selection while editing
                    >
                        {editingChatId === chat._id ? (
                            <div className="rename-container">
                                <input
                                    ref={renameInputRef}
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    onKeyDown={handleRenameKeyDown}
                                    onBlur={handleRenameConfirm} // Save on blur as well
                                    className="rename-input"
                                />
                                <button onClick={handleRenameConfirm} className="rename-button confirm" title="Confirm Rename"><FaCheck /></button>
                                <button onClick={handleRenameCancel} className="rename-button cancel" title="Cancel Rename"><FaTimes /></button>
                            </div>
                        ) : (
                            <>
                                <span className="chat-title">{chat.title || 'Untitled Chat'}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleRenameStart(chat._id, chat.title); }}
                                    className="edit-button"
                                    title="Rename Chat"
                                >
                                    <FaEdit />
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <div className="sidebar-footer">
                {user && <span className="user-email">{user.email}</span>}
                <button onClick={handleLogout} className="logout-button" title="Logout">
                    <FaSignOutAlt />
                </button>
            </div>
        </div>
    );
}

export default Sidebar;