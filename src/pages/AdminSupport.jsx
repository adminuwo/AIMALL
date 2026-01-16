import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    User,
    Search,
    MessageSquare,
    MoreVertical,
    Check,
    CheckCircle,
    Shield,
    Image,
    Paperclip,
    ArrowLeft,
    Phone,
    Video,
    Trash2
} from 'lucide-react';
import { useRecoilState } from 'recoil';
import { userData } from '../userStore/userData';
import apiService from '../services/apiService';

const AdminSupport = () => {
    const navigate = useNavigate();
    const [currentUserData] = useRecoilState(userData);
    const user = currentUserData?.user || { role: 'user' };
    const realIsAdmin = user.role === 'admin' || user.role === 'Admin';

    // Toggle for Admins to view the interface as a User (for testing)
    const [simulateUser, setSimulateUser] = useState(false);
    const isAdminView = realIsAdmin && !simulateUser;

    // State
    const [activeChat, setActiveChat] = useState(null);
    const [chatsList, setChatsList] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [permissionError, setPermissionError] = useState(false);
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

    const messagesEndRef = useRef(null);

    // Initial Fetch & Polling
    useEffect(() => {
        let interval;
        const fetchData = async () => {
            if (isAdminView) {
                await fetchAdminChats();
            } else {
                await fetchMyChat();
            }
        };
        fetchData();
        interval = setInterval(fetchData, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, [isAdminView]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, activeChat, isMobileChatOpen]);

    // Handle initial selection for single user chat
    useEffect(() => {
        if (!isAdminView && chatsList.length > 0 && !activeChat) {
            // Auto-select the first chat for users if mostly they have one
            // setActiveChat(chatsList[0]); 
            // setMessages(chatsList[0].messages || []);
        }
    }, [chatsList, isAdminView]);


    // --- API CALLS ---

    const fetchMyChat = async () => {
        try {
            const chat = await apiService.getMySupportChat();
            if (chat) {
                setChatsList([chat]);
                // If active, update messages
                if (activeChat && activeChat._id === chat._id) {
                    setMessages(chat.messages || []);
                }

                // Auto-select for user view if not selected yet
                if (!isAdminView && !activeChat) {
                    setActiveChat(chat);
                    setMessages(chat.messages || []);
                }
            }
        } catch (err) {
            console.error("Fetch User Chat Error:", err);
        }
    };

    const fetchAdminChats = async () => {
        try {
            const data = await apiService.getAdminActiveChats();
            const list = Array.isArray(data) ? data : [];
            setChatsList(list);
            setPermissionError(false);

            if (activeChat) {
                const updatedChat = list.find(c => c._id === activeChat._id);
                if (updatedChat) {
                    setMessages(updatedChat.messages || []);
                }
            }
        } catch (err) {
            console.error("Fetch Admin Chats Error:", err);
            if (err.response?.status === 403) setPermissionError(true);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        const text = newMessage;
        setNewMessage("");

        try {
            if (isAdminView) {
                if (!activeChat) return;
                await apiService.sendSupportChatMessage(activeChat._id, text);
                await fetchAdminChats();
            } else {
                let chatId = activeChat?._id;
                if (!chatId) {
                    const chat = await apiService.getMySupportChat();
                    chatId = chat._id;
                    setChatsList([chat]); // Optimistic update
                    setActiveChat(chat);
                }
                await apiService.sendSupportChatMessage(chatId, text);
                await fetchMyChat();
            }
        } catch (err) {
            console.error("Failed to send", err);
            alert("Failed to send message. Please try again.");
        }
    };

    const handleChatSelect = (chat) => {
        setActiveChat(chat);
        setMessages(chat.messages || []);
        setIsMobileChatOpen(true);
    };

    const handleBackToContacts = () => {
        setIsMobileChatOpen(false);
        // Optional: setActiveChat(null) if we want to clear selection on mobile back
    };

    const handleClearChat = async (e) => {
        e?.stopPropagation();

        if (!activeChat) {
            console.log('❌ No chat selected');
            return;
        }

        console.log('🔍 Active Chat Object:', activeChat);
        console.log('🔍 Chat ID:', activeChat._id);
        console.log('🔍 Full API URL will be:', `/support-chat/${activeChat._id}/messages`);

        if (window.confirm('Are you sure you want to clear this chat? This action cannot be undone and will delete the chat history for both parties.')) {
            console.log('✅ User confirmed, deleting messages from backend...');
            try {
                // Call backend API to delete messages
                await apiService.deleteSupportChatMessages(activeChat._id);
                console.log('✅ Messages deleted from backend!');

                // Clear local state
                setMessages([]);

                // Refresh the chats list to update the UI
                if (isAdminView) {
                    await fetchAdminChats();
                } else {
                    await fetchMyChat();
                }

                alert('Chat history deleted successfully!');
            } catch (err) {
                console.error('❌ Failed to delete messages:', err);
                alert('Failed to delete chat history. Please try again.');
            }
        } else {
            console.log('❌ User cancelled');
        }
    };

    // Filter chats
    const filteredChats = chatsList.filter(c =>
        c.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // --- RENDER ---

    if (isAdminView && permissionError) {
        return (
            <div className="h-full flex items-center justify-center p-8 text-center">
                <div className="max-w-md">
                    <Shield size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Access Restored Required</h2>
                    <p className="text-gray-500 mb-6">Please refresh your session to access admin support.</p>
                    <button onClick={() => { localStorage.clear(); window.location.href = '/login'; }} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider">
                        Refresh Session
                    </button>
                </div>
            </div>
        );
    }

    // Determine other party name/avatar
    const getChatMeta = (chat) => {
        if (!chat) return { name: 'Support', subtitle: 'Online' };
        if (isAdminView) {
            return {
                name: chat.userId?.name || 'Unknown User',
                subtitle: chat.userId?.email || 'User',
                avatar: chat.userId?.name?.charAt(0) || 'U'
            };
        } else {
            return {
                name: 'AI-MALL Support',
                subtitle: 'Official Support Channel',
                avatar: 'S'
            };
        }
    };

    return (
        <div className="flex h-full w-full overflow-hidden relative bg-slate-50 font-sans text-slate-800">
            {/* Sidebar (Standard Light) */}
            <div className={`
                ${isMobileChatOpen ? 'hidden md:flex' : 'flex'}
                w-full md:w-[320px] bg-white border-r border-slate-200 flex-col h-full shrink-0 z-20 transition-all duration-300
            `}>
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-lg text-slate-800">Messages</h2>
                    <div className="flex gap-2">
                        {/* Test Toggle */}
                        {realIsAdmin && (
                            <button
                                onClick={() => setSimulateUser(!simulateUser)}
                                className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100"
                            >
                                {simulateUser ? 'Exit Test' : 'Test User View'}
                            </button>
                        )}
                        <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                </div>

                {/* Search Bar (Admin Only) */}
                {isAdminView && (
                    <div className="px-4 py-3">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search conversations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-slate-100 text-slate-700 text-sm rounded-xl pl-10 pr-4 py-2.5 border-none outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400 transition-all"
                            />
                        </div>
                    </div>
                )}

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {/* User "New Chat" Action if empty */}
                    {!isAdminView && chatsList.length === 0 && (
                        <div className="p-6 text-center">
                            <button
                                onClick={async () => {
                                    const chat = await apiService.getMySupportChat();
                                    if (chat) {
                                        setChatsList([chat]);
                                        setActiveChat(chat);
                                        setMessages(chat.messages || []);
                                        setIsMobileChatOpen(true);
                                    }
                                }}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium shadow-sm transition-all"
                            >
                                Start Support Chat
                            </button>
                        </div>
                    )}

                    {filteredChats.map((chat) => {
                        const meta = getChatMeta(chat);
                        const isActive = activeChat?._id === chat._id;
                        const lastMsg = chat.messages?.[chat.messages.length - 1];

                        return (
                            <button
                                key={chat._id}
                                onClick={() => handleChatSelect(chat)}
                                className={`
                                    w-full flex items-center gap-4 px-4 py-4 border-b border-slate-50 transition-colors
                                    ${isActive ? 'bg-indigo-50/50 border-indigo-100' : 'hover:bg-slate-50 bg-white'}
                                `}
                            >
                                <div className={`
                                    w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-bold text-lg
                                    ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}
                                `}>
                                    {meta.avatar}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`block truncate font-semibold ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>
                                            {meta.name}
                                        </span>
                                        {lastMsg && (
                                            <span className="text-[10px] text-slate-400 shrink-0">
                                                {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 truncate">
                                        {lastMsg?.text || 'Standard Support Chat'}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className={`
                ${isMobileChatOpen ? 'flex' : 'hidden md:flex'}
                flex-1 flex-col h-full bg-slate-50 relative
            `}>
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-[70px] bg-white px-6 flex items-center justify-between shrink-0 border-b border-slate-200 shadow-sm z-10">
                            <div className="flex items-center gap-4">
                                <button onClick={handleBackToContacts} className="md:hidden text-slate-500 hover:bg-slate-100 p-2 rounded-full">
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                        {getChatMeta(activeChat).avatar}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 leading-tight">{getChatMeta(activeChat).name}</h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            <span className="text-xs text-slate-500 font-medium">{getChatMeta(activeChat).subtitle}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleClearChat}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-full transition-colors"
                                title="Clear Chat"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6">
                            {/* Date Separator (Example) */}
                            <div className="flex justify-center">
                                <span className="bg-slate-200/60 text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    Today
                                </span>
                            </div>

                            {messages.map((msg, index) => {
                                const isMe = msg.senderId === (user.id || user._id);
                                return (
                                    <div key={index} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex max-w-[80%] md:max-w-[60%] ${isMe ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                                            {/* Avatar only for them */}
                                            {!isMe && (
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs mt-1 shrink-0">
                                                    {isAdminView ? getChatMeta(activeChat).avatar : 'S'}
                                                </div>
                                            )}

                                            <div className={`
                                                group relative px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
                                                ${isMe
                                                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                                                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
                                                }
                                            `}>
                                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                                <div className={`
                                                    text-[10px] mt-1 text-right font-medium
                                                    ${isMe ? 'text-indigo-200' : 'text-slate-400'}
                                                `}>
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-200">
                            <div className="max-w-4xl mx-auto">
                                <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                                    <div className="flex-1 bg-slate-100 rounded-2xl flex items-center border border-transparent focus-within:border-indigo-500/30 focus-within:bg-white focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                                        <textarea
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage(e);
                                                }
                                            }}
                                            placeholder="Type your message..."
                                            className="w-full px-4 py-3 bg-transparent border-none outline-none text-slate-800 resize-none h-12 max-h-32 placeholder:text-slate-400 custom-scrollbar"
                                            rows={1}
                                        />
                                        <div className="flex items-center gap-1 pr-2 text-slate-400">
                                            <button type="button" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                                                <Paperclip size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 mb-1"
                                    >
                                        <Send size={20} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </>
                ) : (
                    // Empty State
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                        <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <MessageSquare size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">AI-MALL Messages</h2>
                        <p className="max-w-xs text-slate-500 mb-8">
                            Select a conversation to start messaging.
                        </p>
                        {!isAdminView && (
                            <button
                                onClick={async () => {
                                    const chat = await apiService.getMySupportChat();
                                    if (chat) {
                                        setChatsList([chat]);
                                        setActiveChat(chat);
                                        setMessages(chat.messages || []);
                                        setIsMobileChatOpen(true);
                                    }
                                }}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all"
                            >
                                Start Chat
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSupport;
