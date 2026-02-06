import React, { useState, useEffect } from 'react';
import { Activity, Loader2, Edit2, EyeOff, Plus, Search, Filter, Package, Zap, ArrowRight, ShieldCheck, Layers, Check, Trash2, ShoppingBag } from 'lucide-react';
import apiService from '../../services/apiService';
import CreateAppModal from './CreateAppModal';
import AppDetails from './AppDetails';
import { motion, AnimatePresence } from 'framer-motion';

const AgentManagement = () => {
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [newAppName, setNewAppName] = useState('');
    const [selectedApp, setSelectedApp] = useState(null);
    const [viewMode, setViewMode] = useState('AIMALL'); // 'AIMALL' or 'ASERIES'
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    const fetchStats = async () => {
        try {
            const data = await apiService.getAdminOverviewStats();
            setStatsData(data);
        } catch (err) {
            console.error("Failed to fetch admin overview stats/inventory:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleCreateApp = async (formData) => {
        try {
            const payload = {
                ...formData,
                url: formData.agentUrl,
                reviewStatus: 'Approved',
                status: 'Live'
            };
            delete payload.agentUrl;

            console.log('Creating agent with payload:', payload);
            const result = await apiService.createAgent(payload);
            console.log('Agent created:', result);

            setNewAppName(formData.agentName);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
            await fetchStats();
        } catch (error) {
            console.error("Error creating agent:", error);
            alert("Failed to create app. Please check the console for details.");
            throw error;
        }
    };

    // Helper to safely render pricing
    const renderPricing = (pricing) => {
        if (!pricing) return 'Free';
        if (typeof pricing === 'string') return pricing;
        if (typeof pricing === 'object') {
            // Adjust this based on your actual object structure, e.g. pricing.type or pricing.amount
            return pricing.amount || pricing.type || 'Custom';
        }
        return 'Unknown';
    };

    const A_SERIES_FALLBACK = [
        "AISA", "AIDOC", "AIPHOTO", "AIPHARMA", "AIHEALTH", "AIDESK", "AIBRAND", "AIHR", "AISTAFF",
        "AIDESIGN", "AIVOICE", "AIWRITE", "AISALES", "AILEAD", "AIMARKET", "AITEAM", "AIBILL",
        "AISCRIPT", "AILAB", "AIANIMATE", "AIMED", "AIMIND", "AIOFFICE", "AIFIT", "AIGENE",
        "AIBIZ", "AIFUNNEL", "AIVIDEO", "AIAUDIT", "AIPAY", "AITRANS", "AICALL", "AICARE",
        "AICRM", "AICORE", "AIBOT", "AICONNECT", "AILEGAL", "AISCAN", "AIAD", "AIHIRE",
        "AIPSYCH", "AIFLOW", "AIBASE", "AITAX", "AIGAME", "AISTREAM", "AICRAFT", "AIMUSIC"
    ];

    const filteredInventory = (() => {
        const rawItems = statsData?.inventory || [];

        // Filter based on view mode
        let filtered = rawItems.filter(app => {
            const isASeries = !app.owner || app.platform === 'A-SERIES';
            if (viewMode === 'ASERIES') return isASeries;
            return !isASeries || app.platform === 'BOTH';
        });

        // If in A-SERIES mode, ensure all fallback agents are present
        if (viewMode === 'ASERIES') {
            const existingNames = new Set(filtered.map(a => a.name?.toUpperCase()));
            const fallbacks = A_SERIES_FALLBACK.filter(name => !existingNames.has(name))
                .map(name => ({
                    id: `fallback-${name}`,
                    name: name,
                    status: 'Coming Soon',
                    pricing: { plans: [] },
                    usageCount: 0,
                    category: 'System Agent'
                }));
            filtered = [...filtered, ...fallbacks];
        }

        // Apply Search and Filter
        return filtered.filter(app => {
            if (app.id?.startsWith('mock-')) return false;

            const matchesSearch = app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.id?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter = filterStatus === 'All' ||
                app.status === filterStatus ||
                app.category === filterStatus;

            return matchesSearch && matchesFilter;
        });
    })();

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-[24px] bg-[#8b5cf6]/20 flex items-center justify-center animate-spin">
                    <Loader2 className="w-8 h-8 text-[#8b5cf6]" />
                </div>
                <p className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-[0.4em]">Loading Agents...</p>
            </div>
        );
    }

    if (selectedApp) {
        return (
            <AppDetails
                app={selectedApp}
                onBack={() => setSelectedApp(null)}
                onDelete={() => {
                    fetchStats();
                    setSelectedApp(null);
                }}
                onUpdate={() => fetchStats()}
                isAdmin={true}
            />
        );
    }

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">
                            {viewMode === 'ASERIES' ? (
                                <>A-SERIES<sup className="text-[10px] md:text-[0.5em] font-bold ml-0.5 relative -top-[0.6em] md:-top-[0.8em]">TM</sup></>
                            ) : (
                                <>AI-MALL<sup className="text-[10px] md:text-[0.5em] font-bold ml-0.5 relative -top-[0.6em] md:-top-[0.8em]">TM</sup></>
                            )}
                            <span className="ml-2">Agents</span>
                        </h1>
                        <p className="text-gray-500 font-medium text-xs">
                            {viewMode === 'ASERIES' ? 'Manage your a series agent inventory and deployments' : 'Manage your AI agent inventory and deployments'}
                        </p>
                    </div>

                    <div className="flex items-center gap-1 p-1 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[20px] shadow-sm">
                        <button
                            onClick={() => setViewMode('ASERIES')}
                            className={`flex items-center gap-2 px-5 py-2 rounded-[16px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${viewMode === 'ASERIES'
                                ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/20'
                                : 'text-gray-400 hover:text-gray-900 hover:bg-white/40'
                                }`}
                        >
                            <Layers className="w-3.5 h-3.5" />
                            <span>A SERIES<sup className="text-[7px] md:text-[0.6em] font-bold ml-0.5 relative -top-[0.4em] md:-top-[0.6em]">TM</sup></span>
                        </button>
                        <button
                            onClick={() => setViewMode('AIMALL')}
                            className={`flex items-center gap-2 px-5 py-2 rounded-[16px] text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${viewMode === 'AIMALL'
                                ? 'bg-[#8B5CF6] text-white shadow-md shadow-[#8B5CF6]/20'
                                : 'text-gray-400 hover:text-gray-900 hover:bg-white/40'
                                }`}
                        >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>AI MALL<sup className="text-[7px] md:text-[0.6em] font-bold ml-0.5 relative -top-[0.4em] md:-top-[0.6em]">TM</sup></span>
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-[#8b5cf6] text-white px-6 py-2 rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-[#7c3aed] shadow-lg shadow-[#8b5cf6]/20 transition-all flex items-center gap-2 transform hover:scale-105 active:scale-95 group"
                    >
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                        Create New Agent
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-emerald-50 border border-emerald-100 rounded-[24px] p-6 flex items-center justify-between shadow-sm"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">Success!</h3>
                                <p className="text-emerald-700 font-medium text-sm">Agent "{newAppName}" has been deployed successfully.</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="text-[10px] font-black text-emerald-700 uppercase tracking-widest hover:text-emerald-900"
                        >
                            Dismiss
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[32px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]">
                <div className="p-5 border-b border-white/60 bg-white/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative group w-full md:w-96">
                        <div className="flex items-center w-full bg-white/40 backdrop-blur-md border border-white/60 rounded-[16px] px-4 py-2.5 focus-within:ring-4 focus-within:ring-[#8b5cf6]/10 focus-within:border-[#8b5cf6]/30 transition-all">
                            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-[#8b5cf6] transition-colors flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Search agents..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="flex-1 bg-transparent outline-none ml-3 text-sm font-medium text-gray-900 placeholder-gray-400 placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 relative z-20">
                        <div className="relative">
                            <button
                                onClick={() => setShowFilterMenu(!showFilterMenu)}
                                className={`px-6 py-3 bg-white/40 border border-white/60 rounded-[16px] text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 hover:bg-white/60 transition-all flex items-center gap-2 ${showFilterMenu ? 'bg-white/60 text-[#8b5cf6] ring-2 ring-[#8b5cf6]/10' : ''}`}
                            >
                                <Filter className="w-3 h-3" />
                                {filterStatus === 'All' ? 'Filter' : filterStatus}
                            </button>

                            <AnimatePresence>
                                {showFilterMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute left-0 md:left-auto md:right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-2xl border border-white/60 rounded-2xl shadow-xl z-50 overflow-hidden p-1.5"
                                    >
                                        {['All', 'Live', 'Draft', 'Coming Soon', 'Business OS', 'Sales & Marketing', 'HR & Finance', 'Productivity'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => {
                                                    setFilterStatus(status);
                                                    setShowFilterMenu(false);
                                                }}
                                                className={`w-full text-left px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${filterStatus === status
                                                    ? 'bg-[#8b5cf6]/10 text-[#8b5cf6]'
                                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                {status}
                                                {filterStatus === status && <Check className="w-3 h-3" />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-white/30 border-b border-white/60">
                            <tr>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Agent Name</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Plans (M/Y)</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Users / Status</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/60">
                            {filteredInventory.length > 0 ? (
                                filteredInventory.map((app) => (
                                    <tr
                                        key={app.id}
                                        onClick={() => setSelectedApp(app)}
                                        className="hover:bg-white/40 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-[#d946ef]/10 to-[#8b5cf6]/10 flex items-center justify-center border border-white/60 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                    <Package className="w-4 h-4 text-[#8b5cf6]" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 group-hover:text-[#8b5cf6] transition-colors">{app.name || 'Unnamed App'}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-wider">ID: {app.id?.substring(0, 8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">M:</span>
                                                    <span className="text-xs font-bold text-gray-900">
                                                        {app.pricing?.plans?.find(p => p.billingCycle === 'monthly')?.amount ? `₹${app.pricing.plans.find(p => p.billingCycle === 'monthly').amount}` : 'Free'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-gray-400 tracking-widest uppercase">Y:</span>
                                                    <span className="text-xs font-bold text-gray-900">
                                                        {app.pricing?.plans?.find(p => p.billingCycle === 'yearly')?.amount ? `₹${app.pricing.plans.find(p => p.billingCycle === 'yearly').amount}` : 'Free'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-center">
                                            <div className="flex flex-col items-center gap-1.5">
                                                <div className="flex items-center gap-2 px-2 py-1 bg-white/40 border border-white/60 rounded-lg">
                                                    <Activity className="w-3 h-3 text-[#8b5cf6]" />
                                                    <span className="text-[10px] font-black text-gray-900">{app.usageCount || 0}</span>
                                                </div>
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${app.status === 'Live' || app.status === 'Active'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : 'bg-gray-50 text-gray-500 border-gray-100'
                                                    }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${app.status === 'Live' || app.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
                                                    {app.status || 'Inactive'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-all">
                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm(`Are you sure you want to permanently delete "${app.name}"? This will remove it from the marketplace and notify all users.`)) {
                                                            try {
                                                                await apiService.deleteAgent(app._id || app.id);
                                                                await fetchStats(); // Refresh the list
                                                            } catch (error) {
                                                                alert("Delete failed: " + (error.response?.data?.error || error.message));
                                                            }
                                                        }
                                                    }}
                                                    className="p-2 hover:bg-red-50 rounded-xl text-gray-400 hover:text-red-600 transition-all hover:shadow-md"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedApp(app); }}
                                                    className="group/btn relative flex items-center gap-2 pl-3 pr-2 py-1.5 bg-white/20 hover:bg-white rounded-xl text-gray-400 hover:text-gray-900 transition-all hover:shadow-md border border-white/60"
                                                >
                                                    <span className="text-[9px] font-black uppercase tracking-widest hidden group-hover/btn:block">Manage</span>
                                                    <ArrowRight className="w-3 h-3 group-hover/btn:text-[#8b5cf6]" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-10 py-32 text-center opacity-50">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center border border-white shadow-sm">
                                                <Zap className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">No agents found in {viewMode === 'ASERIES' ? 'A-SERIES' : 'AI-MALL'}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
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

export default AgentManagement;
