import React, { useState, useEffect } from 'react';
import { Shield, Check, Info, ArrowLeft, Trash2, Globe, Loader2, Share2, Eye, Box, Activity, Edit2, Save, X, Image as ImageIcon, Layers } from 'lucide-react';
import apiService from '../../services/apiService';
import { getUserData } from '../../userStore/userData';
import { motion, AnimatePresence } from 'framer-motion';

const AppDetails = ({ app, onBack, onDelete, onUpdate, isAdmin: propsIsAdmin }) => {
    const [status, setStatus] = useState(app ? (app.status || 'Inactive') : 'Inactive');
    const [reviewStatus, setReviewStatus] = useState(app ? (app.reviewStatus || 'Draft') : 'Draft');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        agentName: app?.agentName || app?.name || '',
        description: app?.description || '',
        agentUrl: app?.url || '',
        category: app?.category || 'Business OS',
        avatar: app?.avatar || ''
    });

    const userData = getUserData();
    const isAdmin = propsIsAdmin !== undefined ? propsIsAdmin : (userData?.role === 'admin');

    useEffect(() => {
        if (app) {
            setEditData({
                agentName: app.agentName || app.name || '',
                description: app.description || '',
                agentUrl: app.url || '',
                category: app.category || 'Business OS',
                avatar: app.avatar || ''
            });
        }
    }, [app]);

    if (!app) return null;

    const handleGoLive = async () => {
        try {
            setIsUpdating(true);
            await apiService.updateAgent(app._id || app.id, { status: 'Live' });
            setStatus('Live');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Failed to go live:", error);
            alert("Failed to update status.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSubmitForReview = async () => {
        try {
            setIsUpdating(true);
            const updated = await apiService.submitForReview(app._id || app.id);
            setReviewStatus('Pending Review');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Failed to submit review:", error);
            alert("Failed to submit for review.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this agent? This action cannot be undone.")) return;

        try {
            setIsDeleting(true);
            const id = app._id || app.id;
            await apiService.deleteAgent(id);
            if (onDelete) onDelete();
        } catch (error) {
            console.error("Failed to delete app:", error);
            alert("Failed to delete agent. Access denied or server error.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsUpdating(true);
            const payload = {
                agentName: editData.agentName,
                description: editData.description,
                url: editData.agentUrl,
                category: editData.category,
                avatar: editData.avatar
            };
            await apiService.updateAgent(app._id || app.id, payload);
            setIsEditing(false);
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error("Failed to save changes:", error);
            alert("Failed to save changes.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const targetWidth = 500;
                const targetHeight = 500;
                canvas.width = targetWidth;
                canvas.height = targetHeight;

                const srcRatio = img.width / img.height;
                const targetRatio = 1;

                let sx, sy, sw, sh;
                if (srcRatio > targetRatio) {
                    sh = img.height;
                    sw = sh * targetRatio;
                    sx = (img.width - sw) / 2;
                    sy = 0;
                } else {
                    sw = img.width;
                    sh = sw / targetRatio;
                    sx = 0;
                    sy = (img.height - sh) / 2;
                }

                ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
                setEditData(prev => ({ ...prev, avatar: canvas.toDataURL('image/png') }));
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                WebkitFontSmoothing: 'antialiased',
                textRendering: 'optimizeLegibility',
                backfaceVisibility: 'hidden'
            }}
            className="pb-24 space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 bg-white/40 backdrop-blur-md rounded-2xl flex items-center justify-center hover:bg-white hover:text-[#8b5cf6] transition-all text-gray-500 shadow-sm border border-white/60"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-4">
                        {isEditing ? (
                            <div className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    name="agentName"
                                    value={editData.agentName}
                                    onChange={handleChange}
                                    className="text-2xl font-black text-gray-900 bg-white/50 border border-[#8b5cf6]/30 rounded-xl px-4 py-1 outline-none focus:ring-2 focus:ring-[#8b5cf6]/20 transition-all"
                                    placeholder="Agent Name"
                                />
                            </div>
                        ) : (
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tighter mb-1">{app.name || app.agentName}</h1>
                                <div className="flex items-center gap-3">
                                    {reviewStatus !== 'Approved' && (
                                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border ${reviewStatus === 'Pending Review' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                            reviewStatus === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                                'bg-white/50 text-gray-500 border-gray-200'
                                            }`}>
                                            {reviewStatus}
                                        </span>
                                    )}
                                    {status === 'Live' && (
                                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Marketplace
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isAdmin && !isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-white hover:bg-gray-50 text-gray-900 px-5 py-2.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest border border-gray-200 shadow-sm transition-all flex items-center gap-2"
                        >
                            <Edit2 className="w-4 h-4 text-[#8b5cf6]" />
                            Edit Details
                        </button>
                    )}

                    {isEditing && (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={isUpdating}
                                className="bg-[#8b5cf6] text-white px-6 py-2.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-[#7c3aed] shadow-lg shadow-[#8b5cf6]/20 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Changes
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditData({
                                        agentName: app.agentName || app.name || '',
                                        description: app.description || '',
                                        agentUrl: app.url || '',
                                        category: app.category || 'Business OS',
                                        avatar: app.avatar || ''
                                    });
                                }}
                                className="bg-white text-gray-500 px-5 py-2.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest border border-gray-200 hover:text-gray-900 transition-all flex items-center gap-2"
                            >
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                        </>
                    )}

                    {!isEditing && (
                        <>
                            {!isAdmin && (reviewStatus === 'Draft' || reviewStatus === 'Rejected') && (
                                <button
                                    onClick={handleSubmitForReview}
                                    disabled={isUpdating}
                                    className="bg-gray-900 text-white px-6 py-2.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-[#8b5cf6] hover:shadow-lg transition-all flex items-center gap-3 disabled:opacity-50"
                                >
                                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                                    Submit for Review
                                </button>
                            )}

                            {isAdmin && status !== 'Live' && (
                                <button
                                    onClick={handleGoLive}
                                    disabled={isUpdating}
                                    className="bg-emerald-500 text-white px-6 py-2.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-3 disabled:opacity-50"
                                >
                                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                                    Publish Live
                                </button>
                            )}

                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="bg-white/40 border border-white/60 text-red-500 px-4 py-2.5 rounded-[20px] hover:bg-red-50 hover:text-red-600 transition-all shadow-sm flex items-center gap-2 group/del"
                            >
                                {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5 group-hover/del:scale-110 transition-transform" />}
                                <span className="text-[10px] font-black uppercase tracking-widest">Delete Agent</span>
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Rejection Alert */}
                    {reviewStatus === 'Rejected' && app.rejectionReason && (
                        <div className="bg-red-50 border border-red-100 rounded-[24px] p-6 flex gap-4">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                                <Info className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-black text-red-900 tracking-tight mb-2">Submission Feedback</h3>
                                <p className="text-red-800 font-medium leading-relaxed">"{app.rejectionReason}"</p>
                                <p className="text-red-500 text-xs font-bold uppercase tracking-widest mt-4">Action Required</p>
                            </div>
                        </div>
                    )}

                    <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[28px] p-8 shadow-sm space-y-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            {isEditing && <div className="shrink-0">
                                <label className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">
                                    Update Logo
                                </label>
                                <div className="mt-1.5 space-y-3">
                                    <label className="relative group flex items-center justify-center w-32 h-32 bg-white/30 border-2 border-dashed border-[#8b5cf6]/20 rounded-[28px] cursor-pointer hover:bg-white/50 hover:border-[#8b5cf6]/50 overflow-hidden transition-all shadow-xl">
                                        {editData.avatar ? (
                                            <>
                                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 z-0" />
                                                <img
                                                    key={editData.avatar}
                                                    src={editData.avatar}
                                                    className="w-full h-full object-contain relative z-10 p-2"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 text-white transition-all z-20">
                                                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-full transform scale-90 group-hover:scale-100 transition-transform">
                                                        <ImageIcon className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-[8px] font-black uppercase tracking-widest">Change Image</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-[#8b5cf6] transition-all">
                                                <div className="p-2 bg-[#8b5cf6]/5 rounded-full">
                                                    <ImageIcon className="w-5 h-5" />
                                                </div>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-center leading-tight">Upload<br />Icon</span>
                                            </div>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleIconChange} />
                                    </label>

                                    {editData.avatar && (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setEditData(prev => ({ ...prev, avatar: null }));
                                            }}
                                            className="w-full py-2 bg-red-50 text-red-500 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all transform active:scale-95 border border-red-100"
                                        >
                                            Remove Icon
                                        </button>
                                    )}
                                </div>
                            </div>
                            }

                            <div className="flex-1 space-y-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Info className="w-4 h-4" /></div>
                                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Agent Description</h3>
                                    </div>
                                    {isEditing ? (
                                        <textarea
                                            name="description"
                                            value={editData.description}
                                            onChange={handleChange}
                                            rows={5}
                                            className="w-full bg-white/50 border border-[#8b5cf6]/20 rounded-2xl p-4 text-base text-gray-600 font-medium leading-relaxed outline-none focus:ring-4 focus:ring-[#8b5cf6]/5 transition-all resize-none"
                                            placeholder="Enter agent description..."
                                        />
                                    ) : (
                                        <p className="text-base text-gray-600 font-medium leading-relaxed">
                                            {app.description || 'No description provided.'}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-white/60">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-[#8b5cf6]/10 rounded-lg text-[#8b5cf6]"><Globe className="w-4 h-4" /></div>
                                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Endpoint Configuration</h3>
                                    </div>

                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">API Endpoint URL</p>
                                            <input
                                                type="text"
                                                name="agentUrl"
                                                value={editData.agentUrl}
                                                onChange={handleChange}
                                                className="w-full bg-white/50 border border-[#8b5cf6]/20 rounded-2xl px-5 py-4 text-[#8b5cf6] font-bold text-base outline-none focus:ring-4 focus:ring-[#8b5cf6]/5 transition-all"
                                                placeholder="https://your-api-endpoint.com"
                                            />
                                        </div>
                                    ) : (
                                        <div className="bg-white/50 border border-white/80 rounded-[24px] p-5 group cursor-pointer hover:bg-white/80 transition-colors">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Live API URL</p>
                                            <p className="text-[#8b5cf6] font-bold text-base break-all">{app.url || 'No URL configured'}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 border-t border-white/60">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Layers className="w-4 h-4" /></div>
                                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">Agent Category</h3>
                                    </div>

                                    {isEditing ? (
                                        <div className="relative">
                                            <select
                                                name="category"
                                                value={editData.category}
                                                onChange={handleChange}
                                                className="w-full bg-white/50 border border-[#8B5CF6]/20 rounded-2xl px-5 py-4 text-[#8B5CF6] font-bold text-base outline-none focus:ring-4 focus:ring-[#8B5CF6]/5 transition-all appearance-none cursor-pointer"
                                            >
                                                <option>Business OS</option>
                                                <option>Data & Intelligence</option>
                                                <option>Sales & Marketing</option>
                                                <option>HR & Finance</option>
                                                <option>Design & Creative</option>
                                                <option>Medical & Health</option>
                                                <option>Productivity</option>
                                            </select>
                                            <Layers className="w-5 h-5 absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    ) : (
                                        <div className="bg-white/50 border border-white/80 rounded-[24px] p-5">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Category</p>
                                            <p className="text-[#8B5CF6] font-bold text-base">{app.category || 'Business OS'}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-4">
                    <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[28px] p-6 shadow-sm">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Performance & Plan</h3>

                        <div className="space-y-4">
                            {/* Monthly Plan */}
                            <div className="flex items-center justify-between p-3 bg-white/40 rounded-[20px] border border-white/60">
                                <div className="flex items-center gap-3">
                                    <Box className="w-4 h-4 text-gray-400" />
                                    <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Monthly Plan</span>
                                </div>
                                <span className="text-sm font-black text-gray-900">
                                    {app.pricing?.plans?.find(p => p.billingCycle === 'monthly')?.amount ? `₹${app.pricing.plans.find(p => p.billingCycle === 'monthly').amount}` : 'Free'}
                                </span>
                            </div>

                            {/* Yearly Plan */}
                            <div className="flex items-center justify-between p-3 bg-white/40 rounded-[20px] border border-white/60">
                                <div className="flex items-center gap-3">
                                    <Box className="w-4 h-4 text-gray-400" />
                                    <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Yearly Plan</span>
                                </div>
                                <span className="text-sm font-black text-gray-900">
                                    {app.pricing?.plans?.find(p => p.billingCycle === 'yearly')?.amount ? `₹${app.pricing.plans.find(p => p.billingCycle === 'yearly').amount}` : 'Free'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-white/40 rounded-[20px] border border-white/60">
                                <div className="flex items-center gap-3">
                                    <Eye className="w-4 h-4 text-gray-400" />
                                    <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">Visibility</span>
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${status === 'Live' ? 'text-emerald-600' : 'text-amber-500'}`}>
                                    {status === 'Live' ? 'Public' : 'Private'}
                                </span>
                            </div>

                            <div className="p-5 bg-gradient-to-br from-[#8b5cf6]/5 to-[#d946ef]/5 rounded-[24px] border border-[#8b5cf6]/10">
                                <div className="flex items-center gap-2 mb-2">
                                    <Activity className="w-4 h-4 text-[#8b5cf6]" />
                                    <span className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-widest">Active Users</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-4xl font-black text-gray-900 tracking-tighter">{app.usageCount || 0}</p>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Installs</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default AppDetails;
