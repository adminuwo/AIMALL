import React, { useRef, useEffect } from 'react';
import { X, Play, Shield, Zap, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../userStore/userData';

const LiveDemoModal = ({ demo, onClose, onSubscribe }) => {
    const theme = useRecoilValue(themeState);
    const isDark = theme === 'Dark';
    if (!demo) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    onClick={onClose}
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className={`relative w-full max-w-6xl ${isDark ? 'bg-[#161D35] border-[#8B5CF6]/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)]' : 'bg-[#0f172a] border-white/10'} rounded-[40px] border shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]`}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className={`absolute top-4 right-4 z-50 p-2 ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-white/10 hover:bg-white/20 text-white'} rounded-full transition-colors`}
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Video Section (Left/Top) */}
                    <div className="w-full md:w-2/3 bg-black relative flex items-center justify-center group">
                        {/* Video Player Placeholder or Actual Video */}
                        {demo.videoUrl ? (
                            <video
                                src={demo.videoUrl}
                                poster={demo.thumbnail}
                                controls
                                autoPlay
                                className="w-full h-full object-contain max-h-[60vh] md:max-h-full"
                            />
                        ) : (
                            <div className="text-center p-10">
                                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                                    <Play className="w-8 h-8 text-white/40" />
                                </div>
                                <p className="text-gray-400 font-medium">Demo video unavailable</p>
                            </div>
                        )}
                    </div>

                    {/* Info Section (Right/Bottom) */}
                    <div className={`w-full md:w-1/3 p-8 md:p-10 flex flex-col overflow-y-auto ${isDark ? 'bg-[#0B0F1A]' : 'bg-gradient-to-br from-[#1e293b] to-[#0f172a]'}`}>
                        <div className="mb-8">
                            <span className={`inline-block px-3 py-1 rounded-lg ${isDark ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/20 text-[#8B5CF6]' : 'bg-[#8b5cf6]/10 border-[#8b5cf6]/20 text-[#8b5cf6]'} text-[10px] font-black uppercase tracking-widest mb-4`}>
                                {demo.category}
                            </span>
                            <h2 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-white'} tracking-tight mb-4 leading-none`}>
                                {demo.agentName}
                            </h2>
                            <p className={`${isDark ? 'text-white' : 'text-slate-400'} text-sm font-medium leading-relaxed opacity-80`}>
                                {demo.description}
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-4 mb-8 flex-1">
                            <h3 className={`text-xs font-black ${isDark ? 'text-[#AAB0D6]' : 'text-slate-500'} uppercase tracking-widest mb-4 flex items-center gap-2`}>
                                <Sparkles className="w-3 h-3" /> Core Capabilities
                            </h3>
                            {demo.features?.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-3 group">
                                    <div className={`w-5 h-5 rounded-full ${isDark ? 'bg-emerald-500/10 text-emerald-500 group-hover:bg-[#8B5CF6]' : 'bg-emerald-500/10 text-emerald-500 mt-0.5 group-hover:bg-emerald-500 group-hover:text-white'} flex items-center justify-center transition-colors`}>
                                        <Zap className="w-3 h-3" />
                                    </div>
                                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-300'}`}>{feature}</p>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className={`mt-auto pt-8 border-t ${isDark ? 'border-white/5' : 'border-white/5'}`}>
                            <button
                                onClick={() => {
                                    onClose();
                                    onSubscribe(demo._id);
                                }}
                                className={`w-full py-4 ${isDark ? 'bg-[#8B5CF6] text-white hover:bg-[#7c3aed]' : 'bg-white text-black hover:bg-[#8b5cf6] hover:text-white'} rounded-[24px] font-black text-sm uppercase tracking-widest transition-all shadow-lg hover:shadow-purple-500/25 active:scale-95`}
                            >
                                Get Access Now
                            </button>
                            <p className={`text-center mt-4 text-[10px] ${isDark ? 'text-[#AAB0D6]' : 'text-slate-600'} font-bold uppercase tracking-widest`}>
                                <Shield className="w-3 h-3 inline mr-1" />
                                Enterprise Grade Security
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LiveDemoModal;
