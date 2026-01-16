import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Zap, Mail, GitBranch, Database, Calendar, Plus, Play, Pause, Sparkles, ChevronRight, Activity, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import { themeState } from '../userStore/userData';

const Automations = () => {
  const theme = useRecoilValue(themeState);
  const isDark = theme === 'Dark';
  const [automations, setAutomations] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await apiService.getAutomations();
      setAutomations(data);
    };
    loadData();
  }, []);

  const handleToggle = async (id) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
    await apiService.toggleAutomation(id);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'Email':
        return <Mail className="w-6 h-6 text-pink-500" />;
      case 'Dev':
        return <GitBranch className="w-6 h-6 text-[#8b5cf6]" />;
      case 'CRM':
        return <Database className="w-6 h-6 text-emerald-500" />;
      case 'Productivity':
        return <Calendar className="w-6 h-6 text-amber-500" />;
      default:
        return <Zap className="w-6 h-6 text-[#8b5cf6]" />;
    }
  };

  return (
    <div className={`p-8 lg:p-12 h-screen overflow-y-auto no-scrollbar bg-transparent relative transition-colors duration-700 ${isDark ? 'text-white' : 'text-slate-900'}`}>
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className={`absolute top-[10%] left-[20%] w-[600px] h-[600px] ${isDark ? 'bg-purple-900/10' : 'bg-[#8b5cf6]/5'} rounded-full blur-[140px] animate-blob`} />
        <div className={`absolute bottom-[20%] right-[10%] w-[500px] h-[500px] ${isDark ? 'bg-pink-900/10' : 'bg-[#d946ef]/5'} rounded-full blur-[120px] animate-blob animation-delay-4000`} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <header className="flex flex-col md:flex-row justify-between items-end md:items-center gap-10 mb-20 relative z-10 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className={`px-5 py-2 ${isDark ? 'bg-purple-900/20 border-purple-800/40' : 'bg-[#8b5cf6]/10 border-[#8b5cf6]/20'} rounded-full flex items-center gap-3 border`}>
                <div className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse" />
                <span className="text-[#8b5cf6] text-[10px] font-black tracking-[0.3em] uppercase">Matrix Active</span>
              </div>
              <span className={`text-[10px] font-black tracking-[0.3em] uppercase opacity-60 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Workflow Engine v2.1</span>
            </div>
            <h1 className={`text-5xl lg:text-7xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tighter leading-none mb-4 transition-colors`}>
              Neural <span className="text-[#8b5cf6]">Triggers.</span>
            </h1>
            <p className={`${isDark ? 'text-slate-400' : 'text-gray-400'} font-bold text-xl tracking-tight max-w-2xl opacity-70 transition-colors`}>
              Orchestrating autonomous background workflows and intelligent operational sequences.
            </p>
          </div>

          <button className={`px-12 py-6 ${isDark ? 'bg-slate-800 hover:bg-[#8b5cf6]' : 'bg-gray-900 hover:bg-[#8b5cf6]'} text-white rounded-[32px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 transition-all flex items-center gap-4 active:scale-95 group`}>
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" strokeWidth={3} />
            Initialize Logic Sequence
          </button>
        </header>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="popLayout">
            {automations.map((auto, idx) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={auto.id}
                className={`group relative p-10 rounded-[56px] border transition-all duration-700 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(139,92,246,0.15)] overflow-hidden flex flex-col h-full border-b-4 transition-colors ${auto.active
                  ? `${isDark ? 'bg-slate-900/60 border-white/10 border-b-white/20' : 'bg-white/60 border-white/80 border-b-white/50'} ring-8 ring-[#8b5cf6]/5`
                  : `${isDark ? 'bg-slate-800/20 border-white/5 border-b-white/10' : 'bg-white/20 border-white/40 border-b-white/20'} opacity-60 hover:opacity-100 grayscale hover:grayscale-0`
                  }`}
              >
                {/* Decorative Hover Blob */}
                <div className="absolute -top-32 -left-32 w-80 h-80 bg-[#8b5cf6]/5 rounded-full blur-[100px] group-hover:bg-[#8b5cf6]/10 transition-all duration-1000" />

                <div className="flex justify-between items-start mb-12 relative z-10">
                  <div className={`w-20 h-20 rounded-[32px] ${isDark ? 'bg-slate-800' : 'bg-white'} border ${isDark ? 'border-white/10' : 'border-gray-50'} flex items-center justify-center shadow-2xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-700 ${auto.active ? 'opacity-100' : 'opacity-80'}`}>
                    {getIcon(auto.type)}
                  </div>

                  <button
                    onClick={() => handleToggle(auto.id)}
                    className={`relative w-20 h-10 rounded-full p-2 transition-all duration-700 flex items-center shadow-inner ${auto.active ? 'bg-[#8b5cf6]' : (isDark ? 'bg-slate-700' : 'bg-gray-200')
                      }`}
                  >
                    <motion.div
                      layout
                      className={`w-6 h-6 rounded-[14px] bg-white shadow-lg ${auto.active ? 'ml-auto' : ''}`}
                    >
                      {auto.active ? <Activity className="w-3 h-3 text-[#8b5cf6] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" /> : <Terminal className={`w-3 h-3 ${isDark ? 'text-slate-500' : 'text-gray-300'} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-colors`} />}
                    </motion.div>
                  </button>
                </div>

                <div className="space-y-4 relative z-10 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tighter uppercase group-hover:text-[#8b5cf6] transition-colors`}>{auto.name}</h3>
                  </div>
                  <p className={`text-lg font-bold ${isDark ? 'text-slate-500' : 'text-gray-400'} leading-relaxed group-hover:text-gray-500 transition-colors line-clamp-3`}>{auto.description}</p>
                </div>

                <div className={`mt-12 pt-8 border-t ${isDark ? 'border-white/5' : 'border-white/40'} flex items-center justify-between relative z-10 transition-colors`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${auto.active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400 opacity-40'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${auto.active ? (isDark ? 'text-emerald-400' : 'text-emerald-700') : 'text-gray-400'}`}>
                      {auto.active ? 'Operational' : 'Hibernated'}
                    </span>
                  </div>

                  <div className={`flex items-center gap-3 ${isDark ? 'bg-slate-800' : 'bg-white'} px-4 py-2 rounded-2xl border ${isDark ? 'border-white/5' : 'border-gray-100'} shadow-sm group-hover:rotate-2 transition-transform`}>
                    <Sparkles size={14} className="text-[#8b5cf6] animate-pulse-glow" />
                    <span className={`text-[10px] font-black ${isDark ? 'text-slate-300' : 'text-gray-900'} uppercase tracking-widest transition-colors`}>{auto.type} Node</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Automations;
