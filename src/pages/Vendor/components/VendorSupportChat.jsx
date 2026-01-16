import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Loader2, MoreVertical, MessageSquare, ArrowLeft, Paperclip, Plus, X, AlertTriangle, Headset, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../../../services/apiService';

const VendorSupportChat = () => {
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

    // New Ticket Modal State
    const [isSignalModalOpen, setIsSignalModalOpen] = useState(false);
    const [signalData, setSignalData] = useState({ type: 'AdminSupport', priority: 'medium', description: '' });
    const [submittingSignal, setSubmittingSignal] = useState(false);

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchReports = async () => {
        try {
            const data = await apiService.getMyReports();
            setReports(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (reportId, silent = false) => {
        try {
            const data = await apiService.getReportMessages(reportId);
            setMessages(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setTimeout(scrollToBottom, 100);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    useEffect(() => {
        if (selectedReport) {
            fetchMessages(selectedReport._id);
        }
    }, [selectedReport]);

    useEffect(() => {
        // Auto-refresh reports list
        const reportsInterval = setInterval(fetchReports, 5000);
        return () => clearInterval(reportsInterval);
    }, []);

    useEffect(() => {
        if (!selectedReport) return;
        // Auto-refresh messages for active report
        const msgInterval = setInterval(() => fetchMessages(selectedReport._id, true), 3000);
        return () => clearInterval(msgInterval);
    }, [selectedReport]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!newMessage.trim() || !selectedReport) {
            console.log('[DEBUG-BLOCKED] Missing message or report');
            return;
        }

        const tempId = Date.now().toString();
        const tempMsg = {
            _id: tempId,
            message: newMessage,
            senderRole: 'vendor',
            createdAt: new Date().toISOString()
        };

        setMessages(prev => [...prev, tempMsg]);
        const msgToSend = newMessage;
        setNewMessage('');

        try {
            const sentMsg = await apiService.sendReportMessage(selectedReport._id, msgToSend);
            setMessages(prev => prev.map(msg => msg._id === tempId ? sentMsg : msg));
            fetchReports(); // Refresh list to update "last message" snippet if we had one
        } catch (err) {
            console.error(err);
            setMessages(prev => prev.filter(msg => msg._id !== tempId));
            setNewMessage(msgToSend);
            alert("Failed to send message");
        }
    };

    const handleSignalSubmit = async (e) => {
        e.preventDefault();
        if (!signalData.description.trim()) return;

        setSubmittingSignal(true);
        try {
            const newReport = await apiService.submitReport(signalData);
            setSignalData({ type: 'AdminSupport', priority: 'medium', description: '' });
            setIsSignalModalOpen(false);
            await fetchReports();
            if (newReport && newReport._id) {
                // Select new report immediately
                const data = await apiService.getMyReports();
                const found = (data || []).find(r => r._id === newReport._id);
                if (found) {
                    setSelectedReport(found);
                    setIsMobileChatOpen(true);
                }
            }
        } catch (err) {
            alert("Failed to submit ticket");
        } finally {
            setSubmittingSignal(false);
        }
    };


    const handleClearChat = async (e) => {
        e?.stopPropagation();

        if (!selectedReport) {
            console.log('❌ No report selected');
            return;
        }

        if (window.confirm('Are you sure you want to clear this chat? This action cannot be undone and will delete the chat history for both you and the admin.')) {
            console.log('✅ User confirmed, deleting messages from backend...');
            try {
                // Call backend API to delete messages from the report
                await apiService.deleteReportMessages(selectedReport._id);
                console.log('✅ Messages deleted from backend!');

                // Clear local state
                setMessages([]);

                // Refresh the reports list to update the UI
                await fetchReports();

                alert('Chat history deleted successfully!');
            } catch (err) {
                console.error('❌ Failed to delete messages:', err);
                alert('Failed to delete chat history. Please try again.');
            }
        } else {
            console.log('❌ User cancelled');
        }
    };

    // Filter reports
    const filteredReports = reports.filter(r =>
        r.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-140px)] w-full overflow-hidden relative bg-slate-50 font-sans text-slate-800 border border-slate-200 rounded-3xl shadow-sm">
            {/* Sidebar */}
            <div className={`
                ${isMobileChatOpen ? 'hidden md:flex' : 'flex'}
                w-full md:w-[320px] bg-white border-r border-slate-200 flex-col h-full shrink-0 z-20 transition-all duration-300
            `}>
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-lg text-slate-800">Support Tickets</h2>
                    <button
                        onClick={() => setIsSignalModalOpen(true)}
                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                        title="New Ticket"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                {/* Search */}
                <div className="px-4 py-3">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-100 text-slate-700 text-sm rounded-xl pl-10 pr-4 py-2.5 border-none outline-none focus:ring-2 focus:ring-indigo-500/20 placeholder:text-slate-400 transition-all"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredReports.length === 0 && !loading && (
                        <div className="p-8 text-center text-slate-400">
                            <p className="text-sm">No tickets found.</p>
                        </div>
                    )}

                    {filteredReports.map((report) => {
                        const isActive = selectedReport?._id === report._id;
                        return (
                            <button
                                key={report._id}
                                onClick={() => {
                                    setSelectedReport(report);
                                    setIsMobileChatOpen(true);
                                }}
                                className={`
                                    w-full flex items-center gap-4 px-4 py-4 border-b border-slate-50 transition-colors text-left
                                    ${isActive ? 'bg-indigo-50/50 border-indigo-100' : 'hover:bg-slate-50 bg-white'}
                                `}
                            >
                                <div className={`
                                    w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-bold text-lg
                                    ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}
                                `}>
                                    {report.type === 'bug' ? <AlertTriangle size={20} /> : <Headset size={20} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`block truncate font-semibold text-sm ${isActive ? 'text-indigo-900' : 'text-slate-700'}`}>
                                            {report.type === 'bug' ? 'Bug Report' : (report.type === 'account' ? 'Account Issue' : 'General Support')}
                                        </span>
                                        <span className="text-[10px] text-slate-400 shrink-0">
                                            {new Date(report.timestamp).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 truncate">
                                        {report.description || 'No description'}
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
                {selectedReport ? (
                    <>
                        {/* Header */}
                        <div className="h-[70px] bg-white px-6 flex items-center justify-between shrink-0 border-b border-slate-200 shadow-sm z-10">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setIsMobileChatOpen(false)} className="md:hidden text-slate-500 hover:bg-slate-100 p-2 rounded-full">
                                    <ArrowLeft size={20} />
                                </button>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                        A
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 leading-tight">Admin Support</h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            <span className="text-xs text-slate-500 font-medium">Online</span>
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

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6">

                            {/* Automated Greeting Message */}
                            <div className="flex w-full justify-start">
                                <div className="flex max-w-[80%] md:max-w-[60%] flex-row gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs mt-1 shrink-0">
                                        A
                                    </div>
                                    <div className="group relative px-5 py-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 text-slate-700 border-l-4 border-indigo-500 rounded-tl-sm text-sm leading-relaxed shadow-sm">
                                        <p className="font-semibold text-indigo-900 mb-2">👋 Hello! Welcome to Admin Support.</p>
                                        <p className="text-slate-600">Thank you for reaching out. Our admin team will review your request and respond shortly. Please feel free to provide any additional details that might help us assist you better!</p>
                                        <p className="text-[10px] uppercase text-indigo-400 mt-2 font-bold tracking-widest">Automated Greeting</p>
                                    </div>
                                </div>
                            </div>

                            {messages.map((msg, index) => {
                                const isMe = msg.senderRole?.toLowerCase() === 'vendor';
                                return (
                                    <div key={index} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`flex max-w-[80%] md:max-w-[60%] ${isMe ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                                            {!isMe && (
                                                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs mt-1 shrink-0">
                                                    A
                                                </div>
                                            )}
                                            <div className={`
                                                group relative px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
                                                ${isMe
                                                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                                                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-sm'
                                                }
                                            `}>
                                                <p className="whitespace-pre-wrap">{msg.message}</p>
                                                <div className={`
                                                    text-[10px] mt-1 text-right font-medium
                                                    ${isMe ? 'text-indigo-200' : 'text-slate-400'}
                                                `}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
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
                            <Headset size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Admin Support</h2>
                        <p className="max-w-xs text-slate-500 mb-8">
                            Select a ticket to view conversation or create a new one.
                        </p>
                        <button
                            onClick={() => setIsSignalModalOpen(true)}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all"
                        >
                            Create New Ticket
                        </button>
                    </div>
                )}
            </div>

            {/* New Ticket Modal */}
            <AnimatePresence>
                {isSignalModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h3 className="text-lg font-bold text-slate-800">New Support Ticket</h3>
                                <button onClick={() => setIsSignalModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSignalSubmit} className="p-6 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Issue Description</label>
                                    <textarea
                                        required
                                        value={signalData.description}
                                        onChange={(e) => setSignalData({ ...signalData, description: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all min-h-[120px] resize-none"
                                        placeholder="Describe your issue..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Priority</label>
                                        <select
                                            value={signalData.priority}
                                            onChange={(e) => setSignalData({ ...signalData, priority: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Category</label>
                                        <select
                                            value={signalData.type}
                                            onChange={(e) => setSignalData({ ...signalData, type: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        >
                                            <option value="AdminSupport">General</option>
                                            <option value="bug">Bug Report</option>
                                            <option value="account">Account</option>
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submittingSignal || !signalData.description.trim()}
                                    className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20"
                                >
                                    {submittingSignal ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Ticket'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default VendorSupportChat;
