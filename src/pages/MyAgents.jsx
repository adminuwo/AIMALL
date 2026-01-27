import React, { useEffect, useState } from 'react';
import { Plus, Settings, Trash2, Bot, Code, Edit3, Save, FileText, Download, Star, Play, Sparkles, Activity, ShieldCheck, Zap, ChevronRight, Mail, RotateCcw, MessageCircle } from 'lucide-react';
import { apiService } from '../services/apiService';
import axios from 'axios';
import { apis, AppRoute } from '../types';
import { getUserData } from '../userStore/userData';
import { useNavigate, Link } from 'react-router';
import AgentModal from '../Components/AgentModal/AgentModal';
import MyAgentCard from '../Components/MyAgentCard';
import ExpandedAgentChat from '../Components/ExpandedAgentChat';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import { themeState } from '../userStore/userData';
import { useLanguage } from '../context/LanguageContext';

const MyAgents = () => {
    const theme = useRecoilValue(themeState);
    const isDark = theme === 'Dark';
    const { t } = useLanguage();
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isExpandedChatOpen, setIsExpandedChatOpen] = useState(false);
    const [selectedAgentForChat, setSelectedAgentForChat] = useState(null);

    const user = getUserData("user");
    const navigate = useNavigate();

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

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this agent?')) {
            await apiService.deleteAgent(id);
            loadAgents();
        }
    };

    const handleUseAgent = (agent) => {
        const targetUrl = (!agent?.url || agent.url.trim() === "") ? AppRoute.agentSoon : agent.url;
        setSelectedAgent({ ...agent, url: targetUrl });
        setIsModalOpen(true);
    };

    const handleContactVendor = (agent) => {
        setSelectedAgentForChat(agent);
        setIsExpandedChatOpen(true);
    };

    const handleDocs = () => {
        navigate(AppRoute.INVOICES);
    };

    return (
        <div className={`flex-1 overflow-y-auto p-8 lg:p-12 no-scrollbar bg-transparent relative transition-colors duration-700 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {/* Decorative Background Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] ${isDark ? 'bg-purple-900/10' : 'bg-purple-200/20'} rounded-full blur-[120px] animate-pulse`} />
                <div className={`absolute top-[20%] right-[-5%] w-[40%] h-[40%] ${isDark ? 'bg-blue-900/10' : 'bg-blue-100/30'} rounded-full blur-[100px]`} />
                <div className={`absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] ${isDark ? 'bg-pink-900/10' : 'bg-pink-100/20'} rounded-full blur-[120px] animate-pulse`} style={{ animationDelay: '3s' }} />
                <div className={`absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] ${isDark ? 'bg-indigo-900/10' : 'bg-indigo-50/40'} rounded-full blur-[100px]`} />
            </div>

            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-20 relative z-10">
                <div className="space-y-4">
                    <h1 className={`text-5xl lg:text-7xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tighter leading-none transition-colors`}>
                        {t('my')} <span className="text-[#8B5CF6]">{t('agentsHeading')}</span>
                    </h1>
                    <p className={`${isDark ? 'text-white' : 'text-gray-500'} font-bold text-lg tracking-tight max-w-xl opacity-70 transition-colors`}>
                        {t('manageAgentsDesc')}
                    </p>
                </div>
            </header>

            {/* Content Section */}
            {loading ? (
                <div className="h-96 flex flex-col items-center justify-center gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full border-[6px] border-[#8B5CF6]/10 border-t-[#8B5CF6] animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Activity className="w-6 h-6 text-[#8B5CF6] animate-pulse" />
                        </div>
                    </div>
                    <p className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-[0.5em] animate-pulse">Syncing Core Registry...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                    <AnimatePresence mode="popLayout">
                        {/* Agents Grid */}
                        {agents.map((agent) => (
                            <MyAgentCard
                                key={agent._id}
                                agent={agent}
                                isDark={isDark}
                                onDelete={handleDelete}
                                onUse={handleUseAgent}
                                onContact={handleContactVendor}
                                onDocs={handleDocs}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            <AgentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                agent={selectedAgent}
            />

            <ExpandedAgentChat
                isOpen={isExpandedChatOpen}
                onClose={() => setIsExpandedChatOpen(false)}
                agent={selectedAgentForChat}
                user={user}
                isDark={isDark}
            />
        </div>
    );
};

export default MyAgents;
