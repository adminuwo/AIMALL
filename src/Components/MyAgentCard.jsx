import React, { useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Trash2, Zap, Play, MessageCircle, FileText } from 'lucide-react';

const MyAgentCard = ({ agent, isDark, onDelete, onUse, onContact, onDocs }) => {
    const cardRef = useRef(null);

    // Motion values for dynamic tilt
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Smooth springs for rotation
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Normalize mouse positions to -0.5 to 0.5 range
        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div
            ref={cardRef}
            style={{ perspective: '1200px' }}
            className="w-full h-full"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                layout
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d'
                }}
                whileHover={{
                    translateZ: 50,
                    translateY: -8,
                    scale: 1.03,
                }}
                transition={{
                    duration: 0.5,
                    ease: [0.23, 1, 0.32, 1] // Custom ease-out
                }}
                className={`relative group h-[380px] w-full ${isDark
                    ? 'bg-[#161D35] border-[#8B5CF6]/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)]'
                    : 'bg-white/40 border-white/80 shadow-[0_15px_35px_-15px_rgba(0,0,0,0.05)]'
                    } backdrop-blur-3xl border rounded-[32px] p-6 hover:shadow-[0_45px_100px_-25px_rgba(139,92,246,0.35)] hover:border-[#8B5CF6]/30 transition-shadow duration-500 flex flex-col overflow-hidden`}
            >
                {/* Decorative Elements */}
                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-b from-white/5 to-transparent' : 'bg-gradient-to-b from-white/20 to-transparent'} pointer-events-none`} />
                <div className={`absolute -top-24 -right-24 w-48 h-48 ${isDark ? 'bg-[#8B5CF6]/5' : 'bg-[#8b5cf6]/10'} rounded-full blur-[80px] group-hover:bg-[#8B5CF6]/20 transition-all duration-700`} />

                {/* Header Section */}
                <div className="flex justify-between items-start mb-6 relative z-10" style={{ transform: 'translateZ(25px)' }}>
                    <motion.div
                        className={`w-14 h-14 ${isDark ? 'bg-[#0B0F1A]' : 'bg-white'} rounded-[20px] p-0.5 flex items-center justify-center shadow-xl border ${isDark ? 'border-white/5' : 'border-white'} overflow-hidden relative`}
                        whileHover={{ height: 72, scale: 1.08 }}
                        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-gray-50 to-white opacity-50" />
                        <motion.img
                            src={agent.avatar || `https://ui-avatars.com/api/?name=${agent.agentName}&background=8b5cf6&color=fff`}
                            className="w-full h-full object-cover rounded-[16px] relative z-10"
                            alt={agent.agentName}
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.4 }}
                        />
                    </motion.div>

                    {/* Delete Action Overlay */}
                    <button
                        className="w-10 h-10 rounded-xl bg-red-50/10 hover:bg-red-500 text-red-500 hover:text-white backdrop-blur-md border border-red-500/20 hover:border-red-500 transition-all duration-400 flex items-center justify-center group/delete shadow-lg hover:shadow-red-500/20 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0"
                        onClick={(e) => onDelete(agent._id, e)}
                        style={{ transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)' }}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* Content Section */}
                <div className="flex-1 relative z-10 space-y-4" style={{ transform: 'translateZ(35px)' }}>
                    <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'} tracking-tight uppercase leading-none group-hover:text-[#8B5CF6] transition-colors duration-400`}>
                        {agent.agentName}
                    </h3>

                    <div className="flex items-center gap-2 text-[9px] font-black text-[#8B5CF6] uppercase tracking-[0.2em] opacity-80" style={{ transform: 'translateZ(15px)' }}>
                        <Zap size={9} fill="currentColor" />
                        {agent.category || 'Business OS'}
                    </div>

                    <p className={`text-[12px] ${isDark ? 'text-white' : 'text-gray-500'} font-bold leading-relaxed mb-8 h-20 line-clamp-3 opacity-60 group-hover:opacity-100 transition-opacity duration-500`} style={{ transform: 'translateZ(20px)' }}>
                        {agent.description}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className={`flex items-center justify-between mt-8 relative z-10 gap-4 pt-6 border-t ${isDark ? 'border-white/5' : 'border-white/60'}`} style={{ transform: 'translateZ(30px)' }}>
                    <motion.button
                        whileHover={{ translateY: -4, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        onClick={() => {
                            if (agent.url && agent.url.trim() !== "") {
                                window.open(agent.url, '_blank');
                            }
                        }}
                        className="flex-[2.5] py-3.5 bg-[#8B5CF6] text-white rounded-[24px] font-black text-[9px] shadow-[0_10px_30px_-10px_rgba(139,92,246,0.5)] hover:shadow-[0_15px_40px_-10px_rgba(139,92,246,0.6)] transition-all duration-400 flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
                    >
                        <Play size={14} fill="currentColor" />
                        USE
                    </motion.button>

                    <motion.button
                        whileHover={{ translateY: -4, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        onClick={() => onContact(agent)}
                        className={`w-12 h-12 rounded-[18px] ${isDark ? 'bg-[#0B0F1A]' : 'bg-white/60'} backdrop-blur-md border ${isDark ? 'border-[#8B5CF6]/10' : 'border-white'} text-gray-400 hover:text-[#8B5CF6] hover:bg-white/5 transition-all duration-300 flex items-center justify-center group/chat relative`}
                    >
                        <MessageCircle size={18} />
                        <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#d946ef] rounded-full border border-white shadow-sm" />
                    </motion.button>

                    <motion.button
                        whileHover={{ translateY: -4, scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        onClick={() => onDocs()}
                        className={`w-12 h-12 rounded-[18px] ${isDark ? 'bg-[#0B0F1A]' : 'bg-white/60'} backdrop-blur-md border ${isDark ? 'border-[#8B5CF6]/10' : 'border-white'} text-gray-400 hover:text-[#8B5CF6] hover:bg-white/5 transition-all duration-300 flex items-center justify-center group/doc`}
                    >
                        <FileText size={18} />
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default MyAgentCard;
