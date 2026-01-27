import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    MessageSquare,
    AlertCircle,
    User,
    Calendar,
    Mail,
    Clock,
    FileText,
    ChevronRight,
    Loader2,
    Send,
    ArrowLeft,
    Trash2
} from 'lucide-react';
import { apiService } from '../services/apiService';

const AdminSupport = () => {
    // State
    const [reports, setReports] = useState([]);
    const [selectedReport, setSelectedReport] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [resolutionNote, setResolutionNote] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [showDetailOnMobile, setShowDetailOnMobile] = useState(false);

    // Initial Fetch
    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const data = await apiService.getReports();
            setReports(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch Reports Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleReportSelect = async (report) => {
        console.log("🔍 Selecting report:", report._id);
        setSelectedReport(report);
        setResolutionNote("");
        setShowDetailOnMobile(true);

        // Fetch message history for this report
        setMessagesLoading(true);
        try {
            const history = await apiService.getReportMessages(report._id);
            console.log("📄 Fetched message history:", history);
            setMessages(Array.isArray(history) ? history : []);
        } catch (err) {
            console.error("Fetch Messages Error:", err);
            setMessages([]);
        } finally {
            setMessagesLoading(false);
        }
    };

    const handleBackToList = () => {
        setShowDetailOnMobile(false);
    };

    const handleSendResponse = async () => {
        if (!selectedReport || !resolutionNote.trim()) return;
        setActionLoading(true);
        try {
            await apiService.resolveReport(selectedReport._id, selectedReport.status, resolutionNote);

            // Refresh messages and report list
            const history = await apiService.getReportMessages(selectedReport._id);
            setMessages(Array.isArray(history) ? history : []);
            await fetchReports();

            setResolutionNote(""); // Clear note after sending
            alert("Response sent successfully!");
        } catch (err) {
            console.error("Send Response Error:", err);
            alert("Failed to send response.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateStatus = async (status) => {
        if (!selectedReport) return;
        setActionLoading(true);
        try {
            const updated = await apiService.resolveReport(selectedReport._id, status, resolutionNote);
            // Refresh list and update selection
            await fetchReports();
            setSelectedReport(updated);
            alert(`Report marked as ${status.replace('-', ' ')}!`);
        } catch (err) {
            console.error("Update Status Error:", err);
            alert("Failed to update status.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteReport = async (e, id) => {
        e.stopPropagation(); // Prevent selecting the report when clicking delete
        if (!window.confirm("Are you sure you want to delete this report?")) return;

        try {
            await apiService.deleteReport(id);
            if (selectedReport?._id === id) {
                setSelectedReport(null);
                setResolutionNote("");
                setShowDetailOnMobile(false);
            }
            await fetchReports();
            alert("Report deleted successfully!");
        } catch (err) {
            console.error("Delete Report Error:", err);
            alert("Failed to delete report.");
        }
    };

    // Filter reports
    const filteredReports = reports.filter(r => {
        const matchesSearch =
            r.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r._id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === "ALL" ||
            (filterStatus === "OPEN" && r.status === "open") ||
            (filterStatus === "RESOLVED" && r.status === "resolved");

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-red-50 text-red-600 border-red-100';
            case 'in-progress': return 'bg-orange-50 text-orange-600 border-orange-100';
            case 'resolved': return 'bg-green-50 text-green-600 border-green-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const getCategoryColor = (type) => {
        const t = (type || 'OTHER').toUpperCase();
        switch (t) {
            case 'BUG': return 'text-red-500 bg-red-50';
            case 'SECURITY': return 'text-indigo-500 bg-indigo-50';
            case 'PAYMENT': return 'text-green-500 bg-green-50';
            default: return 'text-blue-500 bg-blue-50';
        }
    };

    if (loading && reports.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
                <p className="text-slate-500 font-medium">Loading reports...</p>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-[#f8fbff] flex flex-col overflow-hidden font-sans">
            {/* Header */}
            <div className="px-4 md:px-8 py-6 flex flex-col items-center justify-center text-center shrink-0 border-b border-slate-50 bg-white/50 backdrop-blur-md">
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#111827] tracking-tight">User Support</h1>
                <p className="text-slate-500 text-[10px] md:text-sm mt-1 mb-6">Manage user complaints, tickets, and inquiries</p>


            </div>

            <div className="flex-1 flex gap-6 px-4 md:px-8 pb-4 md:pb-8 overflow-hidden relative">
                {/* Left Pane - List */}
                <div className={`
                    ${showDetailOnMobile ? 'hidden md:flex' : 'flex'}
                    w-full md:w-[310px] flex-col gap-4 shrink-0 transition-all duration-300
                `}>
                    <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center gap-3 mt-4">
                        <Search size={20} className="text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {filteredReports.map((report) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={report._id}
                                    onClick={() => handleReportSelect(report)}
                                    className={`
                                        group cursor-pointer p-5 rounded-[2rem] bg-white border-2 transition-all
                                        ${selectedReport?._id === report._id
                                            ? "border-indigo-500 shadow-xl shadow-indigo-100 ring-4 ring-indigo-50"
                                            : "border-transparent hover:border-slate-200 shadow-sm"
                                        }
                                    `}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getCategoryColor(report.type)}`}>
                                            {report.type || 'Other'}
                                        </span>
                                        <span className="text-[11px] font-bold text-slate-400">
                                            {new Date(report.timestamp).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h3 className="text-[15px] font-bold text-[#111827] mb-4 line-clamp-2 min-h-[40px]">
                                        {report.description}
                                    </h3>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                                                <User size={14} className="text-slate-500" />
                                            </div>
                                            <span className="text-xs font-bold text-slate-600 truncate max-w-[100px]">
                                                {report.userId?.name || 'Anonymous'}
                                            </span>
                                        </div>

                                        <button
                                            onClick={(e) => handleDeleteReport(e, report._id)}
                                            className="p-2 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition-all"
                                            title="Delete Report"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {filteredReports.length === 0 && (
                            <div className="h-40 flex flex-col items-center justify-center text-slate-400">
                                <MessageSquare size={32} className="mb-2 opacity-20" />
                                <p className="text-sm font-medium">No reports found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Pane - Details */}
                <div className={`
                    ${showDetailOnMobile ? 'flex' : 'hidden md:flex'}
                    flex-1 bg-white md:rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex-col h-full
                    ${showDetailOnMobile ? 'fixed inset-0 z-50 rounded-none' : ''}
                    md:relative md:inset-auto md:z-0
                `}>
                    {selectedReport ? (
                        <>
                            {/* Detail Header */}
                            <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center shrink-0 gap-4">
                                <div className="flex items-center gap-4">
                                    <button onClick={handleBackToList} className="md:hidden p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                                        <ArrowLeft size={20} />
                                    </button>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h2 className="text-lg md:text-xl font-black text-[#111827]">Details</h2>
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(selectedReport.status)}`}>
                                                {selectedReport.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 font-bold text-[9px] text-slate-400">
                                            <Clock size={12} />
                                            <span>SUBMITTED {new Date(selectedReport.timestamp).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-left md:text-right w-full md:w-auto p-4 md:p-0 bg-slate-50 md:bg-transparent rounded-2xl md:rounded-none">
                                    <div className="font-black text-base md:text-lg text-[#111827]">{selectedReport.userId?.name || 'Anonymous User'}</div>
                                    <div className="text-[10px] md:text-[11px] font-bold text-slate-400">{selectedReport.userId?.email || 'No email provided'}</div>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 shadow-inner bg-slate-50/30">
                                {/* Chat History */}
                                <div className="space-y-4">
                                    {/* Original Message */}
                                    <div className="flex justify-start">
                                        <div className="max-w-[85%] bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-slate-100">
                                            <p className="text-sm font-bold text-[#111827] leading-relaxed">
                                                {selectedReport.description}
                                            </p>
                                        </div>
                                    </div>

                                    {messagesLoading ? (
                                        <div className="flex justify-center py-4">
                                            <Loader2 className="animate-spin text-slate-300" size={24} />
                                        </div>
                                    ) : (
                                        messages.map((msg, idx) => (
                                            <div key={msg._id || idx} className={`flex ${msg.senderRole === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`
                                                    max-w-[85%] p-4 rounded-2xl shadow-sm border
                                                    ${msg.senderRole === 'admin'
                                                        ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none'
                                                        : 'bg-white text-[#111827] border-slate-100 rounded-tl-none'}
                                                `}>
                                                    <p className="text-sm font-bold leading-relaxed">
                                                        {msg.message}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    )}

                                    {!messagesLoading && messages.length === 0 && (
                                        <div className="text-center py-6">
                                            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No additional messages in history</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Resolution Action */}
                            <div className="p-6 md:p-8 border-t border-slate-100 bg-white">
                                <div className="flex items-center gap-2 text-[#111827] mb-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Resolution Action</h3>
                                </div>

                                <div className="bg-white rounded-[1.5rem] p-6 border border-slate-100 shadow-sm mb-4">
                                    <textarea
                                        value={resolutionNote}
                                        onChange={(e) => setResolutionNote(e.target.value)}
                                        placeholder="Add notes about the resolution..."
                                        className="w-full h-32 bg-transparent border-none outline-none text-[#111827] font-bold placeholder:text-slate-300 resize-none text-sm"
                                    />
                                </div>

                                <div className="flex flex-col sm:flex-row items-stretch sm:justify-center gap-3 pt-2">
                                    <button
                                        disabled={actionLoading || !resolutionNote.trim()}
                                        onClick={handleSendResponse}
                                        className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                    >
                                        <Send size={16} />
                                        Send Response
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 md:p-20 text-center text-slate-300">
                            <div className="w-24 md:w-32 h-24 md:h-32 bg-slate-50 rounded-full flex items-center justify-center mb-10 border-4 border-dashed border-slate-100">
                                <AlertCircle size={48} className="text-slate-200" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-4 tracking-tight">No Report Selected</h2>
                            <p className="max-w-[280px] font-bold text-slate-400 text-sm">
                                Select a report from the list on the left to view details and take action.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div >
    );
};

export default AdminSupport;
