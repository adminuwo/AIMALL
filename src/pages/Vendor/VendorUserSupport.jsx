import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Clock, AlertCircle, Inbox, Send, ChevronRight, User, X, MessageSquare, Sparkles, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../../services/apiService';

const VendorUserSupport = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterAgent, setFilterAgent] = useState('all');
    const [replyText, setReplyText] = useState('');
    const [sendingReply, setSendingReply] = useState(false);

    const [chatHistory, setChatHistory] = useState([]);
    const [loadingChat, setLoadingChat] = useState(false);
    const messagesEndRef = React.useRef(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const vendorId = user.id || user._id || localStorage.getItem('userId');

    useEffect(() => {
        fetchMessages();
    }, [vendorId, filterStatus, filterAgent]);

    // Fetch chat history when a message is selected
    useEffect(() => {
        if (selectedMessage) {
            fetchChatHistory();
            const interval = setInterval(() => fetchChatHistory(true), 5000); // Poll for updates
            return () => clearInterval(interval);
        }
    }, [selectedMessage]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const fetchMessages = async () => {
        if (!vendorId) return;
        try {
            const response = await apiService.getVendorMessages(vendorId);
            let msgs = response.data?.messages || [];
            if (filterStatus !== 'all') msgs = msgs.filter(m => m.status === filterStatus);
            if (filterAgent !== 'all') msgs = msgs.filter(m => m.agentName === filterAgent);
            setMessages(msgs);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchChatHistory = async (silent = false) => {
        if (!selectedMessage?.userId || !vendorId) return;
        if (!silent) setLoadingChat(true);
        try {
            // Fetch history for this User-Vendor pair (and Agent context)
            const response = await apiService.getConversationHistory(selectedMessage.userId, vendorId, selectedMessage.agentId);

            if (response.success && Array.isArray(response.data)) {
                // Process messages to unroll replies like in ContactVendorModal
                const rawMessages = response.data;
                const processedMessages = [];

                rawMessages.forEach(msg => {
                    processedMessages.push({
                        _id: msg._id,
                        message: msg.message,
                        senderRole: msg.senderType?.toLowerCase() || 'user',
                        createdAt: msg.createdAt,
                        status: msg.status
                    });

                    if (msg.replyMessage) {
                        processedMessages.push({
                            _id: `${msg._id}_reply`,
                            message: msg.replyMessage,
                            senderRole: 'vendor',
                            createdAt: msg.repliedAt || msg.updatedAt || new Date().toISOString(),
                            isReply: true
                        });
                    }

                    // Assuming 'senderType'='Vendor' from my new endpoint also exists in the list?
                    // Yes, getConversationHistory fetches all VendorMessage docs.
                    // Docs created by 'send-to-user' have senderType: 'Vendor' and message: "..." (no replyMessage typically)
                    // So they are caught by default push.
                });

                processedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                setChatHistory(processedMessages);
            }
        } catch (err) {
            console.error("Failed to fetch chat history", err);
        } finally {
            if (!silent) setLoadingChat(false);
        }
    };

    const updateMessageStatus = async (messageId, status) => {
        try {
            await apiService.updateMessageStatus(messageId, status);
            fetchMessages();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const handleSendMessage = async () => {
        if (!replyText.trim() || !selectedMessage) return;

        setSendingReply(true);
        try {
            // Use the new endpoint to send a direct message (Chat style)
            // Or use replyToMessage if we want to stick to single-reply logic? 
            // The user wants "continues chat". So new Independent Message is better.

            await apiService.sendVendorMessage({
                userId: selectedMessage.userId,
                agentId: selectedMessage.agentId,
                message: replyText
            });

            setReplyText('');
            fetchChatHistory(true); // Update chat immediately

            // Also update the original message status to 'Replied' if strictly needed, 
            // but in chat flow, status is less strict. 
            if (selectedMessage.status === 'New') {
                updateMessageStatus(selectedMessage._id, 'Replied');
            }

        } catch (error) {
            console.error("Failed to send message", error);
            alert('Failed to send message.');
        } finally {
            setSendingReply(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Replied': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Closed': return 'bg-gray-100 text-gray-500 border-gray-200';
            default: return 'bg-gray-50 text-gray-400 border-gray-100';
        }
    };

    // Get unique agents for filter
    const uniqueAgents = [...new Set(messages.map(m => m.agentName))];

    const handleDeleteMessage = async (e, messageId) => {
        e.stopPropagation(); // Prevent opening the chat modal
        if (!window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) return;

        try {
            const res = await apiService.deleteMessage(messageId);
            if (res.success) {
                setMessages(prev => prev.filter(m => m._id !== messageId));
            } else {
                alert(res.message || 'Failed to delete message');
            }
        } catch (err) {
            console.error("Delete error:", err);
            const errMsg = err.response?.data?.message || err.message || 'An error occurred while deleting the message.';
            alert(errMsg);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2">
                        User <span className="text-[#8b5cf6]">Support.</span>
                    </h1>
                    <p className="text-gray-500 font-bold text-lg tracking-tight max-w-xl">
                        Monitor user messages and provide direct assistance.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex gap-4">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
                    >
                        <option value="all">All Status</option>
                        <option value="New">New</option>
                        <option value="Replied">Replied</option>
                        <option value="Closed">Closed</option>
                    </select>

                    {uniqueAgents.length > 0 && (
                        <select
                            value={filterAgent}
                            onChange={(e) => setFilterAgent(e.target.value)}
                            className="px-4 py-2 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
                        >
                            <option value="all">All Agents</option>
                            {uniqueAgents.map(agent => (
                                <option key={agent} value={agent}>{agent}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[48px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden"
                >
                    <div className="px-10 py-8 border-b border-gray-100 bg-white/40 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#d946ef] flex items-center justify-center text-white shadow-[0_20px_40px_-10px_rgba(139,92,246,0.5)] border border-white/20 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <MessageSquare size={28} className="relative z-10" />
                            </div>
                            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tighter">User Messages</h2>
                        </div>
                        <div className="px-5 py-2.5 bg-white/60 rounded-2xl border border-white shadow-sm">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total: <span className="text-[#8b5cf6] text-sm ml-2 font-black">{messages.length}</span></span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">User</th>
                                    <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Email</th>
                                    <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Agent</th>
                                    <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Subject</th>
                                    <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Date</th>
                                    <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">Status</th>
                                    <th className="px-10 py-6 text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100/50">
                                {messages.map((message, index) => (
                                    <motion.tr
                                        key={message._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => setSelectedMessage(message)}
                                        className="hover:bg-white/80 transition-all cursor-pointer group"
                                    >
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border transition-colors text-xs font-black shadow-sm ${message.senderType === 'Admin'
                                                    ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white border-orange-400'
                                                    : 'bg-gradient-to-br from-gray-100 to-white text-gray-700 border-gray-200 group-hover:border-[#8b5cf6]'}`}>
                                                    {message.senderType === 'Admin' ? 'A' : message.userName.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-gray-900 group-hover:text-[#8b5cf6] transition-colors tracking-tight text-sm">
                                                        {message.userName}
                                                    </span>
                                                    {message.senderType === 'Admin' && (
                                                        <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest leading-none mt-0.5">System Admin</span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <p className="text-sm font-bold text-gray-500 group-hover:text-gray-900 transition-colors lowercase">{message.userEmail}</p>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-2">
                                                <Sparkles size={12} className="text-[#d946ef]" />
                                                <span className="text-xs font-black text-gray-700 uppercase tracking-tight">{message.agentName}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <p className="text-sm font-bold text-gray-700 truncate max-w-xs">{message.subject}</p>
                                        </td>
                                        <td className="px-10 py-7">
                                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{new Date(message.createdAt).toLocaleDateString()}</span>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center justify-end gap-3">
                                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${getStatusColor(message.status)}`}>
                                                    {message.status}
                                                </span>
                                                <button
                                                    onClick={(e) => handleDeleteMessage(e, message._id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete Message"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <ChevronRight size={18} className="text-gray-300 group-hover:text-[#8b5cf6] group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {messages.length === 0 && !loading && (
                        <div className="p-20 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full animate-pulse" />
                                <MessageSquare size={40} className="text-gray-300 relative z-10" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-2">No Messages Yet</h3>
                            <p className="text-gray-400 font-bold text-lg max-w-xs mx-auto">Users can contact you from the marketplace. Messages will appear here.</p>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Message Detail Modal - Chat Interface */}
            <AnimatePresence>
                {selectedMessage && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:pl-80 bg-gray-900/60 backdrop-blur-2xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white/95 backdrop-blur-xl border border-white/60 rounded-[32px] w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl relative overflow-hidden"
                        >
                            {/* Chat Header */}
                            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[16px] bg-gradient-to-tr from-purple-500 to-indigo-500 p-0.5 shadow-lg shadow-purple-500/20">
                                        <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center font-black text-xl text-purple-600">
                                            {selectedMessage.userName.charAt(0).toUpperCase()}
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="text-lg font-black text-gray-900 leading-none">{selectedMessage.userName}</h2>
                                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                            Chat regarding {selectedMessage.agentName}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-full flex items-center justify-center transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Chat Area */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/50 custom-scrollbar">
                                {loadingChat ? (
                                    <div className="flex justify-center pt-20">
                                        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : (
                                    <>
                                        {/* Professional Conversation Header */}
                                        <div className="flex flex-col items-center justify-center mb-8 opacity-70">
                                            <div className="w-16 h-[1px] bg-gray-200 mb-3" />
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">
                                                Secure Connection Established
                                            </p>
                                            <p className="text-[10px] font-bold text-gray-300 mt-1">
                                                {selectedMessage.userName} • {selectedMessage.agentName || 'Platform'}
                                            </p>
                                        </div>

                                        {chatHistory.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full opacity-30 min-h-[200px]">
                                                <MessageSquare size={40} className="mb-2" />
                                                <p className="font-black">No messages loaded</p>
                                            </div>
                                        ) : (
                                            chatHistory.map((msg, index) => {
                                                const normalizedRole = (msg.senderRole || '').trim().toLowerCase();
                                                const isMe = normalizedRole === 'vendor';

                                                return (
                                                    <motion.div
                                                        key={msg._id || index}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div className={`max-w-[70%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                            <div className={`px-6 py-4 rounded-[26px] shadow-sm font-medium text-sm leading-relaxed ${isMe
                                                                ? 'bg-[#8b5cf6] text-white rounded-br-sm shadow-purple-500/20'
                                                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                                                                }`}>
                                                                {msg.message}
                                                            </div>
                                                            <span className="text-[10px] font-bold text-gray-400 mt-1.5 px-2">
                                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })
                                        )}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-6 bg-white border-t border-gray-50">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }}
                                    className="relative group flex items-center gap-3"
                                >
                                    <input
                                        type="text"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-gray-50 border border-gray-100 hover:border-gray-200 focus:border-purple-300 rounded-[28px] px-8 py-5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/5 transition-all shadow-inner"
                                    />
                                    <button
                                        type="submit"
                                        disabled={sendingReply || !replyText.trim()}
                                        className="w-14 h-14 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-all disabled:opacity-50 disabled:grayscale shadow-xl shadow-purple-500/20 group-hover:scale-105 active:scale-90"
                                    >
                                        {sendingReply ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Send size={20} className="-ml-0.5" />
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VendorUserSupport;
