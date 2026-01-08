import React, { useState, useEffect } from 'react';
import {
    BadgeCheck,
    AlertCircle,
    Clock,
    CheckCircle2,
    Search,
    Filter,
    MessageSquare,
    User,
    Loader2,
    Inbox
} from 'lucide-react';
import apiService from '../../services/apiService';
import { motion } from 'framer-motion';

const AdminSupport = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, open, resolved
    const [selectedReport, setSelectedReport] = useState(null);
    const [resolutionNote, setResolutionNote] = useState('');
    const [isResolving, setIsResolving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchReports = async () => {
        try {
            const data = await apiService.getReports();
            setReports(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleResolve = async (status) => {
        if (!selectedReport) return;
        setIsResolving(true);
        try {
            await apiService.resolveReport(selectedReport._id, status, resolutionNote);
            await fetchReports();
            setSelectedReport(null);
            setResolutionNote('');
        } catch (err) {
            alert("Failed to update report");
        } finally {
            setIsResolving(false);
        }
    };

    const filteredReports = reports.filter(r => {
        const matchesFilter = (() => {
            if (filter === 'all') return true;
            if (filter === 'open') return ['open', 'in-progress'].includes(r.status);
            if (filter === 'resolved') return ['resolved', 'closed'].includes(r.status);
            return true;
        })();

        const matchesSearch = searchTerm === '' ||
            r.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.type?.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-red-50 text-red-600 border-red-100';
            case 'in-progress': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'resolved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 rounded-[24px] bg-[#8b5cf6]/20 flex items-center justify-center animate-spin">
                <Loader2 className="w-8 h-8 text-[#8b5cf6]" />
            </div>
            <p className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-[0.4em]">Loading Support...</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 h-[calc(100vh-140px)] flex flex-col"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">User Support</h2>
                    <p className="text-gray-500 font-medium text-xs">Manage user complaints, tickets, and inquiries</p>
                </div>
                <div className="bg-white/40 backdrop-blur-md border border-white/60 p-1 rounded-2xl flex gap-1">
                    {['all', 'open', 'resolved'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-500 hover:bg-white/50 hover:text-gray-900'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
                {/* Reports List */}
                <div className="lg:col-span-1 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[32px] overflow-hidden flex flex-col shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)]">
                    <div className="p-4 border-b border-white/60 bg-white/20">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#8b5cf6] transition-colors" />
                            <input
                                type="text"
                                placeholder="Search reports..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/60 border border-white/80 rounded-[20px] pl-11 pr-4 py-3 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-[#8b5cf6]/10 transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1 p-4 space-y-3 custom-scrollbar">
                        {filteredReports.length > 0 ? (
                            filteredReports.map(report => (
                                <div
                                    key={report._id}
                                    onClick={() => setSelectedReport(report)}
                                    className={`p-3 rounded-[20px] cursor-pointer transition-all border group ${selectedReport?._id === report._id ? 'bg-white border-[#8b5cf6]/20 shadow-lg scale-[1.02]' : 'bg-white/40 border-transparent hover:bg-white hover:shadow-md'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${report.type === 'bug' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                            {report.type}
                                        </span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(report.timestamp).toLocaleDateString()}</span>
                                    </div>
                                    <h4 className="font-bold text-gray-900 text-sm line-clamp-2 mb-3 leading-relaxed group-hover:text-[#8b5cf6] transition-colors">{report.description}</h4>

                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                                <User className="w-3 h-3 text-gray-500" />
                                            </div>
                                            <span className="text-xs font-bold text-gray-600 truncate max-w-[100px]">{report.userId?.name || 'Unknown'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${report.priority === 'high' ? 'bg-red-500 animate-pulse' : 'bg-gray-300'}`} />
                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${getStatusColor(report.status)} bg-transparent`}>
                                                {report.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-center p-8 opacity-50">
                                <Inbox className="w-12 h-12 text-gray-300 mb-4" />
                                <p className="font-bold text-gray-400">No reports found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Report Details */}
                <div className="lg:col-span-2 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[32px] p-5 flex flex-col shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] relative overflow-hidden">
                    {selectedReport ? (
                        <>
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <h3 className="text-xl font-black text-gray-900 tracking-tight">Report Details</h3>
                                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusColor(selectedReport.status)}`}>{selectedReport.status}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        <Clock className="w-3 h-3" />
                                        <span>Submitted on {new Date(selectedReport.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-gray-900 text-lg">{selectedReport.userId?.name || 'Unknown User'}</p>
                                    <p className="text-xs font-medium text-gray-500">{selectedReport.userId?.email || 'No Email'}</p>
                                </div>
                            </div>

                            <div className="bg-white/60 rounded-[32px] p-8 mb-8 border border-white/80 shadow-inner relative z-10">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <MessageSquare className="w-3 h-3" /> Description
                                </h4>
                                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed font-medium">{selectedReport.description}</p>
                            </div>

                            <div className="mt-auto pt-8 border-t border-white/60 relative z-10">
                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Resolution Action</h4>
                                <textarea
                                    className="w-full bg-white/60 border border-white/80 rounded-[24px] p-6 text-sm font-medium focus:ring-4 focus:ring-[#8b5cf6]/10 focus:border-[#8b5cf6]/30 outline-none min-h-[120px] mb-6 resize-none transition-all placeholder:text-gray-300"
                                    placeholder="Add notes about the resolution or response..."
                                    value={resolutionNote}
                                    onChange={(e) => setResolutionNote(e.target.value)}
                                />
                                <div className="flex gap-4 justify-end">
                                    {selectedReport.status !== 'resolved' && (
                                        <button
                                            disabled={isResolving}
                                            onClick={() => handleResolve('resolved')}
                                            className="bg-emerald-500 text-white px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center gap-3 transform hover:scale-105 active:scale-95"
                                        >
                                            {isResolving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                                            Mark Resolved
                                        </button>
                                    )}
                                    {selectedReport.status === 'open' && (
                                        <button
                                            disabled={isResolving}
                                            onClick={() => handleResolve('in-progress')}
                                            className="bg-amber-500 text-white px-8 py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 transform hover:scale-105 active:scale-95"
                                        >
                                            Mark In-Progress
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
                            <div className="w-24 h-24 rounded-[32px] bg-gray-100 flex items-center justify-center mb-6">
                                <Inbox className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-2">No Selection</h3>
                            <p className="font-medium text-gray-500">Select a report from the list to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default AdminSupport;
