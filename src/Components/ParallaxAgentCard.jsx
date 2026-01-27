import React, { useRef, useEffect } from 'react';
import { Info, Zap } from 'lucide-react';

const ParallaxAgentCard = ({ agent, isDark, onOpenInfo, toggleBuy }) => {
    const wrapperRef = useRef(null);
    const cardRef = useRef(null);
    const avatarRef = useRef(null);
    const contentRef = useRef(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        const card = cardRef.current;
        const avatar = avatarRef.current;
        const content = contentRef.current;

        if (!wrapper || !card || window.innerWidth < 768) return;

        const handleMouseMove = (e) => {
            const rect = wrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (centerY - y) / 15; // Max 15 degree
            const rotateY = (x - centerX) / 15;

            // Apply card rotation
            card.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

            // Parallax image movement (deeper depth)
            if (avatar) {
                const moveX = (x - centerX) / 8;
                const moveY = (y - centerY) / 8;
                avatar.style.transform = `translate3d(${moveX}px, ${moveY}px, 60px) rotateX(${-rotateX * 0.5}deg) rotateY(${-rotateY * 0.5}deg)`;
            }

            // Parallax content movement (medium depth)
            if (content) {
                const moveX = (x - centerX) / 12;
                const moveY = (y - centerY) / 12;
                content.style.transform = `translate3d(${moveX}px, ${moveY}px, 30px)`;
            }
        };

        const handleMouseLeave = () => {
            // Reset with smooth transition
            card.style.transform = `rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            if (avatar) avatar.style.transform = `translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg)`;
            if (content) {
                content.style.transform = `translate3d(0, 0, 0)`;
                // Keep some visible or fade out based on design preference
                // content.style.opacity = '0.7'; 
            }
        };

        wrapper.addEventListener('mousemove', handleMouseMove);
        wrapper.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            wrapper.removeEventListener('mousemove', handleMouseMove);
            wrapper.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [window.innerWidth]);

    return (
        <div
            ref={wrapperRef}
            className="perspective-1000 w-full h-full cursor-pointer"
            style={{ perspective: '1200px' }}
        >
            <div
                ref={cardRef}
                style={{
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.5s cubic-bezier(0.03, 0.98, 0.52, 0.99)',
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    WebkitFontSmoothing: 'antialiased',
                    textRendering: 'optimizeLegibility'
                }}
                className={`group relative h-[340px] w-full ${isDark ? 'bg-[#161D35] border-[#8B5CF6]/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)]' : 'bg-white border-gray-100 shadow-2xl'} rounded-[32px] border overflow-hidden flex flex-col transition-all duration-500 hover:scale-[1.02]`}
            >
                {/* Top Section - Parallax Icon Layer (50% Height) */}
                <div className={`relative h-[48%] w-full overflow-hidden ${isDark ? 'bg-[#0B0F1A]/50' : 'bg-gray-50/50'}`}>
                    <div
                        ref={avatarRef}
                        style={{
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.5s cubic-bezier(0.03, 0.98, 0.52, 0.99)',
                            willChange: 'transform',
                            backfaceVisibility: 'hidden',
                            position: 'absolute',
                            inset: '-15%',
                            zIndex: 0
                        }}
                    >
                        <img
                            src={agent.avatar}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                        {/* Subtle Reflection on top layer only */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    </div>
                    {/* Inner Border Frame (Top Section Only) */}
                    <div className={`absolute inset-4 border ${isDark ? 'border-[#8B5CF6]/20' : 'border-white/40'} rounded-[20px] pointer-events-none z-10`} />
                </div>

                {/* Bottom Section - Static Solid Background (52% Height) */}
                <div
                    className={`relative z-20 flex-1 w-full ${isDark ? 'bg-[#161D35]' : 'bg-white'} border-t ${isDark ? 'border-[#8B5CF6]/10' : 'border-gray-50'} flex flex-col items-center justify-center`}
                    style={{ transform: 'translateZ(1px)' }}
                >
                    <div
                        ref={contentRef}
                        style={{
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.5s cubic-bezier(0.03, 0.98, 0.52, 0.99)',
                            willChange: 'transform',
                            backfaceVisibility: 'hidden',
                            transform: 'translateZ(30px)'
                        }}
                        className="w-full px-5 py-3 text-center space-y-2"
                    >
                        <h3
                            style={{
                                transform: 'translateZ(20px)',
                                backfaceVisibility: 'hidden'
                            }}
                            className={`text-[15px] font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tighter uppercase transition-all text-sharp`}
                        >
                            {agent.agentName}
                        </h3>

                        {/* Description - Revealed on Hover */}
                        <p
                            style={{
                                transform: 'translateZ(10px)',
                                backfaceVisibility: 'hidden'
                            }}
                            className={`text-[9px] ${isDark ? 'text-white' : 'text-gray-500'} font-bold leading-tight line-clamp-2 transition-all px-2 opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto overflow-hidden transform translate-y-2 group-hover:translate-y-0 duration-300 text-sharp`}
                        >
                            {agent.description}
                        </p>

                        {/* Actions */}
                        <div
                            style={{ transform: 'translateZ(15px)' }}
                            className="flex items-center gap-2 pt-0.5 justify-center"
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); onOpenInfo(agent); }}
                                className="bg-[#8B5CF6] text-white py-1.5 px-5 rounded-xl font-black text-[8px] uppercase tracking-widest shadow-lg hover:shadow-[#8B5CF6]/20 active:scale-95 transition-all"
                            >
                                VIEW INFO
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onOpenInfo(agent); }}
                                className={`p-1.5 rounded-xl ${isDark ? 'bg-[#0B0F1A] border-[#8B5CF6]/10 text-[#6F76A8]' : 'bg-white border-gray-100 text-gray-400 shadow-md'} border hover:text-[#8B5CF6] transition-all`}
                            >
                                <Info size={12} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Global Highlight Refraction */}
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[32px] pointer-events-none z-50" />
            </div>
        </div>
    );
};

export default ParallaxAgentCard;
