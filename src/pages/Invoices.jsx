import React, { useEffect, useState } from 'react';
import { Download, FileText, Calendar, DollarSign, CreditCard, Sparkles, ChevronRight, Activity } from 'lucide-react';
import axios from 'axios';
import { apis, API } from '../types';
import { getUserData } from '../userStore/userData';
import { motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import { themeState } from '../userStore/userData';

const Invoices = () => {
    const theme = useRecoilValue(themeState);
    const isDark = theme === 'Dark';
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = getUserData()?.token;

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await axios.get(apis.getPayments, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    timeout: 5000
                });
                setPayments(res.data);
            } catch (err) {
                console.error('Error fetching payments:', err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchPayments();
        }
    }, [token]);

    const handleDownload = (invoicePath) => {
        const fileName = invoicePath.split('\\').pop().split('/').pop();
        const downloadUrl = `${API.replace('/api', '')}/invoices/${fileName}`;
        window.open(downloadUrl, '_blank');
    };

    return (
        <div className={`p-8 lg:p-12 h-screen overflow-y-auto no-scrollbar bg-transparent relative transition-colors duration-700 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {/* Decorative Background Elements */}
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] ${isDark ? 'bg-purple-900/10' : 'bg-[#8b5cf6]/5'} rounded-full blur-[120px] pointer-events-none`} />
            <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] ${isDark ? 'bg-pink-900/10' : 'bg-[#d946ef]/5'} rounded-full blur-[120px] pointer-events-none`} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-6xl mx-auto relative z-10"
            >
                <div className="mb-16">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                            ))}
                        </div>
                        <p className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-[0.4em] opacity-80">Economic Infrastructure v2.1</p>
                    </div>
                    <h1 className={`text-5xl lg:text-7xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tighter mb-6 leading-none transition-colors`}>Financial <span className="text-[#8b5cf6]">Registry.</span></h1>
                    <p className={`${isDark ? 'text-slate-400' : 'text-gray-500'} font-bold text-xl tracking-tight max-w-2xl transition-colors`}>Access immutable trace logs for all neural energy transactions and node provisioning fees.</p>
                </div>

                <div className={`${isDark ? 'bg-slate-900/60 border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]' : 'bg-white/40 border-white/60 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]'} backdrop-blur-3xl rounded-[64px] border overflow-hidden transition-all duration-700`}>
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className={`border-b ${isDark ? 'border-white/5 bg-white/5' : 'border-white/40 bg-white/20'} transition-colors`}>
                                    <th className="px-12 py-10 text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Sequence Type</th>
                                    <th className="px-12 py-10 text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Timestamp</th>
                                    <th className="px-12 py-10 text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Energy Credits</th>
                                    <th className="px-12 py-10 text-[11px] font-black uppercase tracking-[0.3em] text-gray-400">Network State</th>
                                    <th className="px-12 py-10 text-[11px] font-black uppercase tracking-[0.3em] text-gray-400 text-right transition-colors">Data Hub</th>
                                </tr>
                            </thead>
                            <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-white/20'} transition-colors`}>
                                {payments.length === 0 && (
                                    <tr className={`${isDark ? 'hover:bg-white/5' : 'hover:bg-white/30'} transition-all group`}>
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-16 h-16 rounded-[28px] ${isDark ? 'bg-slate-800' : 'bg-white'} flex items-center justify-center text-[#8b5cf6] shadow-2xl border ${isDark ? 'border-white/5' : 'border-white'} group-hover:rotate-6 transition-all duration-500`}>
                                                    <CreditCard size={24} />
                                                </div>
                                                <div>
                                                    <div className={`font-black ${isDark ? 'text-white' : 'text-gray-900'} text-lg tracking-tight mb-1 transition-colors`}>Genesis Configuration</div>
                                                    <div className="flex items-center gap-2">
                                                        <Sparkles size={10} className="text-[#8b5cf6]" />
                                                        <div className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-widest opacity-60">ID: PLATFORM_BOOT_01</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-3 text-sm font-black text-gray-500 uppercase tracking-tighter">
                                                <Calendar className="w-4 h-4 text-[#8b5cf6]" />
                                                {new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tighter transition-colors`}>
                                                0.00 <span className="text-[10px] text-gray-400 tracking-widest ml-1">USD</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black ${isDark ? 'bg-slate-800/60 border-white/5' : 'bg-white/60 border-white/80'} text-[#8b5cf6] uppercase tracking-[0.15em] shadow-sm border transition-colors`}>
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                STABLE_NODE
                                            </span>
                                        </td>
                                        <td className="px-12 py-10 text-right">
                                            <button
                                                onClick={() => handleDownload('demo_invoice.pdf')}
                                                className="inline-flex items-center gap-3 px-8 py-4 bg-gray-900 hover:bg-[#8b5cf6] text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl hover:scale-105 active:scale-95 group/btn"
                                            >
                                                <Download className="w-4 h-4 group-hover/btn:translate-y-1 transition-transform" />
                                                Export Log
                                            </button>
                                        </td>
                                    </tr>
                                )}

                                {payments.map((payment, index) => (
                                    <motion.tr
                                        key={payment._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`${isDark ? 'hover:bg-white/5' : 'hover:bg-white/30'} transition-all group`}
                                    >
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-16 h-16 rounded-[28px] ${isDark ? 'bg-slate-800' : 'bg-white'} flex items-center justify-center text-[#8b5cf6] shadow-2xl border ${isDark ? 'border-white/5' : 'border-white'} group-hover:rotate-6 transition-all duration-500 relative`}>
                                                    <FileText size={24} />
                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#8b5cf6] rounded-full border-2 border-white" />
                                                </div>
                                                <div>
                                                    <div className={`font-black ${isDark ? 'text-white' : 'text-gray-900'} text-lg tracking-tight mb-1 transition-colors`}>{payment.planName}</div>
                                                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest opacity-60">TX_ID: {payment.transactionId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className="flex items-center gap-3 text-sm font-black text-gray-500 uppercase tracking-tighter">
                                                <Calendar className="w-4 h-4 text-[#8b5cf6]" />
                                                {new Date(payment.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tighter transition-colors`}>
                                                {payment.amount.toFixed(2)} <span className="text-[10px] text-gray-400 tracking-widest ml-1">{payment.currency}</span>
                                            </div>
                                        </td>
                                        <td className="px-12 py-10">
                                            <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] shadow-sm ${payment.status === 'PAID'
                                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                                }`}>
                                                <Activity size={10} className={payment.status === 'PAID' ? 'animate-pulse' : ''} />
                                                {payment.status === 'PAID' ? 'SYNC_COMPLETE' : 'PENDING_LINK'}
                                            </span>
                                        </td>
                                        <td className="px-12 py-10 text-right">
                                            <button
                                                onClick={() => handleDownload(payment.invoicePath)}
                                                className={`inline-flex items-center gap-3 px-8 py-4 ${isDark ? 'bg-slate-800 border-white/5 hover:bg-slate-700' : 'bg-white border-white/60 hover:border-[#8b5cf6]'} text-gray-900 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl hover:shadow-[#8b5cf6]/20 hover:scale-105 active:scale-95 group/btn border`}
                                            >
                                                <Download className="w-4 h-4 group-hover/btn:translate-y-1 transition-transform text-[#8b5cf6]" />
                                                Report
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Insight */}
                <div className="mt-12 flex justify-center">
                    <div className={`px-8 py-4 ${isDark ? 'bg-slate-900/40 border-white/5' : 'bg-white/30 backdrop-blur-xl border-white/50'} border rounded-full flex items-center gap-4 shadow-sm transition-colors`}>
                        <Activity size={16} className="text-[#8b5cf6]" />
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Neural ledger is synchronized with global protocols v2.1</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Invoices;
