import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import {
  MessageSquare, Cpu, Clock, Zap, TrendingUp, Users, ArrowUpRight, IndianRupee,
  Search, Bell, Plus, LayoutGrid, Calendar, Activity, ChevronRight, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await apiService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-12 h-12 rounded-2xl bg-[#8b5cf6]/20 flex items-center justify-center animate-spin">
        <div className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
      </div>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 md:p-8 lg:p-12 h-screen overflow-y-auto no-scrollbar bg-transparent relative"
    >
      {/* Top Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div className="animate-in fade-in slide-in-from-bottom duration-700">
          <p className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-[0.3em] mb-3 opacity-80">Command Hub V2.1</p>
          <h1 className="text-4xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-none mb-4">
            Welcome, <span className="text-[#8b5cf6]">Explorer.</span>
          </h1>
          <p className="text-gray-500 font-medium text-base tracking-tight max-w-xl">Your intelligent neural workspace is operational. All advanced systems are at peak performance.</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative group hidden lg:block">
            <input
              type="text"
              placeholder="Search intelligence..."
              className="bg-white/40 border border-white/60 backdrop-blur-md rounded-[20px] px-8 py-5 pl-16 w-96 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-[#8b5cf6]/10 transition-all placeholder:text-gray-400 shadow-glass"
            />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#8b5cf6] transition-colors" />
          </div>

          <button className="p-5 bg-white/40 backdrop-blur-md border border-white/60 rounded-[22px] text-gray-400 hover:text-[#8b5cf6] hover:bg-white transition-all shadow-glass relative group">
            <Bell className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span className="absolute top-4 right-4 w-3 h-3 bg-gradient-to-br from-[#d946ef] to-[#8b5cf6] rounded-full border-2 border-white animate-pulse-glow" />
          </button>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {[
          { label: 'Total Chats', value: stats.totalChats, icon: MessageSquare, trend: '+12%', color: 'from-[#d946ef] to-[#8b5cf6]' },
          { label: 'Neural Power', value: stats.activeAgents, icon: Zap, trend: 'Optimal', color: 'from-[#8b5cf6] to-blue-500' },
          { label: 'Efficiency', value: stats.savedTime, icon: Clock, trend: '88% Logic', color: 'from-blue-400 to-indigo-600' },
          { label: 'Wallet Balance', value: '₹0.00', icon: IndianRupee, trend: 'Active', color: 'from-gray-700 to-black' }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ y: -8 }}
            className="bg-white/40 backdrop-blur-3xl rounded-[40px] p-8 group border border-white/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(139,92,246,0.15)] transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-8">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:rotate-12 transition-transform duration-500`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black px-4 py-1.5 bg-white/60 border border-white/60 rounded-full text-[#8b5cf6] uppercase tracking-widest">{item.trend}</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-2">{item.label}</p>
              <h3 className="text-4xl font-black text-gray-900 tracking-tighter leading-none">{item.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pb-12">
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-12">
          {/* Activity Stream Visual */}
          <div className="bg-white/40 backdrop-blur-3xl rounded-[56px] p-12 h-[500px] relative overflow-hidden group border border-white/60 shadow-[0_30px_60px_-15px_rgba(139,92,246,0.05)]">
            {/* Decorative Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#8b5cf6]/10 rounded-full blur-[80px]"></div>

            <div className="flex items-center justify-between mb-12 relative z-10">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase flex items-center gap-3">
                <Activity className="text-[#8b5cf6]" /> Activity Stream
              </h3>
              <div className="flex gap-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-[#8b5cf6] shadow-lg shadow-[#8b5cf6]/40 animate-pulse-glow" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Inference Engine</span>
                </div>
              </div>
            </div>

            <div className="absolute inset-x-12 bottom-12 top-32 overflow-hidden pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="purpleGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, ease: "easeInOut" }}
                  d="M0,250 C150,220 250,80 350,120 C450,160 550,240 650,180 C750,120 850,150 1000,100"
                  fill="none" stroke="#8b5cf6" strokeWidth="6" strokeLinecap="round" opacity="0.6"
                />
                <path d="M0,250 C150,220 250,80 350,120 C450,160 550,240 650,180 C750,120 850,150 1000,100 L1000,300 L0,300 Z" fill="url(#purpleGlow)" />
              </svg>
            </div>

            <div className="absolute bottom-12 left-12 right-12 flex justify-between gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                <div key={i} className="flex flex-col items-center gap-3 flex-1">
                  <div className="w-1 bg-gray-100/50 rounded-full h-16 overflow-hidden relative">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${20 + Math.random() * 80}%` }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', delay: i * 0.1 }}
                      className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#8b5cf6] to-[#d946ef]"
                    />
                  </div>
                  <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest opacity-60">T{i}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transmissions */}
          <div className="bg-white/40 backdrop-blur-3xl rounded-[56px] p-12 border border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Recent Sessions</h3>
              <button className="text-[10px] font-black text-[#8b5cf6] hover:bg-[#8b5cf6] hover:text-white uppercase tracking-widest p-3 px-6 bg-white border border-white/60 rounded-full transition-all">Export Trace Logs</button>
            </div>

            <div className="space-y-6">
              {[
                { name: 'Marketing Analysis Engine', time: '2 mins ago', icon: Activity, type: 'Inference' },
                { name: 'Research Paper Processor', time: '45 mins ago', icon: LayoutGrid, type: 'Knowledge' },
                { name: 'Code Architecture Debug', time: '2 hours ago', icon: Cpu, type: 'Development' }
              ].map((session, i) => (
                <div key={i} className="flex items-center justify-between p-8 bg-white/40 border border-white/80 rounded-[40px] hover:bg-white hover:shadow-glass hover:translate-x-3 transition-all duration-500 cursor-pointer group">
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center text-[#8b5cf6] shadow-sm border border-gray-100 group-hover:rotate-6 transition-transform ring-4 ring-[#8b5cf6]/5">
                      <session.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-black text-gray-900 text-lg tracking-tight mb-1">{session.name}</p>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{session.time} • <span className="text-[#8b5cf6] opacity-80">{session.type}</span></p>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#8b5cf6]/10 group-hover:text-[#8b5cf6] transition-all">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Action Node (Right Sidebar) */}
        <motion.div variants={itemVariants} className="space-y-12">
          <div className="bg-white/40 backdrop-blur-3xl rounded-[56px] p-12 border border-white/60 flex flex-col items-center text-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative group">
            {/* Pulsing Aura */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 rounded-[56px] pointer-events-none"></div>

            <div className="w-28 h-28 rounded-[40px] bg-gradient-to-br from-[#d946ef] to-[#8b5cf6] p-1.5 shadow-2xl mb-10 group relative animate-pulse-glow">
              <div className="w-full h-full rounded-[35px] bg-white flex items-center justify-center text-[#8b5cf6] font-black text-4xl shadow-inner">
                {stats?.activeAgents || '0'}
              </div>
            </div>

            <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none mb-3 font-black">Neural Hub</h3>
            <p className="text-[13px] font-medium text-gray-500 leading-relaxed max-w-[220px] mb-12">Orchestrate and calibrate your fleet of intelligent neural agents.</p>

            <div className="grid grid-cols-2 gap-5 w-full">
              {[
                { label: 'Uptime', val: '99.9%' },
                { label: 'Latency', val: '42ms' }
              ].map((s, i) => (
                <div key={i} className="bg-white/60 backdrop-blur-md p-6 rounded-[28px] border border-white/80 shadow-sm">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5 opacity-70">{s.label}</p>
                  <p className="text-xl font-black text-gray-900 tracking-tighter">{s.val}</p>
                </div>
              ))}
            </div>

            <button className="w-full py-6 mt-12 bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] hover:from-[#c026d3] hover:to-[#7c3aed] text-white rounded-[28px] font-black text-[14px] uppercase tracking-widest shadow-[0_15px_30px_-5px_rgba(168,85,247,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(168,85,247,0.5)] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-3">
              <Plus size={20} strokeWidth={3} /> Deploy Agent
            </button>
          </div>

          <div className="bg-white/40 backdrop-blur-3xl rounded-[56px] p-12 border border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
            <h3 className="text-xl font-black text-gray-900 tracking-tight mb-10 uppercase flex items-center gap-3">
              <Sparkles size={18} className="text-[#8b5cf6]" /> System Protocols
            </h3>
            <div className="space-y-5">
              {[
                { label: 'Quantum Firewall', status: 'Secure', color: 'bg-emerald-500' },
                { label: 'Neural Link Sync', status: 'Optimal', color: 'bg-[#8b5cf6]' },
                { label: 'Cloud Gateway', status: 'Stable', color: 'bg-blue-400' }
              ].map((p, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-white/40 border border-white/60 rounded-[30px] transition-all hover:bg-white/60">
                  <span className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em]">{p.label}</span>
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${p.color} animate-pulse shadow-lg`} />
                    <span className="text-[10px] font-black text-gray-900 uppercase tracking-tighter">{p.status}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full py-5 mt-10 bg-white/40 hover:bg-white text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-gray-900 rounded-[28px] border border-white/80 transition-all shadow-sm">
              Launch Diagnostic Array
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardOverview;
