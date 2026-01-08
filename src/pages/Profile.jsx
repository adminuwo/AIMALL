import React from 'react';
import { motion } from 'framer-motion';
import {
    CircleUser,
    Settings,
    Shield,
    Clock,
    Star,
    Infinity,
    ChevronRight,
    LogOut,
    User as UserIcon,
    Globe,
    Zap,
    IndianRupee,
    LayoutGrid,
    Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { AppRoute } from '../types';
import { getUserData, clearUser } from '../userStore/userData';

const Profile = () => {
    const navigate = useNavigate();
    const user = getUserData() || { name: 'User', email: 'user@example.com' };

    const stats = [
        {
            label: 'Total Sessions',
            value: '128',
            icon: Clock,
            color: 'bg-blue-500/10 text-blue-600',
        },
        {
            label: 'Neural Link',
            value: 'Optimal',
            icon: Zap,
            color: 'bg-[#8b5cf6]/10 text-[#8b5cf6]',
        },
        {
            label: 'Intelligence',
            value: 'Level 42',
            icon: Star,
            color: 'bg-amber-500/10 text-amber-600',
        },
        {
            label: 'Security',
            value: 'Shielded',
            icon: Shield,
            color: 'bg-emerald-500/10 text-emerald-600',
        }
    ];

    const handleLogout = () => {
        clearUser();
        navigate(AppRoute.LANDING);
    };

    return (
        <div className="h-full flex flex-col bg-transparent p-4 md:p-8 lg:p-12 overflow-y-auto no-scrollbar relative">
            <div className="max-w-5xl mx-auto w-full space-y-12 pb-24 animate-in fade-in slide-in-from-bottom duration-700">

                {/* Profile Header - High Fidelity Glass */}
                <div className="flex flex-col md:flex-row items-center gap-10 bg-white/40 backdrop-blur-3xl border border-white/60 p-6 md:p-10 lg:p-16 rounded-[48px] md:rounded-[64px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#8b5cf6]/5 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative">
                        <div className="w-36 h-36 rounded-[48px] bg-white p-2 border border-white/60 shadow-2xl relative z-10">
                            <div className="w-full h-full rounded-[40px] bg-gradient-to-br from-[#d946ef] to-[#8b5cf6] flex items-center justify-center text-white overflow-hidden shadow-inner">
                                <UserIcon className="w-16 h-16" strokeWidth={1.5} />
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-emerald-500 border-8 border-white rounded-[20px] z-20 shadow-lg flex items-center justify-center">
                            <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-4 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-none">{user.name}<span className="text-[#8b5cf6]">.</span></h1>
                            <div className="flex items-center gap-2 px-4 py-2 bg-[#8b5cf6]/10 rounded-2xl border border-[#8b5cf6]/20 self-center md:self-auto">
                                <Sparkles className="w-3.5 h-3.5 text-[#8b5cf6]" />
                                <span className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-widest">Premium Entity</span>
                            </div>
                        </div>
                        <p className="text-gray-500 font-bold text-xl tracking-tight opacity-70">{user.email}</p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white/40 px-4 py-2 rounded-xl border border-white/60">
                                <Clock size={12} className="text-[#8b5cf6]" />
                                Dec 2025
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest bg-white/40 px-4 py-2 rounded-xl border border-white/60">
                                <Shield size={12} className="text-[#8b5cf6]" />
                                Shield Active
                            </div>
                        </div>
                    </div>

                    <div className="md:ml-auto relative z-10">
                        <button
                            onClick={() => navigate(AppRoute.SECURITY)}
                            className="px-10 py-5 bg-gray-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl hover:bg-[#8b5cf6] hover:scale-105 active:scale-95 group flex items-center gap-3"
                        >
                            <Shield className="w-4 h-4" />
                            Security Protocol
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 + index * 0.1 }}
                            className="bg-white/40 backdrop-blur-3xl border border-white/60 p-10 rounded-[48px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(139,92,246,0.15)] transition-all group cursor-default"
                        >
                            <div className={`w-16 h-16 ${stat.color} rounded-[24px] flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform shadow-sm border border-white/50`}>
                                <stat.icon className="w-7 h-7" />
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3">{stat.label}</p>
                            <div className="text-3xl font-black text-gray-900 tracking-tighter uppercase">
                                {stat.value}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[64px] p-12 space-y-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-[20px] bg-[#8b5cf6]/10 flex items-center justify-center text-[#8b5cf6] border border-[#8b5cf6]/20 shadow-sm">
                                <Settings size={24} />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Calibration</h2>
                        </div>

                        <div className="space-y-4">
                            {[
                                { label: 'LINGUAL SET', value: 'Nexus English', icon: Globe },
                                { label: 'TEMPORAL LOCUS', value: 'Asia/Kolkata', icon: Clock },
                                { label: 'CURRENCY NODE', value: 'INR (₹)', icon: IndianRupee },
                                { label: 'VISUAL LAYER', value: 'Glassmorphism 2.1', icon: LayoutGrid }
                            ].map((item) => (
                                <div key={item.label} className="flex justify-between items-center p-8 bg-white/40 border border-white rounded-[32px] hover:bg-white hover:shadow-2xl hover:translate-x-3 transition-all duration-700 cursor-pointer group">
                                    <div className="flex items-center gap-6">
                                        <item.icon className="w-6 h-6 text-gray-300 group-hover:text-[#8b5cf6] transition-colors" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-black text-gray-900 uppercase tracking-tight">{item.value}</span>
                                        <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-[#8b5cf6]" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[64px] p-12 flex flex-col justify-between shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />

                            <div className="space-y-12">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-[20px] bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/20">
                                        <Shield size={24} />
                                    </div>
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Security</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-6 p-10 bg-emerald-500/5 border border-emerald-500/10 rounded-[40px] relative overflow-hidden group">
                                        <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500 opacity-20" />
                                        <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] animate-pulse" />
                                        <p className="text-[11px] font-black text-emerald-800 uppercase tracking-[0.2em]">Neural Encryption Pipeline: STABLE</p>
                                    </div>

                                    <div className="p-10 bg-white/40 border border-white rounded-[40px] shadow-sm">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 opacity-60">Authentication Lock</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">Multi-Factor active</span>
                                            <button className="px-6 py-3 bg-white text-gray-900 text-[10px] font-black uppercase tracking-widest border border-gray-100 rounded-2xl shadow-sm hover:bg-[#8b5cf6] hover:text-white transition-all">Adjust</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full py-8 bg-red-50 text-red-500 border border-red-500/10 rounded-[40px] font-black text-xs uppercase tracking-[0.3em] shadow-sm hover:bg-red-500 hover:text-white hover:shadow-2xl hover:shadow-red-500/30 transition-all flex items-center justify-center gap-4 active:scale-95 group"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            Terminate Sequence
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
