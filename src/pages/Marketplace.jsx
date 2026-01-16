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
        <div className={`flex-1 overflow-y-auto w-full h-full ${isDark ? 'text-white' : 'text-slate-800'} relative no-scrollbar ${isDark ? 'bg-[#020617]' : 'bg-[#FAFAFA]'} transition-colors duration-700`}>
            {/* --- GLOBAL BACKGROUND: Soft Pastel Gradients --- */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-all duration-700">
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-slate-950 via-[#020617] to-slate-900' : 'bg-gradient-to-br from-indigo-50/50 via-white to-fuchsia-50/30'} transition-all duration-700`}></div>
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
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className={`${isDark ? 'bg-slate-900/95 border-white/10 text-white' : 'bg-white/90 border-white text-gray-900'} backdrop-blur-3xl rounded-[32px] md:rounded-[48px] p-6 md:p-10 w-full max-w-3xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] relative max-h-[90vh] overflow-y-auto no-scrollbar border mx-4`}
                            >
                                <button onClick={() => setShowAgentInfo(false)} className={`absolute top-6 right-6 p-3 rounded-full ${isDark ? 'bg-slate-800/80 hover:bg-slate-700 text-white border-white/10' : 'bg-white/50 hover:bg-white text-gray-800 border-white'} transition-all shadow-sm`}><X className="w-5 h-5" /></button>

                                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
                                    <div className={`w-32 h-32 rounded-[24px] ${isDark ? 'bg-slate-800 border-white/10' : 'bg-white border-white/60'} p-1.5 shadow-xl overflow-hidden flex-shrink-0 border`}>
                                        <img src={selectedAgent.avatar} alt={selectedAgent.agentName} className="w-full h-full object-cover rounded-[18px]" />
                                    </div>
                                    <div className="text-center md:text-left space-y-3 pt-2">
                                        <h2 className={`text-4xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tighter leading-none`}>{selectedAgent.agentName}</h2>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                            <span className={`${isDark ? 'bg-purple-900/30 text-purple-300 border-purple-800/30' : 'bg-purple-100/50 text-purple-700 border-purple-100'} px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border`}>Category: {selectedAgent.category}</span>
                                            <div className={`flex items-center gap-1.5 ${isDark ? 'bg-amber-900/30 border-amber-800/30' : 'bg-yellow-50 border-yellow-100'} px-3 py-1.5 rounded-full border`}>
                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                <span className={`text-xs font-bold ${isDark ? 'text-amber-200' : 'text-gray-800'}`}>4.9/5.0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className={`p-8 ${isDark ? 'bg-slate-800/60 border-white/5' : 'bg-white/60 border-white/80'} rounded-[32px] border shadow-sm relative overflow-hidden transition-colors`}>
                                        <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-3 uppercase tracking-tight`}><Sparkles className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />Capabilities</h3>
                                        <p className={`${isDark ? 'text-slate-300' : 'text-gray-600'} font-medium text-base leading-relaxed`}>{selectedAgent.description}</p>
                                    </div>

                                    <div className="p-8 bg-gray-900 rounded-[40px] text-white shadow-xl relative overflow-hidden border border-gray-800">
                                        <h3 className="text-2xl font-black mb-2 flex items-center gap-3 tracking-tighter">Support Uplink</h3>
                                        <p className="text-gray-400 text-sm mb-6">Direct channel to vendor engineering.</p>
                                        <div className="space-y-4">
                                            <input type="text" placeholder="Subject" value={helpForm.subject} onChange={(e) => setHelpForm({ ...helpForm, subject: e.target.value })} className="w-full bg-white/10 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:bg-white/20 transition-all text-sm font-bold" />
                                            <textarea placeholder="Message..." value={helpForm.message} onChange={(e) => setHelpForm({ ...helpForm, message: e.target.value })} rows="3" className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:bg-white/20 transition-all resize-none text-sm font-medium"></textarea>
                                            <button onClick={sendHelpQuery} disabled={!helpForm.subject || !helpForm.message} className="w-full py-4 bg-white text-black rounded-[20px] text-xs font-black uppercase tracking-widest hover:bg-purple-400 hover:text-white transition-all shadow-lg flex items-center justify-center gap-2">Send Inquiry <Send className="w-4 h-4 ml-1" /></button>
                                        </div>
                                    </div>
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
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    whileHover={{ y: -5 }} // Subtle interactive float
                    className={`relative w-full min-h-[250px] md:min-h-[380px] mb-16 rounded-[48px] overflow-hidden ${isDark ? 'bg-slate-900/60 border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]' : 'bg-white/30 backdrop-blur-3xl border-white/60 shadow-[0_20px_60px_-15px_rgba(100,50,255,0.1)]'} border group transition-all duration-700`}
                >
                    {/* Background Gradients & Flow */}
                    <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-slate-900/80 via-purple-900/5 to-slate-900/80' : 'bg-gradient-to-br from-white/80 via-purple-50/20 to-blue-50/10'} pointer-events-none transition-all duration-700`} />

                    {/* Animated Blobs */}
                    <motion.div
                        animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.15, 1], x: [0, 20, 0], y: [0, -20, 0] }}
                        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-[20%] -left-[10%] w-[550px] h-[550px] bg-purple-300/25 rounded-full blur-[130px] mix-blend-multiply"
                    />
                    <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1.1, 1, 1.1], x: [0, -30, 0] }}
                        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-[20%] -right-[10%] w-[650px] h-[650px] bg-blue-300/20 rounded-full blur-[130px] mix-blend-multiply"
                    />

                    <div className="relative z-10 flex flex-col md:flex-row h-full items-center px-6 md:px-20 py-6 md:py-12 gap-8 md:gap-10">
                        {/* Left Content */}
                        <div className="flex-1 space-y-6">
                            <h1 className={`text-3xl md:text-6xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tighter leading-[0.95] md:leading-[0.9] drop-shadow-sm transition-colors`}>
                                <span className="block">AI-MALL</span>
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 saturate-[1.2]">MARKETPLACE</span>
                            </h1>

                            <p className={`text-base md:text-lg ${isDark ? 'text-slate-400' : 'text-gray-600'} font-medium max-w-lg leading-relaxed transition-colors`}>
                                Deploy enterprise-grade autonomous agents directly into your workflow. The future of decentralized intelligence is here.
                            </p>

                            {/* <div className="flex items-center gap-4 pt-4">
                                <a
                                    href="/dashboard/series"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-10 py-4 bg-gray-900 text-white rounded-full font-bold text-xs tracking-widest uppercase hover:bg-black transition-all shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_40px_-10px_rgba(124,58,237,0.4)] hover:scale-105 active:scale-95 flex items-center gap-2 group/btn border border-gray-800"
                                >
                                    Explore A-Series <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-purple-300" />
                                </a>
                            </div> */}
                        </div>

                        {/* Right Content - Trending Vitals Card (Micro-animations) */}
                        <div className="hidden md:block w-[320px] relative h-[260px]">
                            <motion.div
                                animate={{ y: [0, -12, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className={`absolute right-0 top-0 w-full ${isDark ? 'bg-slate-800/80 border-white/10' : 'bg-white/70 border-white/60'} backdrop-blur-xl border p-6 rounded-[36px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)] transition-all duration-700`}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <motion.div
                                            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                                            transition={{ duration: 4, repeat: Infinity }}
                                            className={`p-2.5 ${isDark ? 'bg-purple-900/40 border-purple-800/40 text-purple-300' : 'bg-gradient-to-br from-purple-50 to-pink-50 text-purple-600 border-purple-100'} rounded-2xl border transition-colors`}
                                        >
                                            <Activity className="w-5 h-5" />
                                        </motion.div>
                                        <div>
                                            <h3 className={`text-xs font-black ${isDark ? 'text-white' : 'text-gray-900'} uppercase tracking-wider transition-colors`}>Top Trending</h3>
                                            <p className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-gray-500'} font-bold transition-colors`}>Real-time usage</p>
                                        </div>
                                    </div>
                                    {/* Pulse Dot */}
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-75 absolute right-8" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 relative" />
                                </div>

                                <div className="space-y-3">
                                    {topUsedAgents.map((agent, index) => (
                                        <div key={agent._id} className={`flex items-center gap-3 p-2 rounded-2xl ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-white/60'} transition-colors cursor-default border border-transparent ${isDark ? 'hover:border-white/5' : 'hover:border-white/50'}`}>
                                            <img src={agent.avatar} className={`w-8 h-8 rounded-lg object-cover shadow-sm ${isDark ? 'bg-slate-900' : 'bg-gray-50'}`} />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h4 className={`text-[10px] font-bold ${isDark ? 'text-slate-200' : 'text-gray-800'} leading-none transition-colors`}>{agent.agentName}</h4>
                                                    <span className={`text-[8px] font-black ${isDark ? 'text-slate-500' : 'text-gray-400'} transition-colors`}>{92 - index * 3}%</span>
                                                </div>
                                                <div className={`w-full h-1 ${isDark ? 'bg-slate-900' : 'bg-gray-100'} rounded-full overflow-hidden transition-colors`}>
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${92 - index * 5}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 1.2, delay: 0.1 * index, ease: "easeOut" }}
                                                        className={`h-full rounded-full ${index === 0 ? 'bg-gradient-to-r from-purple-500 to-indigo-500' :
                                                            index === 1 ? 'bg-gradient-to-r from-pink-500 to-rose-500' :
                                                                'bg-gradient-to-r from-blue-400 to-cyan-400'}`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* --- NAVIGATION SECTION --- */}
                <div className={`flex flex-col xl:flex-row items-center justify-between gap-6 mb-12 sticky top-4 z-40 ${isDark ? 'bg-slate-900/60 border-white/10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.4)]' : 'bg-white/25 backdrop-blur-xl border-white/50 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)]'} backdrop-blur-xl p-3 pr-4 pl-6 rounded-[30px] border transition-all duration-700 selection:bg-purple-200`}>
                    <div className="flex flex-col lg:flex-row items-center gap-6 w-full xl:w-auto">
                        <h2 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'} whitespace-nowrap transition-colors`}>
                            AI Agents
                        </h2>

                        <div className="relative group w-full lg:w-[420px]">
                            <div className={`relative ${isDark ? 'bg-slate-800/60 border-white/10' : 'bg-white/40 border-white/50'} backdrop-blur-md border rounded-full overflow-hidden flex items-center transition-all focus-within:ring-2 focus-within:ring-purple-200 focus-within:bg-white/80 h-12 shadow-inner`}>
                                <Search className={`ml-5 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-gray-400'} group-focus-within:text-purple-600 transition-colors`} />
                                <input
                                    type="text"
                                    placeholder="Search intelligence..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className={`w-full px-4 bg-transparent border-none outline-none font-semibold text-sm ${isDark ? 'text-white placeholder-slate-600' : 'text-gray-900 placeholder-gray-400'} h-full transition-colors`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex overflow-x-auto md:flex-wrap justify-start md:justify-center xl:justify-end gap-3 flex-1 w-full md:w-auto no-scrollbar pb-2 md:pb-0 px-2">
                        {categories.map((cat, i) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border whitespace-nowrap flex-shrink-0 ${filter === cat
                                    ? 'bg-purple-600 text-white border-transparent shadow-lg shadow-purple-200/50 scale-105'
                                    : `${isDark ? 'bg-slate-800 text-slate-400 border-white/10 hover:bg-slate-700 hover:text-white' : 'bg-white/40 text-gray-500 border-white/30 hover:bg-white hover:text-purple-600 hover:shadow-md'}`
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
                    className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 pb-32"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredAgents.map((agent, index) => (
                            <motion.div
                                key={agent._id}
                                layout
                                variants={cardVariants}
                                animate="visible"
                                whileHover="floating"
                                whileInView="floating"
                                viewport={{ once: false, amount: 0.3 }}
                                className={`group relative ${isDark ? 'bg-slate-900/60 border-white/10 shadow-[0_10px_30px_rgb(0,0,0,0.3)]' : 'bg-white/40 backdrop-blur-2xl border-white/50 shadow-[0_10px_30px_rgb(0,0,0,0.02)]'} rounded-[32px] md:rounded-[40px] p-4 md:p-6 border h-full overflow-hidden transition-all duration-300`}
                            >
                                {/* Gentle Lavender Tint on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-blue-50/0 opacity-0 group-hover:opacity-100 group-hover:from-purple-50/20 group-hover:to-blue-50/20 transition-all duration-500 pointer-events-none" />

                                <div className="relative z-10 flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-[18px] ${isDark ? 'bg-slate-800' : 'bg-white/90'} shadow-sm p-1 flex items-center justify-center border ${isDark ? 'border-white/10' : 'border-white/80'} group-hover:shadow-md transition-all`}>
                                        <img src={agent.avatar} className="w-full h-full object-cover rounded-[18px]" />
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-full ${isDark ? 'bg-slate-800/60 text-slate-400 border-white/5' : 'bg-white/60 text-gray-500 border-white/50'} border text-[8px] font-black uppercase tracking-widest backdrop-blur-sm transition-colors`}>
                                        {agent.category}
                                    </div>
                                </div>

                                <div className="flex-1 relative z-10 space-y-3 mb-8">
                                    <h3 className={`text-lg md:text-xl font-black ${isDark ? 'text-white group-hover:text-purple-400' : 'text-gray-900 group-hover:text-purple-900'} tracking-tight leading-none transition-colors`}>
                                        {agent.agentName}
                                    </h3>
                                    <p className={`text-[12px] ${isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-500 group-hover:text-gray-600'} font-medium leading-relaxed line-clamp-3 transition-colors`}>
                                        {agent.description}
                                    </p>
                                </div>

                                <div className={`relative z-10 flex items-center gap-3 pt-6 border-t ${isDark ? 'border-white/5' : 'border-purple-50/50'} mt-auto transition-colors`}>
                                    <button
                                        onClick={() => toggleBuy(agent._id)}
                                        disabled={userAgent.some((ag) => ag && agent._id == ag._id)}
                                        className={`flex-1 py-3 px-4 rounded-full font-bold text-[9px] uppercase tracking-widest transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 ${userAgent.some((ag) => ag && agent._id == ag._id)
                                            ? `${isDark ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/30' : 'bg-emerald-50 text-emerald-700 border-emerald-100'} cursor-default opacity-90`
                                            : 'bg-purple-600 text-white hover:bg-purple-700 border border-transparent hover:shadow-[0_10px_20px_-5px_rgba(124,58,237,0.3)]'
                                            }`}
                                    >
                                        {userAgent.some((ag) => ag && agent._id == ag._id) ? <><ShieldCheck className="w-3 h-3" /> Deployed</> : 'Install'}
                                    </button>
                                    <button
                                        onClick={() => openAgentInfo(agent)}
                                        className={`p-3 rounded-full ${isDark ? 'bg-slate-800 border-white/10 text-slate-400 hover:text-purple-400 hover:bg-slate-700' : 'bg-white border-gray-200 text-gray-400 hover:text-purple-600 hover:border-purple-200 hover:bg-purple-50'} transition-all shadow-sm hover:shadow-md`}
                                    >
                                        <Info className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </motion.div>
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
