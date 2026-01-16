import React from 'react';
import { Star, Play, CheckCircle } from 'lucide-react';

const AgentCard = ({ agent }) => {
    const handleAction = (e) => {
        if (agent.affiliateLink) {
            window.open(agent.affiliateLink, '_blank');
        }
    };

    // Color mapping for the dreamy glows
    const glowColors = {
        'DESIGN & CREATIVE': 'bg-fuchsia-400/20',
        'BUSINESS OS': 'bg-blue-400/20',
        'DATA & INTELLIGENCE': 'bg-cyan-400/20',
        'SALES & MARKETING': 'bg-purple-400/20',
        'default': 'bg-indigo-400/20'
    };

    const currentGlow = glowColors[agent.category] || glowColors.default;

    return (
        <div
            onClick={handleAction}
            className="bg-white/40 backdrop-blur-2xl border border-white/60 rounded-[40px] p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_30px_60px_-15px_rgba(139,92,246,0.15)] hover:-translate-y-2 transition-all duration-700 group relative overflow-hidden flex flex-col h-full cursor-pointer"
        >
            {/* Background Dreamy Glow */}
            <div className={`absolute -top-20 -left-20 w-64 h-64 ${currentGlow} rounded-full blur-[80px] group-hover:blur-[60px] transition-all duration-1000 opacity-60 group-hover:opacity-80 animate-blob`}></div>

            {/* Top Info */}
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <agent.icon className="text-[#8b5cf6]" size={32} strokeWidth={1.5} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-full backdrop-blur-sm">
                    <Star size={12} className="text-yellow-600 fill-yellow-600" />
                    <span className="text-[10px] font-black text-yellow-700">{agent.rating}</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 relative z-10">
                <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase leading-none">{agent.name}</h3>
                </div>
                <p className="text-[10px] font-black text-[#8b5cf6] uppercase tracking-[0.2em] mb-4 opacity-80">{agent.category}</p>
                <p className="text-[15px] text-gray-500 font-medium leading-relaxed mb-8">
                    {agent.description}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-auto relative z-10">
                <button
                    onClick={(e) => { e.stopPropagation(); handleAction(); }}
                    className="flex items-center gap-2 text-[#3b82f6] font-black text-sm hover:gap-3 transition-all group/btn"
                >
                    <Play size={16} className="fill-[#3b82f6] group-hover/btn:scale-110 transition-transform" /> Preview
                </button>
                <button
                    onClick={handleAction}
                    className="px-8 py-3.5 bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] hover:from-[#c026d3] hover:to-[#7c3aed] text-white rounded-2xl font-black text-[13px] shadow-[0_10px_25px_-5px_rgba(168,85,247,0.4)] hover:shadow-[0_15px_30px_-5px_rgba(168,85,247,0.5)] transition-all duration-300 flex items-center gap-2"
                >
                    <CheckCircle size={16} strokeWidth={2.5} /> Install Agent
                </button>
            </div>

            {/* Subtle Inner Glow on Hover */}
            <div className="absolute inset-0 ring-1 ring-inset ring-white/40 group-hover:ring-[#8b5cf6]/20 transition-all duration-700 rounded-[40px]"></div>
        </div>
    );
};

export default AgentCard;
