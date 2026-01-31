import React, { useEffect, useState, useMemo } from 'react';
import { Search, Star, Play, X, Info, Send, Terminal, Sparkles, Activity, Zap, ChevronRight, Mail, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { apis, AppRoute } from '../types';
import { getUserData, toggleState } from '../userStore/userData';
import SubscriptionForm from '../Components/SubscriptionForm/SubscriptionForm';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import ContactVendorModal from '../Components/ContactVendorModal';
import { themeState } from '../userStore/userData';
import ParallaxAgentCard from '../Components/ParallaxAgentCard';
import { useLanguage } from '../context/LanguageContext';

const SkeletonCard = ({ isDark }) => (
    <div className="w-full h-full animate-pulse">
        <div className={`relative h-[340px] w-full ${isDark ? 'bg-slate-800/40 border-white/5' : 'bg-gray-200/50 border-gray-100'} rounded-[48px] border overflow-hidden`}>
            <div className="flex flex-col items-center justify-between h-full p-8 pt-12 pb-10">
                <div className="flex flex-col items-center space-y-4 w-full">
                    <div className={`w-24 h-24 rounded-3xl ${isDark ? 'bg-slate-700/50' : 'bg-gray-300/50'}`} />
                    <div className="space-y-2 w-full flex flex-col items-center">
                        <div className={`h-6 w-3/4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-300/50'}`} />
                        <div className={`h-4 w-1/2 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-gray-300/50'}`} />
                    </div>
                </div>
                <div className="flex items-center gap-3 w-full justify-center px-4">
                    <div className={`w-12 h-12 rounded-full ${isDark ? 'bg-slate-700/50' : 'bg-gray-300/50'}`} />
                    <div className={`h-12 w-28 rounded-3xl ${isDark ? 'bg-slate-700/50' : 'bg-gray-300/50'}`} />
                </div>
            </div>
        </div>
    </div>
);

const Marketplace = () => {


    const [agents, setAgents] = useState([]); // Default to empty array to avoid showing placeholders while loading real data
    const [filter, setFilter] = useState('all');
    const [userAgent, setUserAgent] = useState([])
    const [loading, setLoading] = useState(false)
    const [subToggle, setSubToggle] = useRecoilState(toggleState)
    const user = getUserData()
    const [agentId, setAgentId] = useState("")
    const [searchQuery, setSearchQuery] = useState("");
    const [showDemo, setShowDemo] = useState(false)
    const [demoUrl, setDemoUrl] = useState("")
    const [showAgentInfo, setShowAgentInfo] = useState(false)
    const [selectedAgent, setSelectedAgent] = useState(null)
    const [helpForm, setHelpForm] = useState({ subject: '', message: '' })
    const [showContactModal, setShowContactModal] = useState(false)
    const [contactAgent, setContactAgent] = useState(null);
    const navigate = useNavigate();
    const theme = useRecoilValue(themeState);
    const isDark = theme === 'Dark';
    const { t } = useLanguage();

    useEffect(() => {
        if (!user) {
            navigate(AppRoute.LOGIN);
            return;
        }

        const fetchData = async () => {
            // Only show loader if we genuinely have no content
            if (agents.length === 0) {
                setLoading(true);
            }
            const userId = user?.id || user?._id;

            try {
                // Fetch agents
                const agentsRes = await axios.get(apis.agents);
                const apiAgents = (agentsRes.data && Array.isArray(agentsRes.data)) ? agentsRes.data : [];

                setAgents(apiAgents);

                if (userId) {
                    try {
                        const userAgentsRes = await axios.post(apis.getUserAgents, { userId });
                        setUserAgent(userAgentsRes.data?.agents || []);
                    } catch (error) {
                        console.error("Error fetching user agents:", error);
                        setUserAgent([]);
                    }
                } else {
                    setUserAgent([]);
                }
            } catch (error) {
                console.error("Error fetching marketplace data:", error);
                // Keep visually populated
                // setAgents(MOCK_AGENTS);
                setAgents([]);
            } finally {
                setLoading(false);
            }
        };


        fetchData();
    }, [agentId, user?.id, user?._id, subToggle, isDark]);

    const toggleBuy = (id) => {
        if (!user) {
            navigate(AppRoute.LOGIN)
            return
        }
        setSubToggle({ ...subToggle, subscripPgTgl: true })
        setAgentId(id)
    };

    const openAgentInfo = (agent) => {
        setSelectedAgent(agent);
        setShowAgentInfo(true);
        setHelpForm({ subject: '', message: '' });
    };

    const sendHelpQuery = async () => {
        if (!selectedAgent) return;
        const vendorEmail = selectedAgent.supportEmail || selectedAgent.vendorEmail || 'support@ai-mall.in';
        const subject = helpForm.subject;
        const message = helpForm.message;
        try {
            await axios.post('http://localhost:5000/api/support', {
                email: user?.email || 'guest@ai-mall.in',
                senderName: user?.name || 'Guest User',
                issueType: 'UserSupport',
                subject: `[Inquiry] ${selectedAgent.agentName}: ${subject}`,
                message: message,
                userId: selectedAgent.owner
            });
            const mailtoSubject = encodeURIComponent(`Query about ${selectedAgent.agentName} - ${subject}`);
            const body = encodeURIComponent(`Agent: ${selectedAgent.agentName}\nCategory: ${selectedAgent.category}\n\nSubject: ${subject}\n\nMessage:\n${message}`);
            window.location.href = `mailto:${vendorEmail}?subject=${mailtoSubject}&body=${body}`;
            setShowAgentInfo(false);
            setHelpForm({ subject: '', message: '' });
        } catch (error) {
            console.error("Failed to log support inquiry:", error);
            window.location.href = `mailto:${vendorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
        }
    };

    // Strict Filter: Only show Live + Approved agents.
    const filteredAgents = useMemo(() => {
        return agents.filter(agent => {
            const isLive = !agent.status || agent.status === 'Live' || agent.status === 'active';
            const isApproved = agent.reviewStatus === 'Approved';

            const aSeriesNames = [
                'AIBIZ', 'AIBASE', 'AICRAFT', 'AISA', 'AIBOTT',
                'AIGENE', 'AIBRAND', 'AISTREAM', 'AIOFFICE', 'AIDESK', 'AIFLOW'
            ];

            const name = (agent.agentName || agent.name || "").trim().toUpperCase();
            const isASeries = aSeriesNames.includes(name);

            const matchesCategory = filter === 'all' || agent.category === filter;
            const matchesSearch = (agent.agentName || agent.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                (agent.description || "").toLowerCase().includes(searchQuery.toLowerCase());

            return isLive && isApproved && !isASeries && matchesCategory && matchesSearch;
        });
    }, [agents, filter, searchQuery]);

    const categories = [
        { id: 'all', label: t('catAll') },
        { id: 'Business OS', label: t('catBusiness') },
        { id: 'Data & Intelligence', label: t('catData') },
        { id: 'Sales & Marketing', label: t('catSales') },
        { id: 'HR & Finance', label: t('catHr') },
        { id: 'Design & Creative', label: t('catDesign') },
        { id: 'Medical & Health AI', label: t('catMedical') }
    ];
    // Exclude A-Series from Top Trending too
    const topUsedAgents = useMemo(() => {
        return agents.filter(a => ![
            'AIBIZ', 'AIBASE', 'AICRAFT', 'AISA', 'AIBOTT',
            'AIGENE', 'AIBRAND', 'AISTREAM', 'AIOFFICE', 'AIDESK', 'AIFLOW'
        ].includes(a.agentName?.trim().toUpperCase())).slice(0, 3);
    }, [agents]);

    // --- ANIMATION VARIANTS ---
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15, // Staggered reveal
                delayChildren: 0.2
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        },
        floating: {
            y: [0, -10, 0],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className={`flex-1 overflow-y-auto w-full h-full transition-colors duration-700 ${isDark ? 'bg-[#1a2235]' : 'bg-[#FAFAFA]'} relative no-scrollbar`}>
            {/* --- GLOBAL BACKGROUND: Soft Pastel Gradients --- */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-700">
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#1a2235] via-[#242f49] to-[#1a2235]' : 'bg-gradient-to-br from-indigo-50/50 via-white to-fuchsia-50/30'} transition-all duration-700`}></div>
                {/* Floating Orbs */}
                <div className={`absolute top-[-10%] left-[-10%] w-[80vmax] h-[80vmax] ${isDark ? 'bg-purple-900/20' : 'bg-purple-200/20'} rounded-full blur-[100px] animate-pulse transition-colors duration-700`} />
                <div className={`absolute bottom-[-10%] right-[-10%] w-[60vmax] h-[60vmax] ${isDark ? 'bg-blue-900/20' : 'bg-blue-200/20'} rounded-full blur-[120px] transition-colors duration-700`} />
                <div className={`absolute top-[40%] left-[20%] w-[40vmax] h-[40vmax] ${isDark ? 'bg-pink-900/20' : 'bg-pink-200/10'} rounded-full blur-[90px] transition-colors duration-700`} />
            </div>

            <div className="relative z-10 p-4 md:p-10 lg:p-14 max-w-[1600px] mx-auto">

                <AnimatePresence>
                    {subToggle.subscripPgTgl && <SubscriptionForm id={agentId} />}

                    {/* Modals */}
                    {showDemo && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0f172a]/40 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className={`${isDark ? 'bg-[#242f49] border-white/10' : 'bg-white/70 border-white/80'} backdrop-blur-2xl rounded-[32px] md:rounded-[40px] p-6 md:p-8 w-full max-w-5xl shadow-2xl relative border mx-4`}
                            >
                                <button onClick={() => setShowDemo(false)} className={`absolute -top-4 -right-4 ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'} p-3 rounded-full shadow-lg hover:scale-110 transition-transform border ${isDark ? 'border-white/10' : 'border-gray-100'}`}><X className="w-5 h-5" /></button>
                                <div className="aspect-video w-full rounded-[32px] overflow-hidden bg-gray-950 border-4 border-white/40 shadow-inner">
                                    <iframe width="100%" height="100%" src={demoUrl} title="Agent Demo" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {showAgentInfo && selectedAgent && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-[#0f172a]/40 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                                className={`${isDark ? 'bg-[#1e293b] border-white/10' : 'bg-gray-100'} rounded-[32px] overflow-hidden w-full max-w-xl shadow-2xl relative flex flex-col`}
                            >
                                {/* Modal Header/Top Part */}
                                <div className={`${isDark ? 'bg-[#12182B]' : 'bg-[#e2e8f0]'} p-6 md:p-8 pb-6`}>
                                    <button
                                        onClick={() => setShowAgentInfo(false)}
                                        className={`absolute top-6 right-6 p-2 rounded-full ${isDark ? 'bg-[#0B0F1A] hover:bg-[#12182B] text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'} transition-all`}
                                    >
                                        <X size={18} />
                                    </button>
                                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                                        {/* Agent Logo Container */}
                                        <div className={`w-24 h-24 rounded-[24px] bg-white p-3 shadow-xl flex items-center justify-center shrink-0`}>
                                            <img
                                                src={selectedAgent.avatar}
                                                alt={selectedAgent.agentName}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <div className="flex flex-col items-center md:items-start space-y-2 pt-1">
                                            <h2 className={`text-2xl font-black ${isDark ? 'text-[#E6E9F2]' : 'text-gray-900'} tracking-tight`}>
                                                {t(selectedAgent.agentName)}
                                            </h2>
                                            <div className="bg-[#8B5CF6]/20 text-[#8B5CF6] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                {categories.find(c => c.id === selectedAgent.category)?.label || selectedAgent.category}
                                            </div>
                                            <p className={`text-xs ${isDark ? 'text-[#C7CBEA]' : 'text-gray-600'} font-semibold leading-relaxed text-center md:text-left`}>
                                                {t(selectedAgent.description)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* More in Category Section */}
                                <div className={`p-6 md:p-8 pt-8 flex-1 ${isDark ? 'bg-[#0B0F1A]' : 'bg-white'}`}>
                                    <h3 className={`text-[10px] font-black ${isDark ? 'text-[#E6E9F2]' : 'text-black'} uppercase tracking-[0.1em] mb-4`}>
                                        {t('moreIn').replace('{category}', categories.find(c => c.id === selectedAgent.category)?.label || selectedAgent.category)}
                                    </h3>
                                    <div className={`flex items-center justify-center h-20 ${isDark ? 'text-[#6F76A8]' : 'text-gray-400'} italic font-bold text-[13px]`}>
                                        {t('noOtherApps')}
                                    </div>
                                </div>
                                {/* Modal Footer */}
                                <div className={`p-6 md:px-8 md:py-8 border-t ${isDark ? 'border-white/5 bg-[#12182B]' : 'border-gray-100 bg-white'} flex items-center justify-between gap-4`}>
                                    <button
                                        onClick={() => setShowAgentInfo(false)}
                                        className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-[#C7CBEA] hover:text-[#E6E9F2]' : 'text-gray-500 hover:text-black'} transition-all`}
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        onClick={() => {
                                            toggleBuy(selectedAgent._id);
                                            setShowAgentInfo(false);
                                        }}
                                        className="flex-1 max-w-[280px] bg-[#8B5CF6] text-white py-3 px-8 rounded-[20px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-purple-500/20 hover:bg-[#7c3aed] transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Zap size={14} fill="white" />
                                        {t('subscribeNow')}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* --- HERO SECTION --- 
                    Refined with floating motion, soft outer glow, and stronger, smoother gradients. 
                    - USER REQUIREMENT: Keep this light/bright even in dark mode.
                */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className={`marketplace-hero-card relative w-full min-h-[250px] md:min-h-[360px] mb-12 rounded-[60px] overflow-hidden bg-white shadow-[0_30px_100px_-20px_rgba(139,92,246,0.3),0_10px_30px_-5px_rgba(236,72,153,0.1)] border border-white/50 transition-all duration-700 flex items-center group hover:scale-[1.005] hover:shadow-[0_40px_120px_-10px_rgba(139,92,246,0.45)]`}
                >
                    {/* Subtle Gradient Glowing Mixture (Blue, Purple, Pink) */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <motion.div
                            animate={{
                                opacity: [0.03, 0.08, 0.03],
                                scale: [1, 1.2, 1],
                                x: [-20, 20, -20]
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px]"
                        />
                        <motion.div
                            animate={{
                                opacity: [0.04, 0.1, 0.04],
                                scale: [1.2, 1, 1.2],
                                x: [30, -30, 30]
                            }}
                            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-[-20%] left-[10%] w-[600px] h-[600px] bg-[#9333EA]/10 rounded-full blur-[140px]"
                        />
                        <motion.div
                            animate={{
                                opacity: [0.03, 0.07, 0.03],
                                scale: [1, 1.3, 1],
                                y: [-20, 20, -20]
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-pink-400/20 rounded-full blur-[110px]"
                        />
                    </div>
                    {/* Background Video Container - Extreme Right Alignment with Seamless Fade */}
                    <div className="absolute top-0 right-0 h-full w-full md:w-[65%] pointer-events-none overflow-hidden select-none">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover transition-opacity duration-1000 group-hover:opacity-100"
                            style={{ objectPosition: '100% center', opacity: 1 }}
                        >
                            <source src="/videos/robotgirl.mp4" type="video/mp4" />
                        </video>
                        {/* Gradient Mask for seamless integration - Reduced opacity for better robot visibility */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent" />
                    </div>

                    <div className="relative z-10 flex flex-col items-start justify-center text-left px-8 md:px-20 py-8 w-full md:w-1/2">
                        {/* High Fidelity Typography per Reference */}
                        <div className="space-y-4 md:space-y-6">
                            <h1 className="text-4xl md:text-[80px] font-black tracking-[-0.05em] leading-[0.85] text-black transition-all">
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="relative z-10 block"
                                >
                                    {subToggle.marketPlaceMode === 'ASeries' ? t('aseriesMarketplace') : t('aiMallMarketplace')}
                                    <sup className="text-sm md:text-3xl font-black ml-0.5 relative md:-top-8" style={{ color: '#000000 !important', opacity: 1 }}>TM</sup>
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="marketplace-title relative z-10 block text-transparent bg-clip-text bg-gradient-to-b from-gray-900 via-purple-900 to-gray-800 drop-shadow-[0_0_40px_rgba(139,92,246,0.3)]"
                                >
                                    {t('marketplaceHeading').split(' ').slice(2).join(' ')}
                                </motion.span>


                            </h1>

                            <motion.div
                                initial={{ opacity: 0, letterSpacing: "0.1em" }}
                                animate={{ opacity: 1, letterSpacing: "0.5em" }}
                                transition={{ delay: 0.8, duration: 1.5 }}
                                className="flex justify-start pt-4"
                            >
                                <p className="text-[10px] md:text-lg font-black uppercase tracking-[0.5em] text-black transition-all">
                                    {subToggle.marketPlaceMode === 'ASeries' ? t('aseriesSubheading') : t('marketplaceSubheading')}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* --- NAVIGATION SECTION --- */}
                <div className={`flex flex-col gap-6 mb-12 p-6 md:p-10 rounded-[60px] border transition-all duration-700 ${isDark ? 'bg-[#1a2235] border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.4)]' : 'bg-white border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)]'}`}>

                    {/* Top Row: Title & Search */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <h2 className={`text-2xl md:text-4xl font-black uppercase tracking-tight ${isDark ? 'text-[#E6E9F2]' : 'text-black'} whitespace-nowrap transition-colors`}>
                            {t('aiAgents')}
                        </h2>

                        <div className="relative group group w-full md:w-[480px]">
                            <div className={`relative ${isDark ? 'bg-[#131c31] border-white/10' : 'bg-gray-50 border-gray-100'} border rounded-full overflow-hidden flex items-center transition-all focus-within:ring-4 focus-within:ring-[#8B5CF6]/20 shadow-sm h-14`}>
                                <Search className={`ml-6 w-5 h-5 ${isDark ? 'text-[#6F76A8]' : 'text-gray-400'} group-focus-within:text-[#8B5CF6] transition-colors`} />
                                <input
                                    type="text"
                                    placeholder={t('searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full px-4 bg-transparent border-none outline-none font-bold text-xs md:text-sm uppercase tracking-wider ${isDark ? 'text-[#E6E9F2] placeholder-[#6F76A8]' : 'text-gray-900 placeholder-gray-400'} h-full transition-colors`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Filter Chips */}
                    <div className="flex overflow-x-auto justify-center gap-3 no-scrollbar pb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setFilter(cat.id)}
                                className={`px-4 py-1.5 rounded-xl text-[9px] md:text-[11px] font-black uppercase tracking-tight transition-all border whitespace-nowrap flex-shrink-0 ${filter === cat.id
                                    ? 'bg-[#8B5CF6] text-white border-transparent shadow-lg shadow-[#8B5CF6]/20 scale-105'
                                    : `${isDark ? 'bg-[#1a2235] text-[#C7CBEA] border-white/5 hover:bg-[#1e293b] hover:text-[#8B5CF6]' : 'bg-gray-50/50 text-gray-500 border-gray-100 hover:bg-white hover:text-[#9333EA] hover:shadow-md hover:border-purple-100'}`
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* --- AGENTS GRID (Staggered Scroll-Triggered Reveal) --- */}
                <motion.div
                    variants={containerVariants}
                    initial="visible"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-32"
                >
                    <AnimatePresence mode="popLayout">
                        {loading && agents.length === 0 ? (
                            [...Array(8)].map((_, i) => (
                                <SkeletonCard key={`skeleton-${i}`} isDark={isDark} />
                            ))
                        ) : (
                            filteredAgents.map((agent) => (
                                <ParallaxAgentCard
                                    key={agent._id}
                                    agent={agent}
                                    isDark={isDark}
                                    onOpenInfo={openAgentInfo}
                                    toggleBuy={toggleBuy}
                                />
                            ))
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Subtle Progress Bar for Loading (Optional) */}
                <AnimatePresence>
                    {loading && agents.length > 0 && (
                        <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed top-0 left-0 right-0 h-1 bg-[#8B5CF6] origin-left z-[400]"
                        />
                    )}
                </AnimatePresence>

                {/* Contact Vendor Modal */}
                <ContactVendorModal
                    isOpen={showContactModal}
                    onClose={() => { setShowContactModal(false); setContactAgent(null); }}
                    agent={contactAgent}
                    user={user}
                />
            </div>
        </div>
    );
};

export default Marketplace;
