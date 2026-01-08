import React from 'react';
import { X, ExternalLink, Activity, Terminal, Shield, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AgentModal = ({ isOpen, onClose, agent }) => {
    if (!isOpen || !agent) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
                    className="bg-white/40 backdrop-blur-3xl w-full max-w-6xl h-[85vh] rounded-[48px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] flex flex-col overflow-hidden border border-white/60 relative"
                >
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#8b5cf6]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

                    {/* Header */}
                    <div className="flex items-center justify-between px-8 py-6 border-b border-white/40 bg-white/20 relative z-20">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-[24px] bg-white shadow-lg border border-white/60 flex items-center justify-center p-1 relative overflow-hidden group">
                                <img
                                    src={agent.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.id || agent.agentName}`}
                                    alt={agent.name}
                                    className="w-full h-full rounded-[20px] object-cover"
                                    onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.id || agent.agentName}` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#8b5cf6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-2xl font-black text-gray-900 tracking-tight uppercase leading-none">
                                        {agent.agentName || agent.name}
                                    </h3>
                                    <span className="px-2 py-0.5 rounded-md bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 text-[9px] font-black text-[#8b5cf6] uppercase tracking-widest">
                                        Live
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
                                    <span className="flex items-center gap-1.5"><Terminal size={12} /> Neural Protocol v4.2</span>
                                    <span className="w-1 h-1 rounded-full bg-gray-300" />
                                    <span className="flex items-center gap-1.5"><Shield size={12} /> Encrypted Stream</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <a
                                href={agent.url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-3 bg-gray-900 text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#8b5cf6] transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 group"
                                title="Maximize Interface"
                            >
                                External Link <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 flex items-center justify-center rounded-[20px] bg-white/60 border border-white text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm group"
                            >
                                <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* Content (Iframe) */}
                    <div className="flex-1 bg-white/40 relative backdrop-blur-sm">
                        <div className="absolute inset-0 flex items-center justify-center -z-10">
                            <div className="flex flex-col items-center gap-4 animate-pulse opacity-50">
                                <Activity className="w-10 h-10 text-[#8b5cf6]" />
                                <span className="text-xs font-black text-[#8b5cf6] uppercase tracking-[0.3em]">Establishing Secure Uplink...</span>
                            </div>
                        </div>
                        <iframe
                            src={agent.url}
                            title={agent.name}
                            className="w-full h-full border-0 relative z-10"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    {/* Footer Status Bar */}
                    <div className="px-8 py-3 bg-white/80 border-t border-white/60 flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Signal Stable</span>
                        <span className="flex items-center gap-2">Latency: 12ms <Cpu size={12} /></span>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AgentModal;
