import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, CreditCard, Activity, Loader2, Copy, Check, Wallet, ArrowUpRight, Trash2 } from 'lucide-react';
import apiService from '../../services/apiService';
import { motion } from 'framer-motion';

const Financials = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    const fetchData = async () => {
        try {
            const stats = await apiService.getAdminRevenueStats();
            setData(stats);
        } catch (err) {
            console.error("Failed to load financials", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (appId, appName) => {
        if (!window.confirm(`Are you sure you want to delete "${appName}"? This cannot be undone.`)) return;

        try {
            await apiService.deleteAgent(appId);
            // Refresh data
            fetchData();
        } catch (error) {
            console.error("Failed to delete agent:", error);
            alert("Failed to delete agent. Please try again.");
        }
    };

    const handleCopy = (id, text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-[24px] bg-[#8b5cf6]/20 flex items-center justify-center animate-spin">
                    <Loader2 className="w-8 h-8 text-[#8b5cf6]" />
                </div>
                <p className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-[0.4em]">Loading Financials...</p>
            </div>
        );
    }

    const overview = data?.overview || { totalGross: 0, totalVendorPayouts: 0, totalPlatformNet: 0 };
    const apps = data?.appPerformance || [];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const Card = ({ id, title, amount, subtitle, icon: Icon, gradient }) => (
        <motion.div
            whileHover={{ y: -5 }}
            onClick={() => handleCopy(id, formatCurrency(amount))}
            className="group relative overflow-hidden bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[28px] p-5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] cursor-pointer transition-all"
        >
            <div className="flex items-start justify-between mb-3 relative z-10">
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-[#8b5cf6] transition-colors">{title}</p>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tighter mt-1">
                        {copiedId === id ? (
                            <span className="flex items-center gap-2 text-lg text-emerald-500 animate-in fade-in zoom-in">
                                <Check className="w-5 h-5" /> Copied!
                            </span>
                        ) : (
                            formatCurrency(amount)
                        )}
                    </h3>
                </div>
                <div className={`w-10 h-10 rounded-[16px] bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>
            <p className="text-[10px] font-bold text-gray-500 relative z-10 flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-[#8b5cf6] transition-colors`} />
                {subtitle}
            </p>

            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 pb-24"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">Revenue & Payouts</h2>
                    <p className="text-gray-500 font-medium text-xs">Platform-wide financial performance and earnings</p>
                </div>
                <div className="glass-pill px-4 py-2 flex items-center gap-3">
                    <Wallet className="w-4 h-4 text-[#8b5cf6]" />
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Next Payout: <span className="text-[#8b5cf6]">Pending</span></span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                    id="gross"
                    title="Total Gross Revenue"
                    amount={overview.totalGross}
                    subtitle="Before platform fees & payouts"
                    icon={TrendingUp}
                    gradient="from-blue-500 to-cyan-400"
                />

                <Card
                    id="payouts"
                    title="Total Vendor Payouts"
                    amount={overview.totalVendorPayouts}
                    subtitle="Disbursed to vendors (50%)"
                    icon={CreditCard}
                    gradient="from-emerald-500 to-teal-400"
                />

                <Card
                    id="net"
                    title="Net Platform Earnings"
                    amount={overview.totalPlatformNet}
                    subtitle="Gross Revenue - Vendor Payouts"
                    icon={DollarSign}
                    gradient="from-[#8b5cf6] to-[#d946ef]"
                />
            </div>

            {/* App-wise Performance Table */}
            <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[32px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]">
                <div className="p-5 border-b border-white/60 bg-white/20 flex items-center justify-between">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">App Performance</h3>
                    <button className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-widest hover:text-[#7c3aed] transition-colors flex items-center gap-2">
                        View All Reports <ArrowUpRight className="w-3 h-3" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/30 border-b border-white/60">
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">App Name</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Total Revenue</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Vendor Earnings</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Platform Fees (50%)</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/60">
                            {apps.length > 0 ? (
                                apps.map((app) => (
                                    <tr key={app.id} className="hover:bg-white/40 transition-colors group">
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center font-black text-gray-900 shadow-sm border border-white">
                                                    {app.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-sm text-gray-900 group-hover:text-[#8b5cf6] transition-colors">{app.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-right font-medium text-xs text-gray-500">{formatCurrency(app.totalRevenue)}</td>
                                        <td className="px-6 py-3 text-right font-black text-xs text-emerald-600 bg-emerald-50/30 rounded-xl">{formatCurrency(app.vendorEarnings)}</td>
                                        <td className="px-6 py-3 text-right font-black text-xs text-[#8b5cf6] bg-[#8b5cf6]/5 rounded-xl">{formatCurrency(app.platformFees)}</td>
                                        <td className="px-6 py-3 text-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(app.id, app.name);
                                                }}
                                                className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                title="Delete Agent"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-10 py-32 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-50">
                                            <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center border border-white shadow-sm">
                                                <Activity className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No transaction data available yet</p>
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

export default Financials;
