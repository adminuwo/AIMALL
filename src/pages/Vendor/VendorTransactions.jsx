import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Search, Filter, History, Receipt, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

const VendorTransactions = () => {
    // Mock transaction data
    const transactions = [
        { id: 'TRX-98765', date: 'Jan 12, 2026', type: 'Payout', amount: '4,500.00', status: 'Processing' },
        { id: 'TRX-98764', date: 'Jan 10, 2026', type: 'Sale', amount: '50.00', status: 'Completed', app: 'AI Writer' },
        { id: 'TRX-98763', date: 'Jan 09, 2026', type: 'Sale', amount: '25.00', status: 'Completed', app: 'Code Helper' },
        { id: 'TRX-98762', date: 'Jan 05, 2026', type: 'Sale', amount: '50.00', status: 'Completed', app: 'AI Writer' },
        { id: 'TRX-98761', date: 'Jan 01, 2026', type: 'Payout', amount: '6,750.00', status: 'Paid' },
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2">Ledger <span className="text-[#8b5cf6]">Log.</span></h1>
                    <p className="text-gray-500 font-bold text-lg tracking-tight max-w-xl">Immutable record of all financial value transfers.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search size={16} className="text-gray-400 group-focus-within:text-[#8b5cf6] transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Scan Ledger..."
                            className="pl-10 pr-4 py-3 bg-white/40 border border-white/60 rounded-[20px] text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6] shadow-sm transition-all w-64 backdrop-blur-md"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-5 py-3 bg-white/40 border border-white/60 rounded-[20px] text-sm font-black uppercase tracking-widest text-gray-600 hover:bg-white hover:text-gray-900 shadow-sm transition-all backdrop-blur-md whitespace-nowrap">
                        <Filter size={14} /> Filter
                    </button>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[40px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] overflow-hidden"
            >
                <div className="px-8 py-6 border-b border-white/60 bg-white/20 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#d946ef] to-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30">
                            <History size={20} />
                        </div>
                        <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Transaction History</h2>
                    </div>
                    <div className="px-4 py-2 bg-white/50 rounded-xl border border-white/60 shadow-sm">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Entries: <span className="text-[#8b5cf6] text-sm ml-1">{transactions.length}</span></span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/40 border-b border-white/60">
                            <tr>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Reference ID</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Flow Type</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Source / Note</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Value</th>
                                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">State</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/50">
                            {transactions.map((trx, index) => (
                                <motion.tr
                                    key={trx.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-white/60 transition-colors cursor-pointer group"
                                >
                                    <td className="px-8 py-5 text-xs font-bold text-gray-500 font-mono tracking-wide">{trx.id}</td>
                                    <td className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">{trx.date}</td>
                                    <td className="px-8 py-5">
                                        <div className={`flex items-center gap-2 ${trx.type === 'Payout' ? 'text-emerald-600' : 'text-blue-600'}`}>
                                            <div className={`p-1 rounded-md ${trx.type === 'Payout' ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                                                {trx.type === 'Payout' ? <ArrowUpRight size={12} /> : <ArrowDownLeft size={12} />}
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest">{trx.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-bold text-gray-700">
                                        {trx.app ? (
                                            <div className="flex items-center gap-2">
                                                <Receipt size={14} className="text-gray-400" />
                                                {trx.app}
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-gray-400 italic">
                                                <CreditCard size={14} />
                                                Platform Settlement
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 font-black text-gray-900 tracking-tight">${trx.amount}</td>
                                    <td className="px-8 py-5 text-right">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-sm ${trx.status === 'Completed' || trx.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                trx.status === 'Processing' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                    'bg-amber-50 text-amber-600 border border-amber-100'
                                            }`}>
                                            {trx.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {transactions.length === 0 && (
                    <div className="p-16 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <History size={32} className="text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Ledger Empty</h3>
                        <p className="text-gray-400 font-medium">No transactions have been recorded yet.</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default VendorTransactions;
