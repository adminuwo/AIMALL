import React, { useState, useEffect } from 'react';
import { Mail, Shield, MessageSquare, Bell, CheckCircle2, X, Send, User, Search, Play, Trash2, Zap, MessageCircle, FileText, ChevronRight, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../../services/apiService';

const VendorCommunication = () => {
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [adminMessages, setAdminMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    // Get logged in user (Vendor)
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const vendorId = storedUser._id || storedUser.id;

    // Mock Data for User Support (ChatGPT-style sidebar items)
    const userEmails = [
        { id: 'admin-1', user: 'AI-MALL Admin', app: 'System', subject: 'Platform Directive: KYC Update', status: 'Priority', date: 'Just now', avatar: 'A', type: 'admin' },
        { id: 1, user: 'david@client.com', app: 'AI Content Writer', subject: 'Billing question for Pro plan', status: 'Open', date: '2 hours ago', avatar: 'D', type: 'user' },
        { id: 2, user: 'sarah@startup.io', app: 'Code Helper Pro', subject: 'Feature request: Python 3.12 support', status: 'Replied', date: '1 day ago', avatar: 'S', type: 'user' },
        { id: 3, user: 'mike@test.org', app: 'Code Helper Pro', subject: 'Login issues', status: 'Closed', date: '3 days ago', avatar: 'M', type: 'user' },
    ];

    useEffect(() => {
        const fetchMessages = async () => {
            if (vendorId) {
                const response = await apiService.getVendorDashboardMessages(vendorId);
                if (response.success) {
                    setAdminMessages(response.data);
                }
            }
        };
        fetchMessages();
    }, [vendorId]);

    const handleSendReply = () => {
        if (!replyText.trim()) return;
        setLoading(true);
        // Simulate sending
        setTimeout(() => {
            setReplyText('');
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="h-[calc(100vh-140px)] flex bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[40px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
            {/* Conversations Sidebar */}
            <div className="w-80 border-r border-gray-100 flex flex-col bg-white/20">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 tracking-tighter mb-4">Messages</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search transmissions..."
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-purple-500/10 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {userEmails.map((email) => (
                        <button
                            key={email.id}
                            onClick={() => setSelectedEmail(email)}
                            className={`w-full text-left p-4 rounded-[24px] transition-all group flex gap-3 ${selectedEmail?.id === email.id ? 'bg-white shadow-lg shadow-purple-500/5 ring-1 ring-purple-100' : 'hover:bg-white/50'}`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${selectedEmail?.id === email.id ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-600'}`}>
                                {email.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                    <h4 className="text-[11px] font-black text-gray-900 truncate pr-2">{email.user}</h4>
                                    <span className="text-[9px] font-bold text-gray-400 shrink-0">{email.date}</span>
                                </div>
                                <p className="text-[10px] font-bold text-gray-500 truncate mb-1">{email.subject}</p>
                                <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-md ${email.status === 'Open' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                    {email.status}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Main Area */}
            <div className="flex-1 flex flex-col bg-gray-50/10 relative">
                {selectedEmail ? (
                    <>
                        {/* Chat Header */}
                        <div className="px-8 py-5 border-b border-gray-100 bg-white/50 backdrop-blur-md flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-black">
                                    {selectedEmail.avatar}
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-gray-900 leading-none">{selectedEmail.user}</h3>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">App: {selectedEmail.app}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                                    <MoreVertical size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Chat Messages Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {/* Incoming Message (User) */}
                            <div className="flex items-start gap-4 max-w-[80%]">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-black text-gray-500 shrink-0">
                                    {selectedEmail.avatar}
                                </div>
                                <div className="space-y-2">
                                    <div className="bg-white border border-gray-100 px-6 py-4 rounded-[24px] rounded-tl-mini shadow-sm">
                                        <p className="text-xs font-black text-purple-600 uppercase tracking-widest mb-2">Subject: {selectedEmail.subject}</p>
                                        <p className="text-sm font-medium text-gray-700 leading-relaxed">
                                            Hi, I'm having some trouble with {selectedEmail.app}. {selectedEmail.subject === 'Login issues' ? "I can't seem to log in since the last update. Can you help?" : "I wanted to ask about the Pro plan billing details. Is there a yearly discount?"}
                                        </p>
                                    </div>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">{selectedEmail.date}</span>
                                </div>
                            </div>

                            {/* Outgoing Message (Vendor - Mock) */}
                            {selectedEmail.status === 'Replied' && (
                                <div className="flex items-end justify-end gap-3 ml-auto max-w-[80%]">
                                    <div className="space-y-2 text-right">
                                        <div className="bg-[#8b5cf6] text-white px-6 py-4 rounded-[24px] rounded-br-mini shadow-lg shadow-purple-500/10">
                                            <p className="text-sm font-medium leading-relaxed text-left">
                                                Thank you for reaching out! We are currently looking into your {selectedEmail.subject.toLowerCase()}. Our team will get back to you within 24 hours.
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-end gap-1.5 opacity-60">
                                            <CheckCircle2 size={10} className="text-emerald-400" />
                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Delivered</span>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                                        V
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat Input Area */}
                        <div className="p-8 bg-white/50 border-t border-gray-100">
                            <div className="flex items-end gap-4 max-w-4xl mx-auto">
                                <div className="flex-1 relative group">
                                    <textarea
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Type your response..."
                                        rows={1}
                                        className="w-full bg-white border border-gray-200 hover:border-purple-200 focus:border-purple-400 rounded-[28px] px-6 py-4 pr-14 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500/5 transition-all shadow-sm resize-none"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendReply();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleSendReply}
                                        disabled={loading || !replyText.trim()}
                                        className="absolute right-2.5 bottom-2.5 w-10 h-10 bg-[#8b5cf6] text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-30 disabled:grayscale"
                                    >
                                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={18} className="translate-x-0.5" />}
                                    </button>
                                </div>
                            </div>
                            <p className="text-[9px] font-bold text-gray-400 text-center mt-4 uppercase tracking-[0.2em] opacity-60">
                                ChatGPT-Protocol Active | AI-MALL Encryption Stable
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6 border border-gray-100 shadow-inner">
                            <MessageSquare size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 tracking-tighter mb-2">Select a Transmission</h3>
                        <p className="text-sm font-bold text-gray-400 max-w-xs uppercase tracking-widest leading-loose">
                            Choose a conversation from the sidebar to view the secure chat history.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorCommunication;
