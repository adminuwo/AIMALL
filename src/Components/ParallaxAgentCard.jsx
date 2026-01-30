import React from 'react';
import { Eye, Zap, Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ParallaxAgentCard = ({ agent, isDark, onOpenInfo, toggleBuy }) => {
    const { t } = useLanguage();

    return (
        <div className="w-full h-full">
            <div
                className={`relative h-[340px] w-full ${isDark ? 'bg-[#12182B] border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_20px_50px_rgba(139,92,246,0.2)]' : 'bg-white border-white shadow-[0_20px_40px_-10px_rgba(139,92,246,0.15)] hover:shadow-[0_30px_60px_-10px_rgba(139,92,246,0.35)]'} rounded-[48px] border overflow-hidden flex flex-col transition-all duration-300 ease-out cursor-pointer transform hover:-translate-y-2 hover:scale-[1.04] group`}
            >
                {/* Background Layer: Radial Glow & Watermark Icon */}
                <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none">
                    {/* Subtle Radial Gradient */}
                    <div className={`absolute w-full h-full rounded-full blur-[100px] ${isDark ? 'bg-purple-900/10' : 'bg-[#F3E8FF]/30'} transform scale-150`}></div>

                    {/* Watermark Icon */}
                    <img
                        src={agent.avatar}
                        alt=""
                        className={`w-[180px] h-[180px] object-contain ${isDark ? 'opacity-[0.04]' : 'opacity-[0.06]'} blur-[2px] transform scale-150 transition-all duration-700 group-hover:scale-[1.7] group-hover:opacity-[0.08]`}
                    />
                </div>

                {/* Content Layer */}
                <div className="relative z-10 h-full w-full flex flex-col items-center justify-between p-8 pt-12 pb-10">
                    {/* Title & Description Section */}
                    <div className="flex flex-col items-center space-y-4 w-full text-center">
                        <div className="w-24 h-24 transition-transform duration-500 group-hover:scale-110 flex items-center justify-center pointer-events-none drop-shadow-xl">
                            <img
                                src={agent.avatar}
                                alt={agent.agentName}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <div className="space-y-1">
                            {(() => {
                                if (isDark) {
                                    return (
                                        <>
                                            <h3 className="text-[19px] font-bold text-white tracking-tight uppercase leading-tight agent-name-text">
                                                {t(agent.agentName)}
                                            </h3>
                                            <p className="text-[11px] text-white/90 font-semibold truncate max-w-[220px] agent-desc-text">
                                                {t(agent.description)}
                                            </p>
                                        </>
                                    );
                                }

                                // Light Mode Fallback
                                return (
                                    <>
                                        <h3 className={`text-[19px] font-black text-gray-900 tracking-tight uppercase leading-tight`}>
                                            {t(agent.agentName)}
                                        </h3>
                                        <p className={`text-[11px] text-gray-500 font-semibold truncate max-w-[220px] opacity-80`}>
                                            {t(agent.description)}
                                        </p>
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center gap-3 w-full justify-center px-4">
                        <button
                            onClick={(e) => { e.stopPropagation(); onOpenInfo(agent); }}
                            className={`p-3 rounded-full ${isDark ? 'bg-[#1e293b] text-[#8B5CF6] border-white/5 hover:bg-[#2d3748]' : 'bg-purple-50 text-purple-600 border-purple-100/50'} border transition-all duration-300 hover:scale-110 shadow-sm active:scale-95`}
                            title="View Info"
                        >
                            <Eye size={18} />
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (agent.url && agent.url.trim() !== "") {
                                    window.open(agent.url, '_blank');
                                } else {
                                    toggleBuy(agent._id);
                                }
                            }}
                            className={`bg-[#8B5CF6] hover:bg-[#7C3AED] text-white py-3 px-8 rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-lg ${isDark ? 'shadow-purple-900/20' : 'shadow-purple-200/50'} flex items-center gap-2 transition-all duration-300 hover:shadow-xl hover:translate-x-1 active:scale-95`}
                        >
                            <Play size={15} fill="white" />
                            {t('use')}
                        </button>
                    </div>
                </div>

                {/* Global Edge Highlight (Dark Mode only) */}
                {isDark && (
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[48px] pointer-events-none z-50" />
                )}
            </div>
        </div>
    );
};

export default ParallaxAgentCard;
