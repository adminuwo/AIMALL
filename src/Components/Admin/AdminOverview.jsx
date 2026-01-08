import React, { useState, useEffect } from 'react';
import {
    Users,
    ShoppingBag,
    Star,
    Activity,
    Search,
    ChevronRight,
    MoreHorizontal,
    TrendingUp,
    DollarSign,
    CreditCard,
    Loader2,
    Sparkles,
    ShieldCheck,
    Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../../services/apiService';
import CreateAppModal from './CreateAppModal';

const AdminOverview = () => {
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const fetchStats = async () => {
        try {
            const data = await apiService.getAdminOverviewStats();
            setStatsData(data);
        } catch (err) {
            console.error("Failed to fetch admin overview stats:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleCreateApp = async (formData) => {
        try {
            const payload = { ...formData, url: formData.agentUrl };
            delete payload.agentUrl;
            await apiService.createAgent(payload);
            await fetchStats();
        } catch (error) {
            console.error("Error creating agent:", error);
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center bg-transparent gap-4">
                <div className="w-16 h-16 rounded-[24px] bg-[#8b5cf6]/20 flex items-center justify-center animate-spin">
                    <Loader2 className="w-8 h-8 text-[#8b5cf6]" />
                </div>
                <p className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-[0.4em]">Synchronizing Nexus</p>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12 pb-24"
        >
            {/* Command Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="w-5 h-5 text-[#8b5cf6]" />
                        <span className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-[0.4em]">Strategic Oversight</span>
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-none mb-3">Control <span className="text-[#8b5cf6]">Center.</span></h1>
                    <p className="text-gray-500 font-medium text-lg max-w-xl">Deep telemetry across all neural nodes and financial pathways.</p>
                </div>

                <div className="relative group w-full lg:w-96">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#d946ef]/20 to-[#8b5cf6]/20 rounded-[28px] blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <input
                        type="text"
                        placeholder="SEARCH PROTOCOLS..."
                        className="relative w-full bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[24px] px-8 py-5 pl-14 focus:outline-none focus:ring-4 focus:ring-[#8b5cf6]/10 transition-all font-black text-xs uppercase tracking-widest text-gray-900"
                    />
                    <Search className="w-5 h-5 absolute left-6 top-1/2 -translate-y-1/2 text-[#8b5cf6] opacity-40 group-focus-within:opacity-100" />
                </div>
            </div>

            {/* Performance Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[56px] p-12 h-[520px] relative overflow-hidden group shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]"
                    >
                        <div className="flex items-center justify-between mb-12">
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Ecosystem <span className="text-[#8b5cf6]">Vitals</span></h3>
                            <div className="flex gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6] shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Units</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#d946ef] shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue Flow</span>
                                </div>
                            </div>
                        </div>

                        <div className="absolute inset-x-12 bottom-12 top-32">
                            <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                                    </linearGradient>
                                    <linearGradient id="pinkGlow" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#d946ef" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 3, ease: "circOut" }}
                                    d="M0,250 C100,220 200,80 300,120 C400,160 500,240 600,180 C700,120 800,150 1000,100"
                                    fill="none" stroke="#8b5cf6" strokeWidth="8" strokeLinecap="round"
                                />
                                <path d="M0,250 C100,220 200,80 300,120 C400,160 500,240 600,180 C700,120 800,150 1000,100 L1000,300 L0,300 Z" fill="url(#purpleGlow)" />
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 4, delay: 0.5, ease: "circOut" }}
                                    d="M0,280 C150,250 250,200 350,220 C450,240 550,100 650,140 C750,180 850,80 1000,50"
                                    fill="none" stroke="#d946ef" strokeWidth="8" strokeLinecap="round"
                                />
                                <path d="M0,280 C150,250 250,200 350,220 C450,240 550,100 650,140 C750,180 850,80 1000,50 L1000,300 L0,300 Z" fill="url(#pinkGlow)" />
                            </svg>
                        </div>
                    </motion.div>
                </div>

                <div className="lg:col-span-1">
                    <motion.div
                        whileHover={{ y: -8 }}
                        className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[56px] p-12 h-full flex flex-col items-center justify-between text-center group shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]"
                    >
                        <div className="w-full">
                            <div className="relative inline-block mb-10">
                                <div className="absolute -inset-4 bg-gradient-to-br from-[#d946ef]/20 to-[#8b5cf6]/20 rounded-[48px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="relative w-32 h-32 rounded-[40px] bg-white p-2 border border-white/60 shadow-2xl">
                                    <div className="w-full h-full rounded-[32px] bg-gradient-to-br from-gray-100 to-white flex items-center justify-center overflow-hidden">
                                        <img src="https://ui-avatars.com/api/?name=Admin&background=8b5cf6&color=fff&size=128" alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center">
                                        <ShieldCheck size={14} className="text-white" />
                                    </div>
                                </div>
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2 uppercase">Root Master</h3>
                            <p className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-[0.4em] mb-10 opacity-70">Unified Security Level 10</p>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="flex items-center justify-between p-6 bg-white/40 rounded-[32px] border border-white/60">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Balance</span>
                                <span className="text-xl font-black text-gray-900 tracking-tight">$24,942.00</span>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="w-full py-6 bg-gray-900 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-[#8b5cf6] transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                            >
                                <ShoppingBag size={18} />
                                Provision Agent
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Sub-Telemetry Nodes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[56px] p-12">
                    <div className="flex items-center justify-between mb-12">
                        <div className="flex items-center gap-4">
                            <Globe size={24} className="text-[#8b5cf6]" />
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Vendor Matrix</h3>
                        </div>
                        <button className="px-6 py-2.5 bg-white/60 border border-white/80 rounded-2xl text-[10px] font-black text-gray-900 uppercase tracking-widest hover:bg-white transition-all shadow-sm">Audit All</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { name: 'Neural Soft', sales: '842', trend: '+12%', color: 'from-[#d946ef] to-[#8b5cf6]' },
                            { name: 'Visionary AI', sales: '654', trend: '+8%', color: 'from-[#8b5cf6] to-blue-500' },
                            { name: 'Analytics Hub', sales: '921', trend: '+15%', color: 'from-blue-500 to-emerald-500' },
                            { name: 'ChatFleet 2.0', sales: '432', trend: '+5%', color: 'from-emerald-500 to-amber-500' }
                        ].map((vendor, i) => (
                            <div key={i} className="flex items-center justify-between p-7 bg-white/40 rounded-[36px] border border-white/60 hover:bg-white hover:shadow-xl transition-all group cursor-pointer">
                                <div className="flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-[24px] bg-gradient-to-br ${vendor.color} flex items-center justify-center text-white font-black shadow-lg group-hover:rotate-6 transition-transform`}>
                                        {vendor.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-black text-gray-900 text-sm tracking-tight">{vendor.name}</p>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{vendor.sales} Transactions</p>
                                    </div>
                                </div>
                                <div className="bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                                    <p className="text-[10px] font-black text-emerald-600">{vendor.trend}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[56px] p-12 flex flex-col">
                    <div className="flex items-center gap-4 mb-12">
                        <Activity size={24} className="text-[#8b5cf6]" />
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Health</h3>
                    </div>
                    <div className="flex-1 space-y-6">
                        {[
                            { label: 'Neural Latency', value: '42ms', status: 'SYNCHRONIZED', color: 'bg-emerald-500' },
                            { label: 'Uptime Protocol', value: '99.9%', status: 'STABLE', color: 'bg-[#8b5cf6]' },
                            { label: 'Packet Integrity', value: '98.4%', status: 'VALIDATED', color: 'bg-[#d946ef]' }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{stat.status}</p>
                                </div>
                                <div className="flex items-center gap-5 p-5 bg-white/40 rounded-3xl border border-white/60">
                                    <span className="text-2xl font-black text-gray-900 tracking-tighter">{stat.value}</span>
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '85%' }}
                                            transition={{ duration: 2, delay: i * 0.2 }}
                                            className={`h-full ${stat.color} rounded-full`}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <CreateAppModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSubmit={handleCreateApp}
            />
        </motion.div>
    );
};

export default AdminOverview;
