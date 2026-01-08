import React, { useEffect, useState } from 'react';
import { Search, Download, Check, Star, FileText, Play, X, Info, Send, Terminal, Palette, Briefcase, Scale, Code2, Sparkles, Activity, ShieldCheck, Zap, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { apis, AppRoute } from '../types';
import { getUserData, toggleState } from '../userStore/userData';
import SubscriptionForm from '../Components/SubscriptionForm/SubscriptionForm';
import { useRecoilState } from 'recoil';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import NotificationBar from '../Components/NotificationBar/NotificationBar';

const Marketplace = () => {
  const [agents, setAgents] = useState([]);
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
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      if (agents.length === 0) {
        setLoading(true);
      }
      const userId = user?.id || user?._id;

      try {
        // Always fetch all agents
        const agentsRes = await axios.get(apis.agents);
        if (agentsRes.data) {
          setAgents(Array.isArray(agentsRes.data) ? agentsRes.data : []);
        } else {
          setAgents([]);
        }

        // Only fetch user agents if user is logged in
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

  const sendHelpQuery = () => {
    if (!selectedAgent) return;
    const vendorEmail = selectedAgent.vendorEmail || 'support@ai-mall.in';
    const subject = encodeURIComponent(`Query about ${selectedAgent.agentName} - ${helpForm.subject}`);
    const body = encodeURIComponent(`Agent: ${selectedAgent.agentName}\nCategory: ${selectedAgent.category}\n\nSubject: ${helpForm.subject}\n\nMessage:\n${helpForm.message}`);
    window.location.href = `mailto:${vendorEmail}?subject=${subject}&body=${body}`;
  };

  const filteredAgents = agents.filter(agent => {
    const isLive = !agent.status || agent.status === 'Live' || agent.status === 'active';
    const isApproved = agent.reviewStatus === 'Approved';
    if (!isLive || !isApproved) return false;

    const isSeriesMode = subToggle.marketPlaceMode === 'ASeries';
    const isSystemAgent = (agent.agentName || "").includes("TM") ||
      (agent.agentName || "").includes("™") ||
      !agent.vendorEmail ||
      (agent.vendorEmail || "").includes("ai-mall") ||
      (agent.vendorEmail || "").includes("support");

    if (isSeriesMode) {
      if (!isSystemAgent) return false;
    } else {
      if (isSystemAgent) return false;
    }

    const matchesCategory = filter === 'all' || agent.category === filter;
    const matchesSearch = (agent.agentName || agent.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (agent.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = ['all', "Business OS", "Data & Intelligence", "Sales & Marketing", "HR & Finance", "Design & Creative", "Medical & Health AI"];

  const topUsedAgents = agents.slice(0, 3);

  return (
    <div className="flex-1 overflow-y-scroll p-8 lg:p-12 bg-transparent relative">
      <AnimatePresence>
        {subToggle.subscripPgTgl && <SubscriptionForm id={agentId} />}
        {showDemo && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-white/40 backdrop-blur-3xl rounded-[64px] p-10 w-full max-w-5xl shadow-[0_60px_120px_-30px_rgba(0,0,0,0.2)] relative border border-white/60"
            >
              <button onClick={() => setShowDemo(false)} className="absolute -top-4 -right-4 bg-white p-5 rounded-full shadow-2xl hover:scale-110 transition-transform text-gray-900 border border-gray-100"><X className="w-6 h-6" /></button>
              <div className="aspect-video w-full rounded-[48px] overflow-hidden bg-gray-900 border-8 border-white/20 shadow-inner">
                <iframe width="100%" height="100%" src={demoUrl} title="Agent Demo" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
              <div className="mt-10 flex flex-col md:flex-row justify-between items-center px-4 gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse" />
                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Visual Nexus Preview</h3>
                  </div>
                  <p className="text-gray-500 font-bold text-lg">Synthesizing live agent operational interface.</p>
                </div>
                <button onClick={() => setShowDemo(false)} className="px-12 py-5 bg-gray-900 text-white rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-[#8b5cf6] transition-all shadow-xl hover:scale-105 active:scale-95">Initialize Access</button>
              </div>
            </motion.div>
          </div>
        )}
        {showAgentInfo && selectedAgent && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-white/40 backdrop-blur-3xl rounded-[64px] p-12 w-full max-w-3xl shadow-[0_60px_120px_-30px_rgba(0,0,0,0.2)] relative max-h-[90vh] overflow-y-auto no-scrollbar border border-white/60"
            >
              <button onClick={() => setShowAgentInfo(false)} className="absolute top-8 right-8 p-4 rounded-full bg-white/60 hover:bg-white text-gray-900 transition-all border border-white shadow-sm"><X className="w-6 h-6" /></button>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-12">
                <div className="w-40 h-40 rounded-[48px] bg-white p-2 shadow-2xl overflow-hidden flex-shrink-0 border border-white/60">
                  <img src={selectedAgent.avatar} alt={selectedAgent.agentName} className="w-full h-full object-cover rounded-[40px]" />
                </div>
                <div className="text-center md:text-left space-y-4 pt-2">
                  <h2 className="text-5xl font-black text-gray-900 tracking-tighter leading-none">{selectedAgent.agentName} {((selectedAgent.agentName || "").includes("TM") || !selectedAgent.vendorEmail || (selectedAgent.vendorEmail || "").includes("ai-mall")) && <sup className="text-2xl text-[#8b5cf6]">™</sup>}</h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <span className="bg-[#8b5cf6]/10 text-[#8b5cf6] px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-[#8b5cf6]/20">PROTOCOL: {selectedAgent.category}</span>
                    <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-2xl border border-white/80 shadow-sm">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-black text-gray-900 tracking-tighter">4.9 RANK</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <div className="p-10 bg-white/40 rounded-[48px] border border-white/60 shadow-inner relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/5 rounded-full blur-3xl" />
                  <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-4 uppercase tracking-tight"><Sparkles className="w-6 h-6 text-[#8b5cf6]" />Core Intelligence Profile</h3>
                  <p className="text-gray-600 font-bold text-lg leading-relaxed">{selectedAgent.description}</p>
                </div>

                <div className="p-10 bg-gray-900 rounded-[56px] text-white shadow-2xl relative overflow-hidden group border border-gray-800">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#8b5cf6]/20 rounded-full blur-[100px] -mr-40 -mt-40 transition-all duration-1000 group-hover:bg-[#d946ef]/20" />
                  <div className="relative z-10">
                    <h3 className="text-3xl font-black mb-3 flex items-center gap-4 uppercase tracking-tighter">Vendor Neural Link</h3>
                    <p className="text-gray-400 font-bold text-lg mb-10 max-w-md">Secure direct transmission line to the official solution architects.</p>
                    <div className="space-y-6">
                      <div className="relative">
                        <Terminal className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input type="text" placeholder="Protocol Subject" value={helpForm.subject} onChange={(e) => setHelpForm({ ...helpForm, subject: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-8 py-5 text-white placeholder-gray-600 focus:outline-none focus:border-[#8b5cf6]/50 transition-all font-bold text-sm tracking-tight" />
                      </div>
                      <textarea placeholder="Specify operational details or deployment queries..." value={helpForm.message} onChange={(e) => setHelpForm({ ...helpForm, message: e.target.value })} rows="4" className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-white placeholder-gray-600 focus:outline-none focus:border-[#8b5cf6]/50 transition-all resize-none font-bold text-sm tracking-tight"></textarea>
                      <button onClick={sendHelpQuery} disabled={!helpForm.subject || !helpForm.message} className="w-full py-6 bg-white text-gray-900 rounded-[28px] text-xs font-black uppercase tracking-[0.3em] disabled:opacity-30 hover:bg-[#8b5cf6] hover:text-white transition-all shadow-xl flex items-center justify-center gap-4 active:scale-95 group/btn">
                        <Send className="w-5 h-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        Initialize Inquiry
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Featured Banner - Cinematic High Fidelity */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative w-full h-[450px] mb-16 rounded-[64px] overflow-hidden bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] group border border-white/80"
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-[#38bdf8]/10 rounded-full blur-[120px] animate-blob" />
          <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-[#d946ef]/10 rounded-full blur-[140px] animate-blob animation-delay-2000" />
          <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-[#8b5cf6]/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/40 to-transparent z-10" />

        <div className="absolute inset-0 z-20 flex flex-col justify-center px-20 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="px-5 py-2 bg-gray-900 rounded-full flex items-center gap-3 shadow-2xl">
              <div className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
              <span className="text-white text-[10px] font-black tracking-[0.4em] uppercase">Fleet Status: Optimal</span>
            </div>
            <span className="text-gray-400 text-[10px] font-black tracking-[0.3em] uppercase opacity-60">Nexus v4.2</span>
          </motion.div>

          <h2 className="text-7xl font-black text-gray-900 mb-6 leading-none tracking-tighter">AI-MALL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d946ef] to-[#8b5cf6]">A-SERIES.</span></h2>
          <p className="text-2xl text-gray-500 font-bold mb-12 max-w-md leading-relaxed">The pinnacle of intelligent autonomous agent systems, built for global production scale.</p>

          <div className="flex items-center gap-10">
            <button
              onClick={() => setSubToggle({ ...subToggle, marketPlaceMode: 'ASeries' })}
              className="px-14 py-6 bg-gray-900 text-white font-black rounded-[32px] shadow-2xl transition-all hover:bg-[#8b5cf6] hover:scale-105 active:scale-95 uppercase text-xs tracking-[0.3em] flex items-center gap-4 group/exp"
            >
              Initialize A-Series
              <ChevronRight className="w-5 h-5 group-hover/exp:translate-x-1 transition-transform" />
            </button>
            <div className="flex flex-col">
              <span className="text-gray-900 font-black text-lg">4,200+ Node Deployment</span>
              <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">Active Neural Link Sessions</span>
            </div>
          </div>
        </div>

        <div className="absolute right-0 top-0 h-full w-2/5 flex items-center justify-center pr-20 lg:flex hidden z-30">
          <motion.div
            initial={{ opacity: 0, rotate: 5, x: 50 }}
            animate={{ opacity: 1, rotate: -2, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[48px] p-10 shadow-[0_60px_100px_-20px_rgba(0,0,0,0.1)] relative"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-[#8b5cf6]" />
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.3em]">Trending Vitals</h3>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-200" />)}
              </div>
            </div>
            <div className="space-y-8">
              {topUsedAgents.map((agent, index) => (
                <div key={agent._id} className="flex items-center gap-6 group/item cursor-pointer">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-white p-1 flex items-center justify-center shadow-lg group-hover/item:scale-110 transition-all duration-500 border border-gray-50">
                      <img src={agent.avatar} className="w-full h-full object-cover rounded-xl" />
                    </div>
                    <div className="absolute -top-2 -left-2 w-7 h-7 rounded-[10px] bg-gray-900 text-white text-[10px] font-black flex items-center justify-center border-4 border-white shadow-lg">{index + 1}</div>
                  </div>
                  <div className="flex-1 min-w-[180px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-base font-black text-gray-900 tracking-tight">{agent.agentName}</span>
                      <span className="text-[10px] font-black text-[#8b5cf6]">{98 - index * 5}% SYNC</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100/50 rounded-full overflow-hidden shadow-inner">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${95 - index * 10}%` }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="h-full bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] rounded-full"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Interface Toggle & Search */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-10 mb-16 relative z-10">
        <div>
          <div className="flex items-center gap-12 mb-6">
            <button onClick={() => setSubToggle({ ...subToggle, marketPlaceMode: 'AIMall' })} className={`text-5xl font-black tracking-tighter transition-all relative pb-2 ${subToggle.marketPlaceMode !== 'ASeries' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
              Neural Marketplace
              {subToggle.marketPlaceMode !== 'ASeries' && <motion.div layoutId="tabMarker" className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#8b5cf6] rounded-full shadow-[0_5px_15px_rgba(139,92,246,0.3)]" />}
            </button>
            <button onClick={() => setSubToggle({ ...subToggle, marketPlaceMode: 'ASeries' })} className={`text-5xl font-black tracking-tighter transition-all relative pb-2 ${subToggle.marketPlaceMode === 'ASeries' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}>
              System Agents
              {subToggle.marketPlaceMode === 'ASeries' && <motion.div layoutId="tabMarker" className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#8b5cf6] rounded-full shadow-[0_5px_15px_rgba(139,92,246,0.3)]" />}
            </button>
          </div>
          <p className="text-gray-400 font-bold text-xl tracking-tight max-w-xl opacity-70">Synthesize and deploy high-performance intelligence nodes directly into your terminal environment.</p>
        </div>
        <div className="relative w-full md:w-[450px] group">
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-full opacity-30 group-focus-within:opacity-100 transition-opacity blur-sm" />
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#8b5cf6] transition-colors" size={22} />
          <input type="text" placeholder="Search operational agents..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-16 pr-8 py-6 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[32px] shadow-sm focus:outline-none text-base font-bold text-gray-900 placeholder-gray-400 transition-all border-b-2" />
        </div>
      </div>

      {/* Category Pills - High Fidelity */}
      <div className="flex flex-wrap gap-4 mb-16 relative z-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border ${filter === cat
              ? 'bg-gray-900 border-gray-900 text-white shadow-2xl scale-105'
              : 'bg-white/40 border-white text-gray-500 hover:border-[#8b5cf6]/40 hover:text-[#8b5cf6] hover:bg-white shadow-sm'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dynamic Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredAgents.map((agent, index) => (
            <motion.div
              key={agent._id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -15 }}
              className="bg-white/40 backdrop-blur-3xl border border-white/80 rounded-[56px] p-10 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(139,92,246,0.15)] transition-all duration-700 group relative overflow-hidden flex flex-col h-full border-b-4 border-b-white/50"
            >
              <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#8b5cf6]/5 rounded-full blur-[100px] group-hover:bg-[#8b5cf6]/10 transition-all duration-1000" />

              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="w-20 h-20 bg-white rounded-3xl p-1.5 flex items-center justify-center shadow-2xl border border-gray-50 group-hover:scale-110 transition-all duration-700">
                  <img src={agent.avatar} className="w-full h-full object-cover rounded-[20px]" />
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-full">
                  <Star size={14} className="text-amber-500 fill-amber-500 shadow-sm" />
                  <span className="text-[11px] font-black text-amber-700 tracking-tighter">4.9 RANK</span>
                </div>
              </div>

              <div className="flex-1 relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase leading-none">{agent.agentName}</h3>
                  {((agent.agentName || "").includes("TM") || !agent.vendorEmail || (agent.vendorEmail || "").includes("ai-mall")) && (
                    <span className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-tighter border border-[#8b5cf6]/20 px-1.5 rounded-md">TM</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black text-[#8b5cf6] uppercase tracking-[0.3em] opacity-80">
                  <Activity size={10} />
                  {agent.category}
                </div>
                <p className="text-lg text-gray-500 font-bold leading-relaxed mb-10 h-24 line-clamp-3 opacity-70 group-hover:opacity-100 transition-opacity">{agent.description}</p>
              </div>

              <div className="flex items-center justify-between mt-10 relative z-10 gap-6 pt-6 border-t border-white/40">
                <button
                  onClick={() => { setDemoUrl(agent.demoVideoUrl || "https://www.youtube.com/embed/dQw4w9wgXcQ"); setShowDemo(true); }}
                  className="flex items-center gap-3 text-gray-900 font-black text-[10px] uppercase tracking-[0.2em] hover:text-[#8b5cf6] transition-all group/btn"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100 group-hover/btn:bg-[#8b5cf6] group-hover/btn:text-white transition-all">
                    <Play size={14} className="fill-current" />
                  </div>
                  Visual Log
                </button>
                <button
                  onClick={() => toggleBuy(agent._id)}
                  disabled={userAgent.some((ag) => ag && agent._id == ag._id)}
                  className={`px-10 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-3 relative overflow-hidden group/install ${userAgent.some((ag) => ag && agent._id == ag._id)
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-not-allowed'
                    : 'bg-gray-900 text-white shadow-2xl hover:bg-[#8b5cf6] hover:scale-105 active:scale-95'
                    }`}
                >
                  {userAgent.some((ag) => ag && agent._id == ag._id) ? (
                    <><ShieldCheck className="w-4 h-4" /> Deployed</>
                  ) : (
                    <><Zap className="w-4 h-4" /> Provision Node</>
                  )}
                </button>
              </div>

              <button
                onClick={() => openAgentInfo(agent)}
                className="absolute top-6 right-16 opacity-0 group-hover:opacity-100 transition-all p-3 text-gray-400 hover:text-[#8b5cf6] hover:rotate-12"
              >
                <Info size={22} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-3xl z-[300] flex flex-col items-center justify-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-[6px] border-[#8b5cf6]/10 border-t-[#8b5cf6] animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#8b5cf6] animate-pulse" />
            </div>
          </div>
          <p className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-[0.5em] animate-pulse">Syncing Marketplace...</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
