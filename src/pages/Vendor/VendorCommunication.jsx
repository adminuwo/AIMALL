import React from 'react';
import { Mail, Shield, MessageSquare, Bell, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const VendorCommunication = () => {
    // Mock Data for User Support
    const userEmails = [
        { id: 1, user: 'david@client.com', app: 'AI Content Writer', subject: 'Billing question for Pro plan', status: 'Open', date: '2 hours ago' },
        { id: 2, user: 'sarah@startup.io', app: 'Code Helper Pro', subject: 'Feature request: Python 3.12 support', status: 'Replied', date: '1 day ago' },
        { id: 3, user: 'mike@test.org', app: 'Code Helper Pro', subject: 'Login issues', status: 'Closed', date: '3 days ago' },
    ];

    // Mock Data for Admin Support
    const adminMessages = [
        { id: 1, sender: 'Admin', subject: 'Platform Policy Update: Q1 2026', status: 'Unread', date: 'Dec 28, 2025' },
        { id: 2, sender: 'Admin', subject: 'Payout Confirmation #9821', status: 'Read', date: 'Dec 24, 2025' },
    ];

    return (
        <div className="space-y-12 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2">Secure <span className="text-[#8b5cf6]">Comms.</span></h1>
                    <p className="text-gray-500 font-bold text-lg tracking-tight max-w-xl">Centralized hub for all incoming and outgoing transmissions.</p>
                </div>
            </div>

            {/* A) USER SUPPORT */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[40px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] overflow-hidden"
            >
                <div className="px-8 py-6 border-b border-white/60 bg-white/20 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                            <Mail size={20} />
                        </div>
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">User Transmission Log</h2>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/40 border-b border-white/60">
                            <tr>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Origin Node</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Target App</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Subject Line</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/50">
                            {userEmails.map((email, index) => (
                                <motion.tr
                                    key={email.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + (index * 0.05) }}
                                    className="hover:bg-white/60 transition-colors"
                                >
                                    <td className="px-8 py-5 font-bold text-gray-900">{email.user}</td>
                                    <td className="px-8 py-5 text-sm font-medium text-gray-500">{email.app}</td>
                                    <td className="px-8 py-5 text-sm font-medium text-gray-700">{email.subject}</td>
                                    <td className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">{email.date}</td>
                                    <td className="px-8 py-5 text-right">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${email.status === 'Open' ? 'bg-red-50 text-red-600 border border-red-100' :
                                            email.status === 'Replied' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                'bg-gray-100 text-gray-500 border border-gray-200'
                                            }`}>
                                            {email.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.section>

            {/* B) ADMIN SUPPORT */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[40px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] overflow-hidden"
            >
                <div className="px-8 py-6 border-b border-white/60 bg-white/20 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                            <Shield size={20} />
                        </div>
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Admin Directives</h2>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/40 border-b border-white/60">
                            <tr>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Source</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Directive Subject</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Received Date</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/50">
                            {adminMessages.map((msg, index) => (
                                <motion.tr
                                    key={msg.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + (index * 0.05) }}
                                    className="hover:bg-white/60 transition-colors"
                                >
                                    <td className="px-8 py-5 font-bold text-gray-900 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-[#8b5cf6]"></div>
                                        {msg.sender}
                                    </td>
                                    <td className="px-8 py-5 text-sm font-medium text-gray-700">{msg.subject}</td>
                                    <td className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">{msg.date}</td>
                                    <td className="px-8 py-5 text-right">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${msg.status === 'Unread' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                            }`}>
                                            {msg.status === 'Read' && <CheckCircle2 size={12} className="mr-1" />}
                                            {msg.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.section>
        </div>
    );
};

export default VendorCommunication;
