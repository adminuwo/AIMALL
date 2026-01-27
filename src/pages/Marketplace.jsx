import React, { useEffect, useState } from 'react';
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

const Marketplace = () => {
    // --- MOCK DATA FOR PREVIEW (Ensures grid is never empty) ---
    // --- MOCK DATA FOR PREVIEW (Ensures grid is never empty) ---
    const MOCK_AGENTS = [
        {
            _id: 'mock-1',
            agentName: 'AIBOTT',
            category: 'Customer Support',
            description: 'Intelligent conversational agent for 24/7 client engagement and support automation.',
            avatar: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png',
            status: 'Live',
            reviewStatus: 'Approved',
            rating: 4.9,
            owner: 'mock-owner'
        },
        {
            _id: 'mock-2',
            agentName: 'AIBIZ',
            category: 'Business OS',
            description: 'Comprehensive business intelligence suite for data-driven decision making.',
            avatar: 'https://cdn-icons-png.flaticon.com/512/8649/8649607.png',
            status: 'Live',
            reviewStatus: 'Approved',
            rating: 4.8,
            owner: 'mock-owner'
        },
        {
            _id: 'mock-3',
            agentName: 'AIBASE',
            category: 'Data & Knowledge',
            description: 'Secure enterprise knowledge base with semantic search and retrieval capabilities.',
            avatar: 'https://cdn-icons-png.flaticon.com/512/9626/9626649.png',
            status: 'Live',
            reviewStatus: 'Approved',
            rating: 4.7,
            owner: 'mock-owner'
        }
    ];

    const [agents, setAgents] = useState(MOCK_AGENTS); // Default: Show Mocks immediately
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

                // Always merge MOCK with real agents to populate the grid visually
                // We prefer real agents, but keep mocks if list is short
                // if (apiAgents.length < 3) {
                //     // Filter out any mocks that might be duplicates if we re-fetch? IDK, just simple merge.
                //     // But we want mocks first? Or real first?
                //     // Let's put REAL agents first, then MOCKS.
                //     setAgents([...apiAgents, ...MOCK_AGENTS]);
                // } else {
                //     setAgents(apiAgents);
                // }
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
    }, [agentId, user?.id, user?._id, subToggle]);

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
    const filteredAgents = agents.filter(agent => {
        // Allow mock agents (which might not have these exact fields or status 'Live' is hardcoded)
        const isLive = !agent.status || agent.status === 'Live' || agent.status === 'active';
        const isApproved = agent.reviewStatus === 'Approved';

        // Always show mocks
        if (agent._id && agent._id.toString().startsWith('mock-')) return true;

        // Exclude A-Series Agents (Official)
        const aSeriesNames = [
            'AIBIZ', 'AIBASE', 'AICRAFT', 'AISA', 'AIBOTT',
            'AIGENE', 'AIBRAND', 'AISTREAM', 'AIOFFICE', 'AIDESK', 'AIFLOW'
        ];

        const name = (agent.agentName || agent.name || "").trim().toUpperCase();
        const isASeries = aSeriesNames.includes(name);

        const matchesCategory = filter === 'all' || agent.category === filter;
        const matchesSearch = (agent.agentName || agent.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (agent.description || "").toLowerCase().includes(searchQuery.toLowerCase());

        const isVisible = isLive && isApproved && !isASeries && matchesCategory && matchesSearch;

        // Debugging log for each agent
        if (!agent._id.toString().startsWith('mock-')) {
            console.log(`[Marketplace Debug] Agent: ${agent.agentName}, Live: ${isLive}, Approved: ${isApproved}, A-Series: ${isASeries}, Visible: ${isVisible}`);
        }

        return isVisible;
    });

    const categories = ['all', "Business OS", "Data & Intelligence", "Sales & Marketing", "HR & Finance", "Design & Creative", "Medical & Health AI"];
    // Exclude A-Series from Top Trending too
    const topUsedAgents = agents.filter(a => ![
        'AIBIZ', 'AIBASE', 'AICRAFT', 'AISA', 'AIBOTT',
        'AIGENE', 'AIBRAND', 'AISTREAM', 'AIOFFICE', 'AIDESK', 'AIFLOW'
    ].includes(a.agentName?.trim().toUpperCase())).slice(0, 3);

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
        <div className={`flex-1 overflow-y-auto w-full h-full transition-colors duration-700 ${isDark ? 'bg-[#0B0F1A]' : 'bg-[#FAFAFA]'} relative no-scrollbar`}>
            {/* --- GLOBAL BACKGROUND: Soft Pastel Gradients --- */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-700">
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#0B0F1A] via-[#12182B] to-[#0B0F1A]' : 'bg-gradient-to-br from-indigo-50/50 via-white to-fuchsia-50/30'} transition-all duration-700`}></div>
                {/* Floating Orbs */}
                <div className={`absolute top-[-10%] left-[-10%] w-[80vmax] h-[80vmax] ${isDark ? 'bg-purple-900/10' : 'bg-purple-200/20'} rounded-full blur-[100px] animate-pulse transition-colors duration-700`} />
                <div className={`absolute bottom-[-10%] right-[-10%] w-[60vmax] h-[60vmax] ${isDark ? 'bg-blue-900/10' : 'bg-blue-200/20'} rounded-full blur-[120px] transition-colors duration-700`} />
                <div className={`absolute top-[40%] left-[20%] w-[40vmax] h-[40vmax] ${isDark ? 'bg-pink-900/10' : 'bg-pink-200/10'} rounded-full blur-[90px] transition-colors duration-700`} />
            </div>

            <div className="relative z-10 p-4 md:p-10 lg:p-14 max-w-[1600px] mx-auto">

                <AnimatePresence>
                    {subToggle.subscripPgTgl && <SubscriptionForm id={agentId} />}

                    {/* Modals */}
                    {showDemo && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className={`${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white/70 border-white/80'} backdrop-blur-2xl rounded-[32px] md:rounded-[40px] p-6 md:p-8 w-full max-w-5xl shadow-2xl relative border mx-4`}
                            >
                                <button onClick={() => setShowDemo(false)} className={`absolute -top-4 -right-4 ${isDark ? 'bg-slate-800 text-white' : 'bg-white text-gray-800'} p-3 rounded-full shadow-lg hover:scale-110 transition-transform border ${isDark ? 'border-white/10' : 'border-gray-100'}`}><X className="w-5 h-5" /></button>
                                <div className="aspect-video w-full rounded-[32px] overflow-hidden bg-gray-950 border-4 border-white/40 shadow-inner">
                                    <iframe width="100%" height="100%" src={demoUrl} title="Agent Demo" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {showAgentInfo && selectedAgent && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                                className={`${isDark ? 'bg-slate-900 border-white/10' : 'bg-gray-100'} rounded-[32px] overflow-hidden w-full max-w-xl shadow-2xl relative flex flex-col`}
                            >
                                {/* Modal Header/Top Part */}
                                <div className={`${isDark ? 'bg-slate-900' : 'bg-[#e2e8f0]'} p-6 md:p-8 pb-6`}>
                                    <button
                                        onClick={() => setShowAgentInfo(false)}
                                        className={`absolute top-6 right-6 p-2 rounded-full ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'} transition-all`}
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
                                            <h2 className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tight`}>
                                                {selectedAgent.agentName}
                                            </h2>
                                            <div className="bg-[#ba79ff]/20 text-[#9333ea] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                                                {selectedAgent.category}
                                            </div>
                                            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'} font-semibold leading-relaxed text-center md:text-left`}>
                                                {selectedAgent.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {/* More in Category Section */}
                                <div className={`p-6 md:p-8 pt-8 flex-1 ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
                                    <h3 className={`text-[10px] font-black ${isDark ? 'text-white' : 'text-black'} uppercase tracking-[0.1em] mb-4`}>
                                        MORE IN {selectedAgent.category}
                                    </h3>
                                    <div className={`flex items-center justify-center h-20 ${isDark ? 'text-slate-600' : 'text-gray-400'} italic font-bold text-[13px]`}>
                                        No other apps in this category yet.
                                    </div>
                                </div>
                                {/* Modal Footer */}
                                <div className={`p-6 md:px-8 md:py-8 border-t ${isDark ? 'border-white/5 bg-slate-900' : 'border-gray-100 bg-white'} flex items-center justify-between gap-4`}>
                                    <button
                                        onClick={() => setShowAgentInfo(false)}
                                        className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-black'} transition-all`}
                                    >
                                        CANCEL
                                    </button>
                                    <button
                                        onClick={() => {
                                            toggleBuy(selectedAgent._id);
                                            setShowAgentInfo(false);
                                        }}
                                        className="flex-1 max-w-[280px] bg-[#9333ea] text-white py-3 px-8 rounded-[20px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-purple-500/20 hover:bg-purple-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <Zap size={14} fill="white" />
                                        SUBSCRIBE NOW
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* --- HERO SECTION --- 
                    Refined with floating motion, soft outer glow, and stronger, smoother gradients. 
                */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative w-full min-h-[250px] md:min-h-[360px] mb-12 rounded-[60px] overflow-hidden ${isDark ? 'bg-[#0B0F1A] border-white/5 shadow-2xl' : 'bg-white shadow-[0_20px_50px_-10px_rgba(100,50,255,0.1)]'} border transition-all duration-700 flex items-center group`}
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
                            className="w-full h-full object-cover opacity-90 transition-opacity duration-1000 group-hover:opacity-100"
                            style={{ objectPosition: '100% center' }}
                        >
                            <source src="/video/robotgirl.mp4" type="video/mp4" />
                        </video>
                        {/* Gradient Mask for seamless white integration */}
                        {/* Gradient Mask for seamless integration */}
                        <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-r from-[#0B0F1A] via-[#0B0F1A]/20 to-transparent' : 'bg-gradient-to-r from-white via-white/20 to-transparent'}`} />
                    </div>

                    <div className="relative z-10 flex flex-col items-start justify-center text-left px-8 md:px-20 py-8 w-full md:w-1/2">
                        {/* High Fidelity Typography per Reference */}
                        <div className="space-y-4 md:space-y-6">
                            <h1 className={`text-4xl md:text-[80px] font-black tracking-[-0.05em] leading-[0.85] ${isDark ? 'text-white' : 'text-black'} transition-all`}>
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="relative z-10 block"
                                >
                                    {t('marketplaceHeading').split(' ').slice(0, 2).join(' ')}
                                </motion.span>
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className={`relative z-10 block text-transparent bg-clip-text ${isDark ? 'bg-gradient-to-b from-white via-white/80 to-white/60' : 'bg-gradient-to-b from-gray-900 via-purple-900 to-gray-800'} drop-shadow-[0_0_40px_rgba(139,92,246,0.3)]`}
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
                                <p className={`text-xs md:text-xl font-black uppercase tracking-[0.5em] ${isDark ? 'text-white' : 'text-black'} transition-all`}>
                                    {t('marketplaceSubheading')}
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* --- NAVIGATION SECTION --- */}
                <div className={`flex flex-col gap-6 mb-12 p-6 md:p-10 rounded-[60px] border transition-all duration-700 ${isDark ? 'bg-[#161D35] border-[#8B5CF6]/10 shadow-[0_40px_100px_rgba(0,0,0,0.3)]' : 'bg-white border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.04)]'}`}>

                    {/* Top Row: Title & Search */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <h2 className={`text-2xl md:text-4xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-black'} whitespace-nowrap transition-colors`}>
                            {t('aiAgents')}
                        </h2>

                        <div className="relative group w-full md:w-[480px]">
                            <div className={`relative ${isDark ? 'bg-[#0B0F1A] border-[#8B5CF6]/10' : 'bg-gray-50 border-gray-100'} border rounded-full overflow-hidden flex items-center transition-all focus-within:ring-4 focus-within:ring-[#8B5CF6]/20 shadow-sm h-14`}>
                                <Search className={`ml-6 w-5 h-5 ${isDark ? 'text-[#6F76A8]' : 'text-gray-400'} group-focus-within:text-[#8B5CF6] transition-colors`} />
                                <input
                                    type="text"
                                    placeholder={t('searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full px-4 bg-transparent border-none outline-none font-bold text-xs md:text-sm uppercase tracking-wider ${isDark ? 'text-white placeholder-[#6F76A8]' : 'text-gray-900 placeholder-gray-400'} h-full transition-colors`}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Filter Chips */}
                    <div className="flex overflow-x-auto justify-center gap-3 no-scrollbar pb-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-1.5 rounded-xl text-[9px] md:text-[11px] font-black uppercase tracking-tight transition-all border whitespace-nowrap flex-shrink-0 ${filter === cat
                                    ? 'bg-[#8B5CF6] text-white border-transparent shadow-lg shadow-[#8B5CF6]/20 scale-105'
                                    : `${isDark ? 'bg-[#0B0F1A] text-white border-white/5 hover:bg-[#161D35] hover:text-[#8B5CF6]' : 'bg-gray-50/50 text-gray-500 border-gray-100 hover:bg-white hover:text-[#9333EA] hover:shadow-md hover:border-purple-100'}`
                                    }`}
                            >
                                {cat}
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
                        {filteredAgents.map((agent) => (
                            <ParallaxAgentCard
                                key={agent._id}
                                agent={agent}
                                isDark={isDark}
                                onOpenInfo={openAgentInfo}
                                toggleBuy={toggleBuy}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Loading State - Premium Spinner */}
                <AnimatePresence>
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[300] flex items-center justify-center bg-white/60 backdrop-blur-lg"
                        >
                            <div className="relative w-16 h-16">
                                <span className="absolute inset-0 rounded-full border-4 border-purple-100 opacity-50"></span>
                                <span className="absolute inset-0 rounded-full border-4 border-t-purple-600 animate-spin"></span>
                            </div>
                        </motion.div>
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
