import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Zap, ShieldCheck, Loader2, Trash2, MessageSquare, Info, Star, Activity } from 'lucide-react';
import { apiService } from '../services/apiService';
import { useLanguage } from '../context/LanguageContext';

const ExpandedAgentChat = ({ isOpen, onClose, agent, user, isDark }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);
    const { t } = useLanguage();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchChatHistory = async (silent = false) => {
        if (!agent || !user) return;
        const targetVendorId = agent.owner || agent.vendorId;
        if (!targetVendorId) return;

        if (!silent) setLoadingMessages(true);
        try {
            const userId = user._id || user.id;
            const response = await apiService.getConversationHistory(userId, targetVendorId, agent._id);

            if (response.success && Array.isArray(response.data)) {
                const processed = [];
                response.data.forEach(msg => {
                    processed.push({
                        _id: msg._id,
                        message: msg.message,
                        senderRole: msg.senderType?.toLowerCase() || 'user',
                        createdAt: msg.createdAt
                    });
                    if (msg.replyMessage) {
                        processed.push({
                            _id: `${msg._id}_reply`,
                            message: msg.replyMessage,
                            senderRole: 'vendor',
                            createdAt: msg.repliedAt || msg.updatedAt
                        });
                    }
                });
                processed.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                setMessages(processed);
            }
        } catch (err) {
            console.error('Failed to fetch history:', err);
        } finally {
            if (!silent) setLoadingMessages(false);
            setTimeout(scrollToBottom, 50);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        setError('');
        try {
            const payload = {
                agentId: agent._id,
                vendorId: agent.owner || agent.vendorId,
                userName: user?.name,
                userEmail: user?.email,
                subject: `Inquiry regarding ${agent.agentName}`,
                message: newMessage,
                userId: user?._id || user?.id,
                senderType: 'User'
            };

            const res = await apiService.contactVendor(payload);
            if (res.success) {
                setNewMessage('');
                fetchChatHistory(true);
            }
        } catch (err) {
            setError('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        if (isOpen && agent) {
            fetchChatHistory();
            const interval = setInterval(() => fetchChatHistory(true), 5000);
            return () => clearInterval(interval);
        }
    }, [isOpen, agent]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleClearChat = async () => {
        if (!window.confirm('Are you sure you want to clear your chat history with this agent? This action cannot be undone.')) return;

        const targetVendorId = agent.owner || agent.vendorId;
        const userId = user._id || user.id;

        try {
            const res = await apiService.clearConversationHistory(userId, targetVendorId, agent._id);
            if (res.success) {
                setMessages([]);
            }
        } catch (err) {
            console.error('Failed to clear chat:', err);
        }
    };

    if (!isOpen || !agent) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center md:p-8 overflow-hidden">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className={`absolute inset-0 ${isDark ? 'bg-[#0B0F1A]/95' : 'bg-slate-900/60'} backdrop-blur-2xl`}
                />

                {/* Big Card Expansion */}
                <motion.div
                    layoutId={`card-${agent._id}`}
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                    className={`relative w-full md:max-w-5xl h-[100dvh] md:h-[85vh] ${isDark
                        ? 'bg-[#161D35] md:border-[#8B5CF6]/20 shadow-[0_50px_100px_rgba(0,0,0,0.6)]'
                        : 'bg-white md:border-white shadow-[0_50px_100px_rgba(0,0,0,0.1)]'
                        } rounded-none md:rounded-[40px] md:border flex flex-col md:flex-row overflow-hidden backdrop-blur-3xl`}
                >
                    {/* Left Panel: Agent Info */}
                    <div className={`hidden md:flex md:w-[350px] flex-col border-r ${isDark ? 'border-white/5 bg-white/5' : 'border-gray-100 bg-gray-50/50'} p-8 relative overflow-hidden`}>
                        {/* Purple Glow Background */}
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-[80px]" />

                        <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-8">
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className={`w-28 h-28 rounded-[32px] p-1 ${isDark ? 'bg-[#0B0F1A]' : 'bg-white'} shadow-2xl border ${isDark ? 'border-white/10' : 'border-white'} overflow-hidden mb-6 mx-auto`}
                                >
                                    <img
                                        src={agent.avatar || `https://ui-avatars.com/api/?name=${agent.agentName}&background=8b5cf6&color=fff`}
                                        className="w-full h-full object-cover rounded-[28px]"
                                        alt=""
                                    />
                                </motion.div>

                                <motion.h2
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'} text-center uppercase tracking-tighter mb-2`}
                                >
                                    {agent.agentName}
                                </motion.h2>

                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="flex items-center justify-center gap-2 mb-8"
                                >
                                    <div className="px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center gap-1.5">
                                        <Zap size={10} className="text-[#8B5CF6] fill-[#8B5CF6]" />
                                        <span className="text-[9px] font-black text-[#8B5CF6] uppercase tracking-[0.1em]">{agent.category || 'Business OS'}</span>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-1.5">
                                        <Activity size={10} className="text-green-500" />
                                        <span className="text-[9px] font-black text-green-500 uppercase tracking-[0.1em]">Online</span>
                                    </div>
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="flex-1 space-y-6"
                            >
                                <div className={`p-5 rounded-3xl ${isDark ? 'bg-white/5' : 'bg-white'} border ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                                    <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-[#8B5CF6] uppercase tracking-widest">
                                        <Info size={12} />
                                        Description
                                    </div>
                                    <p className={`text-[13px] ${isDark ? 'text-white/60' : 'text-slate-500'} font-medium leading-relaxed`}>
                                        {agent.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-[24px] ${isDark ? 'bg-white/5' : 'bg-white'} border ${isDark ? 'border-white/5' : 'border-gray-100'} text-center`}>
                                        <div className="text-lg font-black text-[#8B5CF6]">2.4k</div>
                                        <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Interactions</div>
                                    </div>
                                    <div className={`p-4 rounded-[24px] ${isDark ? 'bg-white/5' : 'bg-white'} border ${isDark ? 'border-white/5' : 'border-gray-100'} text-center`}>
                                        <div className="text-lg font-black text-[#8B5CF6]">4.9</div>
                                        <div className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-1">Rating</div>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="mt-8 pt-6 border-t border-white/5">
                                <div className="flex items-center gap-3 px-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-pink-500" />
                                    <div>
                                        <div className={`text-[10px] font-black ${isDark ? 'text-white' : 'text-slate-900'} uppercase tracking-tight`}>Handled by AI-MALL</div>
                                        <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Verified Vendor Node</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Chat Interface */}
                    <div className="flex-1 flex flex-col h-full relative">
                        {/* Chat Header (Mobile Friendly) */}
                        <div className={`p-4 md:p-6 border-b ${isDark ? 'border-white/5 bg-[#161D35]/50' : 'border-gray-50 bg-white/50'} backdrop-blur-xl flex items-center justify-between`}>
                            <div className="flex items-center gap-3">
                                <div className="md:hidden w-10 h-10 rounded-xl overflow-hidden border border-[#8B5CF6]/20">
                                    <img src={agent.avatar || `https://ui-avatars.com/api/?name=${agent.agentName}&background=8b5cf6&color=fff`} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={`hidden xs:flex w-9 h-9 md:w-10 md:h-10 rounded-2xl ${isDark ? 'bg-purple-500/10' : 'bg-purple-50'} items-center justify-center`}>
                                        <MessageSquare size={18} className="text-[#8B5CF6]" />
                                    </div>
                                    <div>
                                        <h3 className={`text-sm md:text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'} uppercase tracking-tight line-clamp-1`}>{agent.agentName} Support</h3>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                            <span className="text-[8px] md:text-[9px] font-black text-green-500 uppercase tracking-widest">{t('activeConnection')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleClearChat}
                                    title="Clear Chat History"
                                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isDark ? 'bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white' : 'bg-red-50 hover:bg-red-100 text-red-500'
                                        }`}
                                >
                                    <Trash2 size={20} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-gray-100 hover:bg-gray-200 text-slate-500'
                                        }`}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Message Feed */}
                        <div
                            className={`flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-8 no-scrollbar ${isDark ? 'bg-[#0B0F1A]/30' : 'bg-gray-50/20'}`}
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            <style>{`
                                .no-scrollbar::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>
                            {/* System Welcome Card */}
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mb-6 md:mb-12">
                                <div className={`max-w-md w-full p-4 md:p-6 pb-2 rounded-[24px] md:rounded-[32px] text-center ${isDark ? 'bg-white/5 border-white/5' : 'bg-white border-gray-100'} border shadow-2xl relative overflow-hidden`}>
                                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B5CF6] via-pink-500 to-[#8B5CF6]" />
                                    <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center mx-auto mb-4">
                                        <ShieldCheck size={28} className="text-[#8B5CF6]" />
                                    </div>
                                    <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'} uppercase tracking-widest mb-2`}>{t('privateSupport')}</h4>
                                    <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-500'} font-medium leading-relaxed`}>
                                        Our vendor team will review your inquiry and contact you shortly. You are now connected.
                                    </p>
                                    <div className="mt-4 pt-4 border-t border-white/5 text-[8px] font-black text-gray-400 tracking-[0.3em] uppercase">
                                        {t('secureProtocol')}
                                    </div>
                                </div>
                            </motion.div>

                            {messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg._id || idx}
                                    className={`flex flex-col gap-2 ${msg.senderRole === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div className={`max-w-[85%] md:max-w-[75%] p-3 px-5 md:p-4 md:px-6 rounded-[20px] md:rounded-[28px] ${msg.senderRole === 'user'
                                        ? 'bg-[#8B5CF6] text-white rounded-tr-none shadow-xl shadow-[#8B5CF6]/20'
                                        : `${isDark ? 'bg-[#161D35] border border-white/10 text-white/90' : 'bg-white border border-gray-100 text-slate-700'} rounded-tl-none shadow-sm`
                                        }`}>
                                        <p className="text-[13px] md:text-[14px] font-medium leading-relaxed">{msg.message}</p>
                                    </div>
                                    <div className="flex items-center gap-2 px-2">
                                        <span className={`text-[9px] font-black ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-widest`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {msg.senderRole === 'user' && <ShieldCheck size={9} className="text-[#8B5CF6]" />}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className={`p-4 md:p-8 ${isDark ? 'bg-[#161D35]/50 border-white/5' : 'bg-white border-gray-50'} border-t backdrop-blur-3xl`}>
                            <form onSubmit={handleSendMessage} className="relative group flex items-center gap-2 md:gap-3">
                                <div className="flex-1 relative">
                                    <textarea
                                        rows={2}
                                        placeholder={t('typeMessage')}
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage(e);
                                            }
                                        }}
                                        className={`w-full py-4 md:py-6 px-6 md:px-8 rounded-[24px] md:rounded-[32px] text-sm md:text-base font-bold ${isDark
                                            ? 'bg-white/5 border-white/10 text-white placeholder-white/20 focus:border-[#8B5CF6]/50'
                                            : 'bg-gray-50 border-gray-100 text-slate-900 placeholder-gray-400 focus:border-[#8B5CF6]/50'
                                            } border outline-none transition-all shadow-inner resize-none`}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className={`w-12 h-12 md:w-14 md:h-14 rounded-[18px] md:rounded-[22px] flex items-center justify-center transition-all ${newMessage.trim()
                                        ? 'bg-[#8B5CF6] text-white shadow-2xl shadow-[#8B5CF6]/40 hover:scale-105 active:scale-95'
                                        : 'bg-gray-500/10 text-gray-500 cursor-not-allowed grayscale'
                                        }`}
                                >
                                    {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="md:size-24 translate-x-0.5" />}
                                </button>
                            </form>
                            <div className="flex items-center justify-center gap-2 mt-3 md:mt-4 opacity-30 select-none">
                                <ShieldCheck size={8} className={`md:size-10 ${isDark ? 'text-white' : 'text-slate-900'}`} />
                                <span className={`text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] ${isDark ? 'text-white' : 'text-slate-900'}`}>Private and Secure</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ExpandedAgentChat;
