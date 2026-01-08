import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Send, Check } from 'lucide-react';
import axios from 'axios';

const ContactVendorModal = ({ isOpen, onClose, agent, user }) => {
    const [formData, setFormData] = useState({
        userName: user?.name || '',
        userEmail: user?.email || '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/messages/contact-vendor', {
                agentId: agent._id,
                userName: formData.userName,
                userEmail: formData.userEmail,
                subject: formData.subject,
                message: formData.message,
                userId: user?._id || null
            });

            if (response.data.success) {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                    setFormData({ userName: user?.name || '', userEmail: user?.email || '', subject: '', message: '' });
                }, 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="relative w-full max-w-2xl max-h-[90vh] bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/60 overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                        <div className="relative flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                    <Mail className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white tracking-tight">Contact Vendor</h2>
                                    <p className="text-white/80 text-sm font-semibold">Regarding: {agent?.agentName}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl flex items-center justify-center transition-all"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Success State */}
                    {success ? (
                        <div className="p-12 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200 }}
                                className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <Check className="w-10 h-10 text-emerald-600" />
                            </motion.div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">Message Sent!</h3>
                            <p className="text-gray-600 font-semibold">The vendor will receive your message and respond via email.</p>
                        </div>
                    ) : (
                        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                {/* Agent Info */}
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-1">Agent</p>
                                    <p className="text-sm font-bold text-gray-900">{agent?.agentName}</p>
                                </div>

                                {/* User Name */}
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        name="userName"
                                        value={formData.userName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent font-semibold text-gray-900 transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                {/* User Email */}
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                                        Your Email
                                    </label>
                                    <input
                                        type="email"
                                        name="userEmail"
                                        value={formData.userEmail}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent font-semibold text-gray-900 transition-all"
                                        placeholder="your.email@example.com"
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        maxLength={200}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent font-semibold text-gray-900 transition-all"
                                        placeholder="Brief description of your inquiry"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        maxLength={2000}
                                        rows={6}
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-transparent font-semibold text-gray-900 transition-all resize-none"
                                        placeholder="Describe your question or issue in detail..."
                                    />
                                    <p className="text-xs text-gray-400 mt-2 font-semibold">{formData.message.length}/2000 characters</p>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                        <p className="text-sm font-bold text-red-600">{error}</p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black rounded-xl transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] hover:shadow-lg hover:shadow-purple-500/30 text-white font-black rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ContactVendorModal;
