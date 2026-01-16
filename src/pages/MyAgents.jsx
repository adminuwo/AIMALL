import React, { useEffect, useState } from 'react';
import { Plus, Settings, Trash2, Bot, Code, Edit3, Save, FileText, Download, Star, Play, Sparkles, Activity, ShieldCheck, Zap, ChevronRight, Mail, RotateCcw, MessageCircle } from 'lucide-react';
import { apiService } from '../services/apiService';
import axios from 'axios';
import { apis, AppRoute } from '../types';
import { getUserData } from '../userStore/userData';
import { useNavigate, Link } from 'react-router';
import AgentModal from '../Components/AgentModal/AgentModal';
import ContactVendorModal from '../Components/ContactVendorModal';
import { motion, AnimatePresence } from 'framer-motion';

const MyAgents = () => {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [editedInstructions, setEditedInstructions] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Modal State
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Contact Vendor Modal State
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [selectedAgentForContact, setSelectedAgentForContact] = useState(null);

    const user = getUserData("user")
    const navigate = useNavigate()

    useEffect(() => {
        loadAgents();
    }, []);

    const loadAgents = async () => {
        setLoading(true);
        const userId = user?.id || user?._id;
        try {
            const res = await axios.post(apis.getUserAgents, { userId });
            setAgents(res.data.agents);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAgent = async () => {
        const newAgent = {
            name: 'New Agent',
            description: 'A new custom assistant.',
            type: 'general',
            instructions: 'You are a helpful assistant.'
        };
        await apiService.createAgent(newAgent);
        loadAgents();
    };

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this agent?')) {
            await apiService.deleteAgent(id);
            loadAgents();
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 no-scrollbar bg-transparent relative">
            {/* Decorative Background Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-purple-200/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] bg-pink-100/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }} />
                <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-50/40 rounded-full blur-[100px]" />
            </div>

            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-20 relative z-10">
                <div className="space-y-4">
                    <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-none">
                        My <span className="text-[#8b5cf6]">Agents.</span>
                    </h1>
                    <p className="text-gray-500 font-bold text-lg tracking-tight max-w-xl opacity-70">
                        Manage your collection of AI agents.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    {/* Inbox button removed */}
                </div>
            </header>

            {/* Content Section */}
            {loading ? (
                <div className="h-96 flex flex-col items-center justify-center gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full border-[6px] border-[#8b5cf6]/10 border-t-[#8b5cf6] animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-[#8b5cf6] animate-pulse" />
                        </div>
                    </div>
                    <p className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-[0.5em] animate-pulse">Syncing Core Registry...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                    <AnimatePresence mode="popLayout">
                        {/* Agents Grid */}
                        {agents.map((agent, index) => (
                            <motion.div
                                key={agent._id}
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{
                                    y: [0, -10, 0],
                                    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                                }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white/40 backdrop-blur-3xl border border-white/80 rounded-[32px] p-6 shadow-[0_15px_35px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(139,92,246,0.3)] hover:border-[#8b5cf6]/30 transition-all duration-500 group relative overflow-hidden flex flex-col h-full"
                            >
                                {/* Decorative Gradient Overlay & Glow */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#8b5cf6]/10 rounded-full blur-[80px] group-hover:bg-[#8b5cf6]/20 transition-all duration-700" />

                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="w-14 h-14 bg-white rounded-[20px] p-0.5 flex items-center justify-center shadow-xl border border-white group-hover:scale-110 transition-all duration-700 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-white opacity-50" />
                                        <img
                                            src={agent.avatar || `https://ui-avatars.com/api/?name=${agent.agentName}&background=8b5cf6&color=fff`}
                                            className="w-full h-full object-cover rounded-[16px] relative z-10"
                                            alt={agent.agentName}
                                        />
                                    </div>

                                    {/* Delete Action Overlay */}
                                    <button
                                        onClick={(e) => handleDelete(agent._id, e)}
                                        className="w-10 h-10 rounded-xl bg-red-50/10 hover:bg-red-500 text-red-500 hover:text-white backdrop-blur-md border border-red-500/20 hover:border-red-500 transition-all duration-500 flex items-center justify-center group/delete shadow-lg hover:shadow-red-500/20"
                                        title="Terminate Agent"
                                    >
                                        <Trash2 size={16} className="group-hover/delete:scale-110 transition-transform" />
                                    </button>
                                </div>

                                <div className="flex-1 relative z-10 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none group-hover:text-[#8b5cf6] transition-colors">{agent.agentName}</h3>
                                    </div>

                                    <div className="flex items-center gap-2 text-[9px] font-black text-[#8b5cf6] uppercase tracking-[0.2em] opacity-80">
                                        <Zap size={9} fill="currentColor" className="text-[#8b5cf6]" />
                                        {agent.category || 'Business OS'}
                                    </div>

                                    <p className="text-[12px] text-gray-500 font-bold leading-relaxed mb-8 h-20 line-clamp-3 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                                        {agent.description}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-8 relative z-10 gap-4 pt-6 border-t border-white/60">
                                    <button
                                        onClick={() => {
                                            const targetUrl = (!agent?.url || agent.url.trim() === "") ? AppRoute.agentSoon : agent.url;
                                            setSelectedAgent({ ...agent, url: targetUrl });
                                            setIsModalOpen(true);
                                        }}
                                        className="flex-[2.5] py-3.5 bg-[#8b5cf6] text-white rounded-[24px] font-black text-[9px] shadow-[0_10px_30px_-10px_rgba(139,92,246,0.5)] hover:bg-emerald-500 hover:shadow-[0_10px_30px_-10px_rgba(16,185,129,0.5)] hover:scale-105 active:scale-95 transition-all duration-500 flex items-center justify-center gap-3 uppercase tracking-[0.2em] group/launch"
                                    >
                                        <Play size={14} fill="currentColor" className="group-hover/launch:scale-110 transition-transform" />
                                        USE
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedAgentForContact(agent);
                                            setIsContactModalOpen(true);
                                        }}
                                        className="w-12 h-12 rounded-[18px] bg-white/60 backdrop-blur-md border border-white text-gray-400 hover:text-[#8b5cf6] hover:bg-white transition-all duration-500 flex items-center justify-center group/chat relative"
                                        title="Direct Protocol"
                                    >
                                        <MessageCircle size={18} className="group-hover/chat:scale-110 transition-transform" />
                                        <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#d946ef] rounded-full border border-white shadow-sm" />
                                    </button>

                                    <button
                                        onClick={() => navigate(AppRoute.INVOICES)}
                                        className="w-12 h-12 rounded-[18px] bg-white/60 backdrop-blur-md border border-white text-gray-400 hover:text-[#8b5cf6] hover:bg-white transition-all duration-500 flex items-center justify-center group/doc"
                                        title="Export Logs"
                                    >
                                        <FileText size={18} className="group-hover/doc:scale-110 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}


                    </AnimatePresence>
                </div>
            )}

            <AgentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                agent={selectedAgent}
            />

            <ContactVendorModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                agent={selectedAgentForContact}
                user={user}
            />
        </div>
    );
};

export default MyAgents;
