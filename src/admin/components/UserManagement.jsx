import React, { useState, useEffect } from 'react';
import { Ban, Search, User, Loader2, Bot, ShieldCheck, ShoppingBag, ChevronDown, ChevronUp, UserCheck, Activity, Trash2, Layers } from 'lucide-react';
import apiService from '../../services/apiService';
import { useToast } from '../../Components/Toast/ToastContext';
import { motion } from 'framer-motion';

const UserManagement = () => {
    const toast = useToast();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedUser, setExpandedUser] = useState(null);

    const [viewMode, setViewMode] = useState('AIMALL'); // 'AIMALL', 'ASERIES', or 'AISA'

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await apiService.getAllUsers();
            setUsers(data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount || 0);
    };

    const toggleExpand = (userId) => {
        if (expandedUser === userId) {
            setExpandedUser(null);
        } else {
            setExpandedUser(userId);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const isAdmin = user.role?.toLowerCase() === 'admin' || user.email === 'admin@uwo24.com';
        const isAISA = user.platform === 'AISA' || user.email?.includes('aisa');
        const isASeries = user.platform === 'A-SERIES' || user.platform === 'ASERIES';
        const isAIMall = user.platform === 'AI-MALL' || user.platform === 'AIMALL' || (!user.platform && !isAISA && !isASeries);

        if (viewMode === 'ASERIES') {
            // Show A-SERIES users AND all admins
            return matchesSearch && (isASeries || isAdmin);
        }

        if (viewMode === 'AISA') {
            return matchesSearch && !isAdmin && isAISA;
        }

        // AI-MALL view: Show AI-MALL users AND all admins
        return matchesSearch && (isAIMall || isAdmin);
    });

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
            return;
        }
        try {
            await apiService.deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
            toast.success("User deleted successfully");
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error("Failed to delete user: " + (err.response?.data?.error || err.message));
        }
    };

    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-[24px] bg-[#8b5cf6]/20 flex items-center justify-center animate-spin">
                <Loader2 className="w-8 h-8 text-[#8b5cf6]" />
            </div>
            <p className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-[0.4em]">Loading Users...</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                WebkitFontSmoothing: 'antialiased',
                textRendering: 'optimizeLegibility',
                backfaceVisibility: 'hidden'
            }}
            className="space-y-4 pb-24"
        >
            <div className="flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h2 className="text-lg md:text-2xl font-black text-gray-900 tracking-tighter mb-1 flex-wrap">
                            <span>
                                {viewMode === 'ASERIES' ? <>A-SERIES<sup className="text-[10px] md:text-[0.5em] font-bold ml-0.5 relative -top-[0.6em] md:-top-[0.8em]">TM</sup></> : viewMode === 'AISA' ? <>AISA<sup className="text-[10px] md:text-[0.5em] font-bold ml-0.5 relative -top-[0.6em] md:-top-[0.8em]">TM</sup></> : <>AI-MALL<sup className="text-[10px] md:text-[0.5em] font-bold ml-0.5 relative -top-[0.6em] md:-top-[0.8em]">TM</sup></>}
                            </span>
                            <span className="ml-2">User Management</span>
                        </h2>
                        <p className="text-gray-500 font-medium text-xs">
                            {viewMode === 'ASERIES' ? 'Manage platform system users and admins' : viewMode === 'AISA' ? <>Manage AISA<sup className="text-[8px] font-bold ml-0.5 relative -top-[0.5em]">TM</sup> platform specific users</> : 'Manage platform users, vendors, and roles'}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 p-1.5 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[24px] shadow-sm self-start lg:self-auto">
                        <button
                            onClick={() => setViewMode('ASERIES')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${viewMode === 'ASERIES'
                                ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20 scale-105'
                                : 'text-gray-400 hover:text-gray-900 hover:bg-white/40'
                                }`}
                        >
                            <Layers className="w-4 h-4" />
                            <span>A SERIES<sup className="text-[7px] md:text-[0.6em] font-bold ml-1 relative -top-[0.4em] md:-top-[0.6em]">TM</sup></span>
                        </button>
                        <button
                            onClick={() => setViewMode('AISA')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${viewMode === 'AISA'
                                ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20 scale-105'
                                : 'text-gray-400 hover:text-gray-900 hover:bg-white/40'
                                }`}
                        >
                            <Bot className="w-4 h-4" />
                            <span>AISA<sup className="text-[7px] md:text-[0.6em] font-bold ml-1 relative -top-[0.4em] md:-top-[0.6em]">TM</sup></span>
                        </button>
                        <button
                            onClick={() => setViewMode('AIMALL')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${viewMode === 'AIMALL'
                                ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20 scale-105'
                                : 'text-gray-400 hover:text-gray-900 hover:bg-white/40'
                                }`}
                        >
                            <ShoppingBag className="w-4 h-4" />
                            <span>AI MALL<sup className="text-[7px] md:text-[0.6em] font-bold ml-1 relative -top-[0.4em] md:-top-[0.6em]">TM</sup></span>
                        </button>
                    </div>
                </div>

                <div className="relative group w-full max-w-md">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#d946ef]/20 to-[#8b5cf6]/20 rounded-[24px] blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative flex items-center bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[20px] px-4 py-3 focus-within:ring-4 focus-within:ring-[#8b5cf6]/10 transition-all">
                        <Search className="w-4 h-4 text-gray-400 group-focus-within:text-[#8b5cf6] transition-colors flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-transparent outline-none ml-3 font-medium text-sm text-gray-900 placeholder-gray-400"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[32px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/60 bg-white/20">
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">User</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Role</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Subscriptions</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Total Spent</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/60">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <React.Fragment key={user.id}>
                                        <tr className="hover:bg-white/40 transition-colors group">
                                            <td className="px-6 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white font-black shadow-lg">
                                                        {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-xl object-cover" /> : user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 text-sm">{user.name}</p>
                                                        <p className="text-[10px] font-medium text-gray-500">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3">
                                                {(() => {
                                                    const isAdmin = user.role?.toLowerCase() === 'admin' || user.email === 'admin@uwo24.com';
                                                    return (
                                                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${isAdmin ? 'bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20' : 'bg-gray-100 text-gray-500 border-gray-200'} `}>
                                                            {isAdmin && <ShieldCheck className="w-3 h-3" />}
                                                            {isAdmin ? 'ADMIN' : user.role}
                                                        </span>
                                                    );
                                                })()}
                                            </td>
                                            <td className="px-6 py-3">
                                                <button
                                                    onClick={() => toggleExpand(user.id)}
                                                    className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors focus:outline-none px-2 py-1 rounded-lg border ${expandedUser === user.id ? 'bg-white border-gray-200 shadow-sm' : 'bg-transparent border-transparent text-gray-400 hover:bg-white/50 hover:text-gray-600'}`}
                                                >
                                                    <span>{user.agents?.length || 0} Agents</span>
                                                    {expandedUser === user.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                                </button>
                                            </td>
                                            <td className="px-6 py-3">
                                                <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${user.isBlocked ? 'bg-red-50 text-red-600 border-red-100' : (user.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100')}`}>
                                                    <div className={`w-1 h-1 rounded-full ${user.isBlocked ? 'bg-red-500' : (user.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500')}`} />
                                                    {user.isBlocked ? 'Blocked' : user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-right font-black text-gray-900 text-xs">
                                                {formatCurrency(user.spent)}
                                            </td>
                                            <td className="px-6 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-1.5 rounded-lg transition-all text-gray-400 hover:text-red-500 hover:bg-red-50"
                                                        title="Delete User"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                        {expandedUser === user.id && (
                                            <tr className="bg-white/30 border-b border-white/60">
                                                <td colSpan="6" className="px-8 py-6">
                                                    <div className="bg-white/50 rounded-2xl p-6 border border-white/60 shadow-inner">
                                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Active Subscriptions</p>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {user.agents && user.agents.length > 0 ? (
                                                                user.agents.map((agent, idx) => (
                                                                    <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                                                                <Bot className="w-4 h-4 text-gray-400" />
                                                                            </div>
                                                                            <span className="text-sm font-bold text-gray-900 line-clamp-1">{agent.agentName || agent.name}</span>
                                                                        </div>
                                                                        {(() => {
                                                                            const priceType = typeof agent.pricing === 'object' ? agent.pricing?.type : agent.pricing;
                                                                            return (
                                                                                <span className={`text-[9px] px-2 py-1 rounded-lg font-black uppercase tracking-wider ${priceType === 'Pro' ? 'bg-[#8b5cf6]/10 text-[#8b5cf6]' : priceType === 'Basic' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                                                                    {priceType || 'Free'}
                                                                                </span>
                                                                            );
                                                                        })()}
                                                                    </div>
                                                                ))
                                                            ) : (
                                                                <div className="col-span-full p-4 text-center text-sm font-medium text-gray-400 italic">No active subscriptions found</div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 rounded-[2rem] bg-gray-50 border border-white flex items-center justify-center shadow-inner">
                                                <UserCheck className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 text-lg mb-1">No users found.</p>
                                                <p className="text-gray-500 font-medium text-sm">Try adjusting your search terms.</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </motion.div>
    );
};

export default UserManagement;
