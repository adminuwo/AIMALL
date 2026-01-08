import React, { useState, useEffect } from 'react';
import { Search, Filter, Clock, Loader2, Eye, X, User, DollarSign, Calendar, ArrowRight } from 'lucide-react';
import apiService from '../../services/apiService';
import { motion, AnimatePresence } from 'framer-motion';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const data = await apiService.getAdminTransactions();
            setTransactions(data);
        } catch (err) {
            console.error("Failed to fetch transactions:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const filteredTransactions = transactions.filter(t =>
        t.appName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleViewDetails = (transaction) => {
        setSelectedTransaction(transaction);
        setShowDetailsModal(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 animate-in fade-in duration-500 pb-24"
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">Transaction History</h2>
                    <p className="text-gray-500 font-medium text-xs">Audit trail of all financial movements</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8b5cf6] transition-colors" />
                        <input
                            type="text"
                            placeholder="Search transaction..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[20px] py-2 pl-11 pr-4 text-xs font-medium focus:ring-4 focus:ring-[#8b5cf6]/10 focus:border-[#8b5cf6]/30 transition-all outline-none min-w-[320px] placeholder:text-gray-400"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-md border border-white/60 rounded-[20px] text-[10px] font-black text-gray-500 uppercase tracking-widest hover:bg-white/60 hover:text-gray-900 transition-all shadow-sm">
                        <Filter className="w-3 h-3" />
                        Filter
                    </button>
                </div>
            </div>

            <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[32px] overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/30 border-b border-white/60">
                            <tr>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction ID</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Date</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Type</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">App / Details</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amount</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/60">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="py-32 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <Loader2 className="w-8 h-8 text-[#8b5cf6] animate-spin" />
                                            <p className="mt-4 text-[10px] font-black text-[#8b5cf6] uppercase tracking-[0.4em]">Loading history...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredTransactions.length > 0 ? (
                                filteredTransactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-white/40 transition-colors group">
                                        <td className="px-6 py-3">
                                            <span className="text-xs font-black text-gray-900">#{t.id.substring(t.id.length - 8).toUpperCase()}</span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="text-xs font-medium text-gray-500">{formatDate(t.date)}</span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                                <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">{t.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="text-xs font-bold text-gray-900 group-hover:text-[#8b5cf6] transition-colors">{t.appName}</span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <span className="text-xs font-black text-gray-900">${t.amount.toFixed(2)}</span>
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F0FDF4] text-[#166534] rounded-lg border border-[#DCFCE7] text-[9px] font-black uppercase tracking-widest">
                                                <div className="w-1.5 h-1.5 bg-[#22C55E] rounded-full" />
                                                {t.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <button
                                                onClick={() => handleViewDetails(t)}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/50 text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:shadow-lg hover:text-[#8b5cf6] transition-all transform hover:scale-105"
                                            >
                                                Details
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-32 text-center opacity-50">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center border border-white shadow-sm">
                                                <Clock className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">No transactions recorded</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transaction Details Modal */}
            <AnimatePresence>
                {showDetailsModal && selectedTransaction && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/20 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="glass-card w-full max-w-2xl rounded-[48px] overflow-hidden border-white/80 shadow-2xl"
                        >
                            <div className="p-10">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Transaction Details</h2>
                                    <button
                                        onClick={() => setShowDetailsModal(false)}
                                        className="p-3 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Transaction ID & Date */}
                                    <div className="bg-white/50 rounded-[32px] p-8 border border-white/60">
                                        <div className="grid grid-cols-2 gap-8">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Transaction ID</p>
                                                <p className="text-lg font-black text-gray-900">#{selectedTransaction.id.substring(selectedTransaction.id.length - 12).toUpperCase()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Date Recorded</p>
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-[#8b5cf6]" />
                                                    <p className="text-sm font-bold text-gray-900">{formatDate(selectedTransaction.date)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* App Details */}
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">App / Product</p>
                                        <div className="bg-white/40 border border-white/60 rounded-[32px] p-6 flex flex-col justify-center">
                                            <p className="text-xl font-black text-gray-900 tracking-tight">{selectedTransaction.appName}</p>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mt-1">{selectedTransaction.type}</p>
                                        </div>
                                    </div>

                                    {/* Amount Breakdown */}
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Financial Breakdown</p>
                                        <div className="bg-white/40 border border-white/60 rounded-[32px] p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-bold text-gray-500">Gross Amount</span>
                                                </div>
                                                <span className="text-lg font-black text-gray-900">${selectedTransaction.amount.toFixed(2)}</span>
                                            </div>
                                            <div className="border-t border-dashed border-gray-300 pt-4 opacity-70">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Platform Fee (50%)</span>
                                                    <span className="text-sm font-bold text-amber-600">-${(selectedTransaction.amount * 0.5).toFixed(2)}</span>
                                                </div>
                                            </div>
                                            <div className="border-t border-gray-200 pt-4">
                                                <div className="flex items-center justify-between bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                                                    <span className="text-sm font-black text-gray-900 uppercase tracking-wider">Vendor Earnings</span>
                                                    <span className="text-xl font-black text-emerald-600 tracking-tight">${(selectedTransaction.amount * 0.5).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Status</p>
                                        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                                            <div className="relative flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest">{selectedTransaction.status}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50/50 border-t border-white/60 flex justify-end">
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="px-8 py-4 bg-gray-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-[#8b5cf6] transition-all shadow-xl hover:shadow-[#8b5cf6]/20 transform hover:scale-105 active:scale-95"
                                >
                                    Close Panel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default TransactionHistory;
