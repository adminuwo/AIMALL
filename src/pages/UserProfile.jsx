import React, { useEffect, useState } from 'react';
import {
    User, Mail, Shield, Smartphone, Bot, MessageSquare,
    Edit2, Check, X, Camera, Calendar, Sparkles, Zap,
    CreditCard, Settings, Loader2, LogOut, HelpCircle, ChevronDown, ChevronUp,
    ShieldCheck, Activity, Terminal, Star
} from 'lucide-react';
import { faqs } from '../constants';
import axios from 'axios';
import { apis, AppRoute } from '../types';
import { getUserData, userData, setUserData } from '../userStore/userData';
import { chatStorageService } from '../services/chatStorageService';
import { useNavigate } from 'react-router';
import { useRecoilState, useRecoilValue } from 'recoil';
import { themeState } from '../userStore/userData';
import { motion, AnimatePresence } from 'framer-motion';

const UserProfile = () => {
    const theme = useRecoilValue(themeState);
    const isDark = theme === 'Dark';
    const [currentUserData, setCurrentUserData] = useRecoilState(userData);
    const user = currentUserData.user;
    const [agents, setAgents] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // FAQ & Support State
    const [isFaqOpen, setIsFaqOpen] = useState(false);
    const [openFaqIndex, setOpenFaqIndex] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [sendStatus, setSendStatus] = useState(null);
    const [issueText, setIssueText] = useState("");
    const [activeTab, setActiveTab] = useState("faq");
    const [issueType, setIssueType] = useState("General Inquiry");

    const issueOptions = [
        "General Inquiry",
        "Payment Issue",
        "Refund Request",
        "Technical Support",
        "Account Access",
        "Other"
    ];

    const handleSupportSubmit = async () => {
        if (!issueText.trim()) return;

        setIsSending(true);
        setSendStatus(null);

        try {
            await axios.post(apis.support, {
                email: user?.email || "guest@ai-mall.in",
                issueType,
                message: issueText,
                userId: user?.id || null
            });
            setSendStatus('success');
            setIssueText("");
            setTimeout(() => setSendStatus(null), 3000);
        } catch (error) {
            console.error("Support submission failed", error);
            setSendStatus('error');
        } finally {
            setIsSending(false);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate(AppRoute.LANDING);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = getUserData()?.token;
                if (!token) return;

                // Fetch User Data
                const userRes = await axios.get(apis.user, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setCurrentUserData({ user: userRes.data });
                setUserData(userRes.data); // Update localStorage via helper
                setNewName(userRes.data.name);

                // Fetch Agents
                const agentsRes = await axios.get(apis.getMyAgents, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setAgents(agentsRes.data || []);

                // Fetch Chat Sessions
                const sessionsData = await chatStorageService.getSessions();
                setSessions(sessionsData || []);

            } catch (error) {
                console.error("Error fetching profile data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleUpdateName = async () => {
        if (!newName.trim() || newName === user.name) {
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        try {
            const token = getUserData()?.token;
            const res = await axios.put(apis.user, { name: newName }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setCurrentUserData({ user: res.data });
            setUserData(res.data); // Update localStorage via helper

            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update name", error);
            alert("Failed to update name");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={`flex h-full w-full items-center justify-center ${isDark ? 'bg-slate-950/20' : 'bg-transparent'} gap-4 transition-colors`}>
                <div className={`w-16 h-16 rounded-[24px] ${isDark ? 'bg-purple-500/10' : 'bg-[#8b5cf6]/20'} flex items-center justify-center animate-spin`}>
                    <Loader2 className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-[#8b5cf6]'}`} />
                </div>
                <p className={`text-[10px] font-black ${isDark ? 'text-purple-400' : 'text-[#8b5cf6]'} uppercase tracking-[0.4em]`}>Syncing Core Registry</p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className={`h-full w-full overflow-y-auto no-scrollbar bg-transparent relative transition-colors duration-700 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {/* Background Aesthetic Section */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className={`absolute top-[10%] left-[20%] w-[600px] h-[600px] ${isDark ? 'bg-purple-900/10' : 'bg-[#8b5cf6]/5'} rounded-full blur-[140px] animate-blob transition-colors`} />
                <div className={`absolute bottom-[20%] right-[10%] w-[500px] h-[500px] ${isDark ? 'bg-pink-900/10' : 'bg-[#d946ef]/5'} rounded-full blur-[120px] animate-blob animation-delay-4000 transition-colors`} />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12 pb-32 space-y-12 md:space-y-20 relative z-10"
            >
                {/* Systematic Header */}
                <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className={`px-5 py-2 ${isDark ? 'bg-purple-900/40 border-purple-800/40' : 'bg-[#8b5cf6]/10 border-[#8b5cf6]/20'} border rounded-full flex items-center gap-3 transition-colors`}>
                                <div className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse" />
                                <span className={`text-[#8b5cf6] text-[10px] font-black tracking-[0.3em] uppercase`}>Identity Active</span>
                            </div>
                            <span className={`text-gray-400 text-[10px] font-black tracking-[0.3em] uppercase opacity-60`}>Neural Profile v4.2</span>
                        </div>
                        <h1 className={`text-5xl lg:text-7xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tighter leading-none transition-colors`}>
                            User <span className="text-[#8b5cf6]">Nexus.</span>
                        </h1>
                        <p className={`${isDark ? 'text-slate-400' : 'text-gray-400'} font-bold text-xl tracking-tight max-w-2xl opacity-70 transition-colors`}>
                            Managing consolidated identity parameters and intelligence node affiliations.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(AppRoute.INVOICES)}
                            className={`w-16 h-16 rounded-[24px] ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white/60 border-white'} text-gray-400 hover:text-[#8b5cf6] hover:bg-white transition-all shadow-sm flex items-center justify-center group/btn border`}
                            title="View Financial Registry"
                        >
                            <CreditCard size={22} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </header>

                {/* Profile Identity Card */}
                <section className={`${isDark ? 'bg-slate-900/60 border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]' : 'bg-white/40 backdrop-blur-3xl border-white/60 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]'} rounded-[32px] md:rounded-[64px] p-6 md:p-12 lg:p-16 relative overflow-hidden transition-all duration-700 border border-b-4 border-b-white/10`}>
                    <div className={`absolute top-0 right-0 w-96 h-96 ${isDark ? 'bg-purple-900/10' : 'bg-[#8b5cf6]/5'} rounded-full blur-[100px] pointer-events-none transition-colors`} />

                    <div className="flex flex-col lg:flex-row gap-16 items-center lg:items-end">
                        <div className="relative group shrink-0">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: -3 }}
                                className={`w-36 h-36 md:w-48 md:h-48 lg:w-64 lg:h-64 rounded-[32px] md:rounded-[56px] ${isDark ? 'bg-slate-800 border-white/10' : 'bg-white border-white/80'} p-2 border shadow-2xl relative z-10 overflow-hidden transition-colors`}
                            >
                                <div className={`w-full h-full rounded-[28px] md:rounded-[48px] ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-gray-50 to-white'} flex items-center justify-center text-4xl md:text-6xl font-black text-[#8b5cf6] overflow-hidden transition-colors`}>
                                    {user.avatar && user.avatar !== '/User.jpeg' ? (
                                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-[#8b5cf6]/5 flex items-center justify-center relative">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-[#8b5cf6]/10 to-transparent" />
                                            {user.name?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer relative z-20">
                                    <Camera className="w-10 h-10 text-white" strokeWidth={2.5} />
                                </div>
                            </motion.div>
                            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-emerald-500 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center z-20">
                                <ShieldCheck size={20} className="text-white" />
                            </div>
                        </div>

                        <div className="flex-1 space-y-8 w-full text-center lg:text-left">
                            <div className="space-y-2">
                                <div className="flex items-center justify-center lg:justify-start gap-4">
                                    <span className={`px-5 py-2 ${isDark ? 'bg-purple-900/20 text-purple-400 border-purple-800/40' : 'bg-[#8b5cf6]/10 text-[#8b5cf6] border-[#8b5cf6]/20'} text-[10px] font-black uppercase tracking-[0.3em] rounded-full border transition-colors`}>
                                        {user.role || "Member"} Node
                                    </span>
                                    {user.isVerified && (
                                        <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 rounded-full border border-amber-500/20">
                                            <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                                            <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Validated</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center justify-center lg:justify-start gap-4 h-16 md:h-24">
                                    {isEditing ? (
                                        <div className="flex items-center gap-2 md:gap-3 w-full max-w-lg">
                                            <input
                                                type="text"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                className={`flex-1 ${isDark ? 'bg-slate-800 text-white border-white/10' : 'bg-white text-gray-900 border-[#8b5cf6]/30'} border-2 rounded-[20px] md:rounded-[28px] px-4 md:px-8 py-3 md:py-5 text-xl md:text-3xl font-black focus:outline-none focus:border-[#8b5cf6] focus:ring-8 focus:ring-[#8b5cf6]/5 transition-all tracking-tighter`}
                                                autoFocus
                                            />
                                            <button
                                                onClick={handleUpdateName}
                                                disabled={isSaving}
                                                className="p-3 md:p-5 bg-emerald-500 text-white rounded-xl md:rounded-2xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50 active:scale-95"
                                            >
                                                {isSaving ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <Check className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setNewName(user.name);
                                                }}
                                                className="p-3 md:p-5 bg-white border border-gray-200 text-gray-400 rounded-xl md:rounded-2xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all active:scale-95"
                                            >
                                                <X className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="group flex items-center justify-center lg:justify-start gap-4 md:gap-6 cursor-pointer" onClick={() => setIsEditing(true)}>
                                            <h1 className={`text-4xl md:text-5xl lg:text-7xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tighter leading-none hover:text-[#8b5cf6] transition-colors`}>{user.name}</h1>
                                            <div className={`p-2 md:p-3 ${isDark ? 'bg-slate-800 border-white/10' : 'bg-white/60 border-white'} border rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0`}>
                                                <Edit2 className="w-4 h-4 md:w-5 md:h-5 text-[#8b5cf6]" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-x-12 gap-y-4">
                                <div className="flex items-center gap-4 group">
                                    <div className={`p-3 ${isDark ? 'bg-slate-800 border-white/5 shadow-inner' : 'bg-white border-gray-100 shadow-sm'} rounded-2xl group-hover:rotate-6 transition-all border`}>
                                        <Mail className="w-5 h-5 text-[#8b5cf6]" />
                                    </div>
                                    <span className={`text-lg font-bold ${isDark ? 'text-slate-400' : 'text-gray-400'} group-hover:text-gray-900 group-hover:text-white transition-colors uppercase tracking-tight`}>{user.email}</span>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className={`p-3 ${isDark ? 'bg-slate-800 border-white/5 shadow-inner' : 'bg-white border-gray-100 shadow-sm'} rounded-2xl group-hover:rotate-6 transition-all border`}>
                                        <Calendar className="w-5 h-5 text-[#d946ef]" />
                                    </div>
                                    <span className={`text-lg font-bold ${isDark ? 'text-slate-400' : 'text-gray-400'} group-hover:text-gray-900 group-hover:text-white transition-colors uppercase tracking-tight`}>Active since {new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>

                        <div className="shrink-0 flex flex-col gap-6 w-full lg:w-72">
                            <button
                                onClick={() => setIsFaqOpen(true)}
                                className={`w-full h-16 ${isDark ? 'bg-slate-800 border-white/5 text-white hover:bg-slate-700' : 'bg-white/60 border-white text-gray-900 hover:bg-white'} rounded-[28px] font-black text-[10px] uppercase tracking-[0.3em] shadow-sm hover:shadow-xl transition-all flex items-center justify-center gap-4 active:scale-95 px-8 border`}
                            >
                                <HelpCircle size={18} className="text-[#8b5cf6]" />
                                Nexus Support
                            </button>

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 px-2">
                                    <Shield size={14} className="text-red-500" />
                                    <span className={`text-[10px] font-black ${isDark ? 'text-slate-500' : 'text-gray-400'} uppercase tracking-[0.2em]`}>Access Control</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className={`w-full h-16 ${isDark ? 'bg-red-950/20 border-red-900/40 text-red-400 hover:bg-red-900/40' : 'bg-red-50 text-red-500 border-red-100 hover:bg-red-500 hover:text-white'} rounded-[28px] font-black text-[9px] uppercase tracking-tighter shadow-sm hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 px-4 border whitespace-nowrap`}
                                >
                                    <LogOut size={18} />
                                    Deactivate Token
                                </button>
                            </div>

                            <button className={`w-full h-14 ${isDark ? 'bg-white text-black hover:bg-slate-200' : 'bg-gray-900 text-white hover:bg-[#8b5cf6]'} rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-4 active:scale-95 px-8`}>
                                <Settings size={18} />
                                System Protocols
                            </button>
                        </div>
                    </div>
                </section>

                {/* Stats Matrix */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    <StatsCard
                        icon={<Bot className="w-7 h-7 text-[#8b5cf6]" />}
                        label="Active Nodes"
                        value={agents.length}
                        subLabel="Synchronized Assistants"
                        color="bg-[#8b5cf6]/10"
                        accent="#8b5cf6"
                    />
                    <StatsCard
                        icon={<MessageSquare className="w-7 h-7 text-[#d946ef]" />}
                        label="Log Entries"
                        value={sessions.length}
                        subLabel="Operational Sessions"
                        color="bg-[#d946ef]/10"
                        accent="#d946ef"
                    />
                    <StatsCard
                        icon={<Zap className="w-7 h-7 text-amber-500" />}
                        label="Subscription"
                        value={user.plan === 'pro' ? 'QUANTUM' : 'BASIC'}
                        subLabel="Processing Tier"
                        color="bg-amber-500/10"
                        accent="#f59e0b"
                    />
                    <StatsCard
                        icon={<Activity className="w-7 h-7 text-emerald-500" />}
                        label="Resource Cap"
                        value="UNLIMITED"
                        subLabel="Nexus Priority: High"
                        color="bg-emerald-500/10"
                        accent="#10b981"
                    />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Primary Fleet Section */}
                    <div className="lg:col-span-2 space-y-10">
                        <header className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Terminal size={24} className="text-[#8b5cf6]" />
                                <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tighter uppercase transition-colors`}>Deployment Matrix</h3>
                            </div>
                            <button
                                onClick={() => navigate(AppRoute.MY_AGENTS)}
                                className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-[0.3em] hover:tracking-[0.4em] transition-all"
                            >
                                Expand Fleet
                            </button>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <AnimatePresence mode="popLayout">
                                {agents.slice(0, 4).map((agent, idx) => (
                                    <motion.div
                                        key={agent._id || agent.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        onClick={() => navigate(AppRoute.MY_AGENTS)}
                                        className={`${isDark ? 'bg-slate-900 border-white/5 hover:bg-slate-800 shadow-2xl' : 'bg-white/40 border-white/60 hover:bg-white border-b-white/50 shadow-sm'} backdrop-blur-3xl p-8 rounded-[48px] border hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 cursor-pointer group flex items-start gap-6 border-b-4 transition-all duration-700`}
                                    >
                                        <div className={`w-20 h-20 rounded-[28px] ${isDark ? 'bg-slate-800 border-white/5' : 'bg-white border-gray-50'} flex items-center justify-center overflow-hidden shrink-0 border shadow-lg group-hover:rotate-6 transition-transform`}>
                                            {agent.avatar ? <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" /> : <Bot className="w-8 h-8 text-gray-300" />}
                                        </div>
                                        <div className="min-w-0 flex-1 space-y-2">
                                            <h4 className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'} truncate uppercase tracking-tight group-hover:text-[#8b5cf6] transition-colors`}>{agent.name}</h4>
                                            <p className={`text-sm font-bold ${isDark ? 'text-slate-400' : 'text-gray-400'} line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity`}>{agent.description || "Core operational node."}</p>
                                            <div className="pt-2 flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                                    Linking Active
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {agents.length === 0 && (
                                <div className="col-span-full py-24 text-center bg-white/20 border-2 border-dashed border-white/60 rounded-[48px] px-12 group hover:bg-white/30 transition-all cursor-pointer" onClick={() => navigate(AppRoute.MARKETPLACE)}>
                                    <Bot className="w-16 h-16 text-gray-300 mx-auto mb-6 opacity-40 group-hover:scale-110 group-hover:rotate-12 transition-all" />
                                    <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">Fleet Empty</h4>
                                    <p className="text-gray-400 font-bold text-lg mb-8 opacity-70">No intelligence nodes found in your current profile registry.</p>
                                    <button className="px-10 py-4 bg-gray-900 text-white rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-[#8b5cf6] transition-all">Acquire New Entity</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Secondary Logs Section */}
                    <div className="space-y-10">
                        <header className="flex items-center gap-4">
                            <Activity size={24} className="text-[#d946ef]" />
                            <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tighter uppercase transition-colors`}>Registry Logs</h3>
                        </header>

                        <div className="bg-white/40 backdrop-blur-3xl rounded-[48px] border border-white/60 overflow-hidden shadow-sm border-b-4 border-b-white/50">
                            {sessions.slice(0, 6).map((session, i) => (
                                <motion.div
                                    whileHover={{ x: 10, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)' }}
                                    key={session.sessionId || i}
                                    onClick={() => navigate(`/dashboard/chat/${session.sessionId}`)}
                                    className={`flex items-center gap-6 p-6 border-b ${isDark ? 'border-white/5' : 'border-white'} last:border-0 transition-all cursor-pointer group`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-sm border ${isDark ? 'border-white/5' : 'border-gray-50'} flex items-center justify-center shrink-0 text-gray-300 group-hover:text-[#d946ef] group-hover:scale-110 transition-all`}>
                                        <MessageSquare className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`text-base font-black ${isDark ? 'text-white' : 'text-gray-900'} truncate uppercase tracking-tight group-hover:text-[#d946ef] transition-colors`}>
                                            {session.title || "Untitled Session"}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <span className="opacity-50">SYNCED</span>
                                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span>
                                                {new Date(session.lastModified).toLocaleDateString(undefined, {
                                                    month: 'short', day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {sessions.length === 0 && (
                                <div className="p-16 text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] opacity-60">No telemetry logs recorded.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* FAQ / Nexus Overlay */}
                <AnimatePresence>
                    {isFaqOpen && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 lg:p-12">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsFaqOpen(false)}
                                className="absolute inset-0 bg-gray-900/40 backdrop-blur-md"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 40 }}
                                className={`${isDark ? 'bg-slate-900/90 border-white/10 shadow-[0_64px_128px_-32px_rgba(0,0,0,0.8)]' : 'bg-white/90 border-white shadow-[0_64px_128px_-32px_rgba(0,0,0,0.3)]'} backdrop-blur-3xl rounded-[32px] md:rounded-[64px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border relative z-10 border-b-[8px] transition-colors duration-700 ${isDark ? 'border-b-purple-900/40' : 'border-b-[#8b5cf6]/20'}`}
                            >
                                <div className={`p-6 md:p-10 lg:p-14 border-b ${isDark ? 'border-white/5 bg-slate-900/40' : 'border-gray-100 bg-white/40'} flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8 transition-colors`}>
                                    <div className={`flex ${isDark ? 'bg-slate-800' : 'bg-gray-100'} p-1.5 md:p-2 rounded-[24px] md:rounded-[32px] gap-1 md:gap-2 transition-colors`}>
                                        <button
                                            onClick={() => setActiveTab('faq')}
                                            className={`px-4 md:px-10 py-3 md:py-5 rounded-[18px] md:rounded-[24px] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all ${activeTab === 'faq' ? (isDark ? 'bg-slate-700 text-purple-400 shadow-xl' : 'bg-white text-[#8b5cf6] shadow-xl') : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            FAQ
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('help')}
                                            className={`px-4 md:px-10 py-3 md:py-5 rounded-[18px] md:rounded-[24px] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all ${activeTab === 'help' ? (isDark ? 'bg-slate-700 text-purple-400 shadow-xl' : 'bg-white text-[#8b5cf6] shadow-xl') : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            Support
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => setIsFaqOpen(false)}
                                        className={`w-12 h-12 md:w-16 md:h-16 ${isDark ? 'bg-slate-800 border-white/5 hover:bg-red-900/20' : 'bg-white border-gray-100 hover:bg-red-50'} border rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-100 transition-all shadow-sm`}
                                    >
                                        <X size={20} md:size={28} strokeWidth={2.5} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-10 lg:p-14 space-y-6 no-scrollbar">
                                    {activeTab === 'faq' ? (
                                        faqs.map((faq, index) => (
                                            <motion.div
                                                layout
                                                key={index}
                                                className={`border rounded-[36px] ${isDark ? 'bg-slate-800' : 'bg-white'} transition-all overflow-hidden ${openFaqIndex === index ? (isDark ? 'border-purple-500 shadow-2xl ring-4 ring-purple-500/10' : 'border-[#8b5cf6] shadow-2xl ring-4 ring-[#8b5cf6]/5') : (isDark ? 'border-white/5 hover:border-white/10' : 'border-gray-100 hover:border-gray-200')} shadow-sm`}
                                            >
                                                <button
                                                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                                                    className="w-full flex justify-between items-center p-8 text-left focus:outline-none"
                                                >
                                                    <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tight uppercase leading-tight transition-colors`}>{faq.question}</span>
                                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${openFaqIndex === index ? (isDark ? 'bg-purple-600 text-white rotate-180' : 'bg-[#8b5cf6] text-white rotate-180') : (isDark ? 'bg-slate-700 text-slate-400' : 'bg-gray-50 text-gray-400')}`}>
                                                        <ChevronDown className="w-5 h-5" strokeWidth={3} />
                                                    </div>
                                                </button>
                                                <AnimatePresence>
                                                    {openFaqIndex === index && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            className="px-8 pb-8"
                                                        >
                                                            <div className={`pt-6 border-t ${isDark ? 'border-white/5 text-slate-400' : 'border-gray-50 text-gray-400'} text-lg font-bold leading-relaxed uppercase tracking-tight`}>
                                                                {faq.answer}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="max-w-3xl mx-auto space-y-12 py-10">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">Protocol Category</label>
                                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                    {issueOptions.map((opt) => (
                                                        <button
                                                            key={opt}
                                                            onClick={() => setIssueType(opt)}
                                                            className={`py-4 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest border transition-all ${issueType === opt ? 'bg-[#8b5cf6] text-white border-[#8b5cf6] shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'}`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className={`text-[10px] font-black ${isDark ? 'text-slate-500' : 'text-gray-400'} uppercase tracking-[0.4em] transition-colors`}>Transmission Details</label>
                                                <textarea
                                                    className={`w-full p-8 rounded-[48px] ${isDark ? 'bg-slate-800 text-white border-white/5 focus:ring-purple-500/10' : 'bg-white text-gray-900 border-gray-100 focus:ring-[#8b5cf6]/5'} border focus:border-[#8b5cf6] focus:ring-8 outline-none resize-none text-xl font-bold min-h-[250px] shadow-sm tracking-tight placeholder:text-gray-500 transition-all uppercase`}
                                                    placeholder="Input support request sequence..."
                                                    value={issueText}
                                                    onChange={(e) => setIssueText(e.target.value)}
                                                />
                                            </div>

                                            <div className="pt-4 space-y-8">
                                                <button
                                                    onClick={handleSupportSubmit}
                                                    disabled={isSending || !issueText.trim()}
                                                    className={`w-full py-8 rounded-[36px] font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 shadow-2xl ${isSending || !issueText.trim() ? 'bg-gray-100 text-gray-300 opacity-50' : 'bg-[#8b5cf6] text-white hover:bg-black hover:scale-[1.02]'}`}
                                                >
                                                    {isSending ? (
                                                        <Loader2 className="w-6 h-6 animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Zap className="w-5 h-5" fill="currentColor" />
                                                            Initialize Support Sequence
                                                        </>
                                                    )}
                                                </button>

                                                <AnimatePresence>
                                                    {sendStatus && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0 }}
                                                            className={`p-6 rounded-[32px] text-center font-black text-[10px] uppercase tracking-[0.3em] border transition-colors ${sendStatus === 'success' ? (isDark ? 'bg-emerald-900/20 text-emerald-400 border-emerald-800/40' : 'bg-emerald-50 text-emerald-600 border-emerald-100') : (isDark ? 'bg-red-900/20 text-red-400 border-red-800/40' : 'bg-red-50 text-red-600 border-red-100')}`}
                                                        >
                                                            {sendStatus === 'success' ? 'Transmission Successful. Support link pending.' : 'Nexus Link Failure. Retry sequence.'}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

const StatsCard = ({ icon, label, value, subLabel, color, accent }) => {
    const theme = useRecoilValue(themeState);
    const isDark = theme === 'Dark';
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className={`${isDark ? 'bg-slate-900/60 border-white/10 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]' : 'bg-white/40 border-white/60 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.03)] border-b-white/50'} backdrop-blur-3xl p-6 md:p-10 rounded-[32px] md:rounded-[56px] border hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] transition-all duration-700 relative overflow-hidden flex flex-col items-center text-center border-b-4 transition-all duration-700`}
        >
            <div className={`absolute top-0 right-0 w-32 h-32 ${isDark ? 'bg-white/5' : 'bg-gray-50/50'} rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white transition-all duration-1000`} />

            <div className={`w-20 h-20 rounded-[32px] ${color} flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl border ${isDark ? 'border-white/5' : 'border-white'} relative z-10`}>
                {icon}
            </div>

            <div className="space-y-1 relative z-10">
                <h4 className={`text-4xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tighter uppercase leading-none transition-colors`}>{value}</h4>
                <p className={`text-[10px] font-black ${isDark ? 'text-slate-500' : 'text-gray-400'} uppercase tracking-[0.3em] opacity-60 group-hover:text-[#8b5cf6] hover:opacity-100 transition-all`}>{label}</p>
            </div>

            <p className={`mt-8 text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-gray-400'} opacity-40 group-hover:opacity-100 transition-all`}>{subLabel}</p>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-full" style={{ backgroundColor: accent }} />
        </motion.div>
    );
};

export default UserProfile;
