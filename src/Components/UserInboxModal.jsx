import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, MessageCircle, ChevronRight, Clock, User } from 'lucide-react';
import { apiService } from '../services/apiService';

const UserInboxModal = ({ isOpen, onClose, user, onSelectThread }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && user) {
            fetchMessages();
        }
    }, [isOpen, user]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const userId = user.id || user._id;
            const response = await apiService.getUserMessages(userId);
            if (response.success) {
                // Group messages by Agent (Thread)
                // We want to show the LATEST message for each agent
                const threads = {};
                response.data.forEach(msg => {
                    if (!threads[msg.agentId]) {
                        threads[msg.agentId] = msg;
                    } else {
                        // Keep the newer one
                        if (new Date(msg.createdAt) > new Date(threads[msg.agentId].createdAt)) {
                            threads[msg.agentId] = msg;
                        }
                    }
                });

                // If a message has a reply, the reply timestamp (repliedAt) might be newer?
                // But the reply is INSIDE the msg object (replyMessage).
                // If status is 'Replied', show that interaction.

                setMessages(Object.values(threads).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
                >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 leading-none">Inbox</h2>
                            <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">Vendor Communications</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-400 rounded-full flex items-center justify-center transition-all"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {loading ? (
                            <div className="flex justify-center py-10">
                                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400">
                                <Mail className="w-12 h-12 mb-4 opacity-20" />
                                <p className="font-bold">No messages yet</p>
                                <p className="text-xs mt-1">Contact a vendor to start a conversation</p>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const hasReply = msg.status === 'Replied';
                                return (
                                    <button
                                        key={msg._id}
                                        onClick={() => {
                                            // Construct a "stub" agent object to pass to ContactVendorModal
                                            const stubAgent = {
                                                _id: msg.agentId,
                                                agentName: msg.agentName || 'Unknown Agent',
                                                owner: msg.vendorId, // Important: Vendor ID
                                                // We don't have avatar, but that's okay, UI handles missing avatar
                                                type: 'agent' // Ensures logic works
                                            };
                                            onSelectThread(stubAgent);
                                        }}
                                        className="w-full text-left p-4 rounded-[24px] bg-gray-50 hover:bg-purple-50 transition-all border border-transparent hover:border-purple-100 group relative overflow-hidden"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center">
                                                    <User size={14} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-sm leading-tight">{msg.agentName}</h3>
                                                    <p className="text-[10px] text-gray-500 font-medium">{hasReply ? 'Vendor Replied' : 'Sent to Vendor'}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded-full shadow-sm">
                                                {new Date(msg.updatedAt || msg.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="pl-10">
                                            <p className="text-sm text-gray-600 line-clamp-1 font-medium">
                                                {hasReply ? (
                                                    <span className="text-purple-600 flex items-center gap-1">
                                                        <MessageCircle size={12} fill="currentColor" /> {msg.replyMessage}
                                                    </span>
                                                ) : (
                                                    msg.message
                                                )}
                                            </p>
                                        </div>

                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronRight className="w-5 h-5 text-purple-400" />
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default UserInboxModal;
