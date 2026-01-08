import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, FileText, Loader2, AlertCircle } from 'lucide-react';
import apiService from '../../services/apiService';

const Approvals = () => {
    const [pendingAgents, setPendingAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [approvalMessage, setApprovalMessage] = useState('');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const fetchPending = async () => {
        try {
            setLoading(true);
            const agents = await apiService.getAgents();
            const pending = agents.filter(a => a.reviewStatus === 'Pending Review');
            setPendingAgents(pending);
        } catch (err) {
            console.error("Failed to fetch pending approvals:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    useEffect(() => {
        if (showRejectModal) {
            setTimeout(() => {
                const element = document.getElementById('rejection-reason-input');
                if (element) {
                    element.focus();
                }
            }, 100);
        }
    }, [showRejectModal]);

    const handleApprove = async () => {
        try {
            const id = selectedAgent._id || selectedAgent.id;
            setProcessingId(id);
            await apiService.approveAgent(id, approvalMessage);
            setPendingAgents(prev => prev.filter(a => (a._id || a.id) !== id));
            setShowApproveModal(false);
            setApprovalMessage('');
            setSelectedAgent(null);
        } catch (err) {
            alert("Approval failed");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) return;
        try {
            setProcessingId(selectedAgent._id || selectedAgent.id);
            await apiService.rejectAgent(selectedAgent._id || selectedAgent.id, rejectionReason);
            setPendingAgents(prev => prev.filter(a => (a._id || a.id) !== (selectedAgent._id || selectedAgent.id)));
            setShowRejectModal(false);
            setRejectionReason('');
            setSelectedAgent(null);
        } catch (err) {
            console.error("Rejection error:", err);
            const msg = err.response?.data?.error || err.message || "Rejection failed";
            alert(`Rejection failed: ${msg}`);
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fade-in-up">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Approvals & <span className="text-brand-dark">Verification</span></h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">Identity & Integrity Audit</p>
                </div>
                <div className="glass-pill px-6 py-3 flex items-center gap-3">
                    <Clock className="w-4 h-4 text-brand-dark" />
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{pendingAgents.length} Pending Cases</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {pendingAgents.length > 0 ? (
                    pendingAgents.map((agent) => (
                        <div key={agent._id || agent.id} className="glass-card p-8 rounded-[48px] group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-8">
                                    <div className="w-20 h-20 bg-white glass-card rounded-3xl flex items-center justify-center overflow-hidden border-white group-hover:rotate-6 transition-transform">
                                        <img src={agent.avatar || 'https://cdn-icons-png.flaticon.com/512/2102/2102633.png'} alt="" className="w-12 h-12 object-contain" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-brand-dark transition-colors">{agent.agentName}</h3>
                                        <div className="flex items-center gap-4 mt-2">
                                            <span className="bg-brand-light/50 text-brand-dark px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{agent.category}</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                                                Source: External Vendor
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => { setSelectedAgent(agent); setShowApproveModal(true); }}
                                        disabled={processingId === (agent._id || agent.id)}
                                        className="btn-purple py-4 px-8 text-[10px]"
                                    >
                                        {processingId === (agent._id || agent.id) ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Authorize'}
                                    </button>
                                    <button
                                        onClick={() => { setSelectedAgent(agent); setShowRejectModal(true); }}
                                        disabled={processingId === (agent._id || agent.id)}
                                        className="px-8 py-4 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/10"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/40">
                                <p className="text-sm text-slate-500 font-medium leading-relaxed italic opacity-80">
                                    "{agent.description}"
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="glass-card p-24 rounded-[56px] text-center">
                        <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-8 animate-float">
                            <CheckCircle className="w-10 h-10 text-brand-dark" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Queue Depleted</h3>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-2">No pending verification cycles</p>
                    </div>
                )}
            </div>

            {/* Approval Modal */}
            {showApproveModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-md">
                    <div className="glass-card w-full max-w-lg rounded-[56px] overflow-hidden border-white/80 animate-fade-in-up">
                        <div className="p-12 text-center">
                            <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                                <CheckCircle className="w-10 h-10 text-[#22C55E]" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Final Approval</h2>
                            <p className="text-sm text-slate-500 font-medium mb-8">Authorize this agent for public distribution? You may append a system notice for the vendor.</p>

                            <textarea
                                value={approvalMessage}
                                onChange={(e) => setApprovalMessage(e.target.value)}
                                className="w-full bg-white/60 border border-white/80 rounded-[32px] p-6 text-sm outline-none focus:ring-4 focus:ring-brand/10 transition-all resize-none h-40 font-medium placeholder:text-slate-300"
                                placeholder="Transmission Notice (Optional)..."
                            />

                            <div className="flex items-center gap-6 mt-10">
                                <button
                                    onClick={() => setShowApproveModal(false)}
                                    className="flex-1 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
                                >
                                    Regress
                                </button>
                                <button
                                    onClick={handleApprove}
                                    disabled={processingId}
                                    className="flex-1 btn-purple py-4 shadow-2xl"
                                >
                                    Verify Case
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-md">
                    <div className="glass-card w-full max-w-lg rounded-[56px] overflow-hidden border-white/80 animate-fade-in-up">
                        <div className="p-12 text-center">
                            <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                                <AlertCircle className="w-10 h-10 text-[#EF4444]" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Dismiss Case</h2>
                            <p className="text-sm text-slate-500 font-medium mb-8">Formal rejection requires a specified reason. This log will be transmitted to the vendor.</p>

                            <textarea
                                id="rejection-reason-input"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full bg-white/60 border border-white/80 rounded-[32px] p-6 text-sm outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all resize-none h-40 font-medium placeholder:text-slate-300"
                                placeholder="Specify rejection deficiency..."
                            />

                            <div className="flex items-center gap-6 mt-10">
                                <button
                                    onClick={() => setShowRejectModal(false)}
                                    className="flex-1 px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
                                >
                                    Regress
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={!rejectionReason.trim() || processingId}
                                    className="flex-1 bg-red-500 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-red-500/20"
                                >
                                    Execute Dismissal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Approvals;
