import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Send, Check, Trash2 } from 'lucide-react';
import axios from 'axios';
import { apiService } from '../services/apiService';
import { useRecoilValue } from 'recoil';
import { themeState } from '../userStore/userData';

const ContactVendorModal = ({ isOpen, onClose, agent, user }) => {
    const theme = useRecoilValue(themeState);
    const isDark = theme === 'Dark';
    const [formData, setFormData] = useState({
        userName: user?.name || '',
        userEmail: user?.email || '',
        subject: '',
        message: ''
    });
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const messagesEndRef = React.useRef(null);

    // UI State
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [activeReportId, setActiveReportId] = useState(null);

    // Fetch Chat History
    const fetchChatHistory = async (silent = false) => {
        if (!agent) return;

        let targetVendorId = agent._id;
        if (agent.owner) targetVendorId = agent.owner;
        else if (agent.vendorId) targetVendorId = agent.vendorId;

        if (!targetVendorId) return;

        if (!silent) setLoadingMessages(true);
        try {
            // Check if user is admin by role OR email
            const isAdmin = user?.role === 'admin' || user?.email === 'admin@uwo24.com' || user?.email === 'admin@aimall.com';

            if (isAdmin) {
                // Admin Mode: Fetch Reports
                const reports = await apiService.getUserReports(targetVendorId, 'AdminSupport'); // Prioritize 'AdminSupport' type, or fetch all

                // If no specific AdminSupport tickets, try fetching any open ticket to be helpful
                let activeReport = null;
                if (reports && reports.length > 0) {
                    activeReport = reports[0]; // Logic: Check for most recent AdminSupport
                } else {
                    // Fallback: Check if there are ANY reports for this user if no 'AdminSupport' type found
                    const allReports = await apiService.getUserReports(targetVendorId);
                    if (allReports && allReports.length > 0) {
                        activeReport = allReports[0];
                    }
                }

                if (activeReport) {
                    setActiveReportId(activeReport._id);
                    setFormData(prev => ({
                        ...prev,
                        subject: activeReport.description,
                        ticketType: activeReport.type
                    }));
                    const msgs = await apiService.getReportMessages(activeReport._id);
                    setMessages(msgs || []);
                } else {
                    // FALLBACK: If no active support ticket, fetch Direct Messages so we don't show an empty chat
                    // if the vendor replied via DM (User Support).
                    setActiveReportId(null);
                    const response = await apiService.getConversationHistory(targetVendorId, targetVendorId, agent?.type === 'agent' ? agent._id : null);
                    if (response.success && Array.isArray(response.data)) {
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
                        });
                        processedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                        setMessages(processedMessages);
                    } else {
                        setMessages([]);
                    }
                }
            } else {
                // User Mode: Fetch Direct Messages
                const userId = user?._id || user?.id;
                const response = await apiService.getConversationHistory(userId, targetVendorId, agent?.type === 'agent' ? agent._id : null);
                if (response.success && Array.isArray(response.data)) {
                    const rawMessages = response.data;
                    const processedMessages = [];

                    rawMessages.forEach(msg => {
                        // 1. Add the User's original message
                        processedMessages.push({
                            _id: msg._id,
                            message: msg.message,
                            senderRole: msg.senderType?.toLowerCase() || 'user', // Default to user, backend sends 'User', 'Vendor', 'Admin'
                            createdAt: msg.createdAt,
                            status: msg.status
                        });

                        // 2. If there is a reply, add it as a subsequent message from Vendor
                        if (msg.replyMessage) {
                            processedMessages.push({
                                _id: `${msg._id}_reply`,
                                message: msg.replyMessage,
                                senderRole: 'vendor',
                                createdAt: msg.repliedAt || msg.updatedAt || new Date().toISOString(),
                                isReply: true
                            });
                        }
                    });

                    // Sort by time to ensure replies come after messages
                    processedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

                    setMessages(processedMessages);
                } else {
                    setMessages([]);
                }
            }
        } catch (err) {
            console.error('[ContactVendorModal] Failed to fetch history:', err);
        } finally {
            if (!silent) setLoadingMessages(false);
        }
    };

    // Scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    React.useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    // Initial load and polling
    React.useEffect(() => {
        if (isOpen) {
            fetchChatHistory();

            // Poll for new messages every 5 seconds
            const intervalId = setInterval(() => {
                // Pass true to indicate silent background refresh (no loading spinner)
                fetchChatHistory(true);
            }, 5000);

            return () => clearInterval(intervalId);
        }
    }, [isOpen, agent]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.message.trim()) {
            setError('Please enter a message');
            setLoading(false);
            return;
        }

        try {
            // Check if user is admin by role OR email
            const isAdmin = user?.role === 'admin' || user?.email === 'admin@uwo24.com' || user?.email === 'admin@aimall.com';

            if (activeReportId && isAdmin) {
                // CASE 1: Sending to an existing Support Ticket (Vendor Support System)
                await apiService.sendReportMessage(activeReportId, formData.message);

                // Optimistically add message to list
                const newMessage = {
                    _id: Date.now().toString(),
                    message: formData.message,
                    senderRole: 'admin',
                    createdAt: new Date().toISOString()
                };
                setMessages(prev => [...prev, newMessage]);

            } else {
                // CASE 2: Fallback to old Email/Contact system (or User contacting Vendor)
                const payload = {
                    agentId: (agent.type === 'agent' || !agent.type) ? agent._id : null,
                    vendorId: agent.type === 'vendor' ? agent._id : null,
                    userName: formData.userName,
                    userEmail: formData.userEmail,
                    subject: formData.subject || `Inquiry regarding ${agent?.agentName || 'Platform'}`,
                    message: formData.message,
                    userId: user?._id || user?.id || null,
                    senderType: isAdmin ? 'Admin' : 'User'
                };

                const response = await apiService.contactVendor(payload);

                if (response.success) {
                    // Optimistically add message to list
                    const newMessage = {
                        _id: Date.now().toString(), // Temporary ID
                        message: formData.message,
                        senderRole: isAdmin ? 'admin' : 'user',
                        createdAt: new Date().toISOString()
                    };

                    setMessages(prev => [...prev, newMessage]);
                }
            }

            // Clear input
            setFormData(prev => ({ ...prev, message: '' }));

            // Re-fetch to ensure sync
            fetchChatHistory(true);

        } catch (err) {
            let errMsg = 'Failed to send message. Please try again.';
            if (err.response?.data) {
                if (typeof err.response.data === 'string') errMsg = err.response.data;
                else if (typeof err.response.data === 'object' && err.response.data.message) errMsg = err.response.data.message;
            }
            setError(errMsg);
        } finally {
            setLoading(false);
            setTimeout(scrollToBottom, 100);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };


    const handleClearChat = (e) => {
        e?.stopPropagation();
        console.log('🗑️ Clear Chat clicked!', { messagesCount: messages.length });

        if (window.confirm('Are you sure you want to clear this chat? This action cannot be undone.')) {
            console.log('✅ User confirmed, clearing messages...');
            setMessages([]);
            console.log('✅ Messages cleared!');
        } else {
            console.log('❌ User cancelled');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 md:left-[420px] z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className={`absolute inset-0 ${isDark ? 'bg-[#0B0F1A]/80' : 'bg-black/40'} backdrop-blur-md`}
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className={`relative w-full max-w-2xl h-[600px] ${isDark ? 'bg-[#161D35] border-[#8B5CF6]/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)]' : 'bg-white border-gray-100'} rounded-[32px] shadow-2xl border overflow-hidden flex flex-col`}
                >
                    {/* Chat Header */}
                    <div className={`px-8 py-5 border-b ${isDark ? 'border-white/5 bg-[#161D35]/50' : 'border-gray-50 bg-white/50'} backdrop-blur-md sticky top-0 z-10`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-indigo-500 p-0.5 shadow-lg shadow-[#8B5CF6]/20`}>
                                <div className={`w-full h-full ${isDark ? 'bg-[#0B0F1A]' : 'bg-white'} rounded-[14px] flex items-center justify-center overflow-hidden`}>
                                    <img src={agent?.avatar} className="w-full h-full object-cover" alt={agent?.agentName} />
                                </div>
                            </div>
                            <div>
                                <h2 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'} leading-none`}>{agent?.agentName || agent?.name}</h2>
                                {activeReportId ? (
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <p className="text-[10px] font-bold text-[#8B5CF6] uppercase tracking-widest">
                                            Replying to Ticket: {formData.ticketType || 'Support'}
                                        </p>
                                    </div>
                                ) : (
                                    <p className={`text-[10px] font-bold ${isDark ? 'text-[#AAB0D6]' : 'text-gray-400'} uppercase tracking-widest mt-1`}>Vendor Protocol Active</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleClearChat}
                                className="w-9 h-9 bg-red-50 hover:bg-red-100 text-red-500 rounded-full flex items-center justify-center transition-all"
                                title="Clear Chat"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={onClose}
                                className="w-9 h-9 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-full flex items-center justify-center transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className={`flex-1 overflow-y-auto p-8 space-y-6 ${isDark ? 'bg-[#0B0F1A]/50' : 'bg-gray-50/30'}`}>
                        {/* Ticket Description Context - For Admin only */}
                        {activeReportId && user?.role === 'admin' && formData.subject && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center w-full mb-4"
                            >
                                <div className="bg-purple-50 border border-purple-100 px-4 py-2 rounded-xl text-[11px] font-bold text-purple-600 uppercase tracking-tight text-center">
                                    CONTEXT: "{formData.subject}"
                                </div>
                            </motion.div>
                        )}
                        {/* System Welcome Message - Always Visible */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-start w-full"
                        >
                            <div className={`max-w-[85%] px-6 py-4 rounded-[26px] font-medium text-[14px] shadow-sm ${isDark ? 'bg-[#161D35] text-white border-white/5' : 'bg-white text-gray-600 border-gray-100'} rounded-bl-none border relative overflow-hidden group`}>
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#8B5CF6]" />
                                <p className="leading-relaxed">
                                    👋 Hello! Welcome to <span className={`text-[#8B5CF6] font-bold`}>{agent?.agentName}</span> support channel.
                                </p>
                                <p className={`mt-2 text-xs ${isDark ? 'text-[#AAB0D6]' : 'text-gray-500'} opacity-70`}>
                                    Please feel free to ask your questions here. Our vendor team will review your message and respond shortly!
                                </p>
                            </div>
                            <span className={`text-[10px] font-bold ${isDark ? 'text-[#AAB0D6]' : 'text-gray-300'} mt-1.5 ml-2 uppercase tracking-widest`}>Automated Greeting</span>
                        </motion.div>

                        {loadingMessages ? (
                            <div className="flex justify-center pt-10">
                                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : (
                            messages.map((msg, index) => {
                                const isMeEmail = user?.email === 'admin@uwo24.com' || user?.email === 'admin@aimall.com';
                                const isAdminRole = user?.role === 'admin' || isMeEmail;
                                const isVendorRole = user?.role === 'vendor';

                                // Determine if this message is from "me" (the current user)
                                // In this Marketplace Modal:
                                // 'admin' is "me" if I AM an admin.
                                // 'user' is "me" if I AM NOT an admin (I am the customer).
                                // 'vendor' is NEVER "me" here (it's the person I'm contacting).
                                const isMe = (msg.senderRole === 'admin' && isAdminRole) ||
                                    (msg.senderRole === 'user' && !isAdminRole);

                                // Debug logging
                                console.log('💬 Message Debug:', {
                                    message: msg.message,
                                    senderRole: msg.senderRole,
                                    userRole: user?.role,
                                    userEmail: user?.email,
                                    isAdminRole,
                                    isVendorRole,
                                    isMe
                                });

                                return (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={msg._id || index}
                                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} w-full`}
                                    >
                                        <div className={`max-w-[80%] px-5 py-3 rounded-[22px] font-medium text-[14px] shadow-sm ${isMe
                                            ? 'bg-[#8B5CF6] text-white rounded-br-mini shadow-[#8B5CF6]/10'
                                            : `${isDark ? 'bg-[#161D35] text-white border-white/5' : 'bg-white text-gray-700 border-gray-100'} rounded-bl-mini border shadow-sm`
                                            }`}>
                                            {msg.message}
                                        </div>
                                        <div className={`flex items-center gap-1 mt-1 opacity-60 text-[10px] font-bold ${isMe ? 'justify-end' : 'justify-start'} ${isDark ? 'text-[#AAB0D6]' : 'text-gray-300'}`}>
                                            <span>{isMe ? 'You' : (msg.senderRole === 'vendor' ? 'Vendor' : 'Admin')}</span>
                                            •
                                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </motion.div>
                                )
                            })
                        )}
                        <div ref={messagesEndRef} />

                        {error && (
                            <div className="mt-4 bg-red-50 border border-red-100 rounded-[22px] px-5 py-3.5 text-sm font-medium text-red-600">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Chat Input Area */}
                    <div className={`p-6 ${isDark ? 'bg-[#161D35] border-white/5' : 'bg-white border-gray-50'} border-t`}>
                        <form onSubmit={handleSubmit} className="relative group">
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={1}
                                className={`w-full ${isDark ? 'bg-[#0B0F1A] border-white/10 text-white focus:border-[#8B5CF6]/40' : 'bg-gray-50 border-gray-100 text-gray-900 focus:border-purple-300'} rounded-[28px] px-6 py-4 pr-16 text-sm font-medium placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-[#8B5CF6]/5 transition-all resize-none shadow-inner`}
                                placeholder="Type your message..."
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit(e);
                                    }
                                }}
                            />
                            <button
                                type="submit"
                                disabled={loading || !formData.message.trim()}
                                className={`absolute right-2 top-2 w-10 h-10 ${isDark ? 'bg-[#8B5CF6] hover:bg-[#7c3aed]' : 'bg-[#8b5cf6] hover:bg-purple-700'} text-white rounded-full flex items-center justify-center transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-[#8B5CF6]/30 group-hover:scale-105 active:scale-95`}
                            >
                                {loading ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <Send className="w-5 h-5 translate-x-0.5" />
                                )}
                            </button>
                        </form>
                        <p className="text-[9px] font-bold text-gray-400 text-center mt-3 uppercase tracking-widest opacity-60">
                            Secure protocol encryption enabled
                        </p>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ContactVendorModal;
