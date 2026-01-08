import React from 'react';
import { Film, Play, Clock, Star, Sparkles, ChevronRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Series = () => {
    const seriesData = [
        {
            id: 1,
            title: "NEURAL FOUNDATIONS",
            description: "Master the fundamental cognitive architectures and autonomous reasoning protocols.",
            episodes: 12,
            duration: "6H 30M",
            rating: 4.8,
            thumbnail: "linear-gradient(135deg, #d946ef 0%, #8b5cf6 100%)"
        },
        {
            id: 2,
            title: "QUANTUM COGNITION",
            description: "Deep dive into multi-dimensional analysis and advanced predictive frameworks.",
            episodes: 15,
            duration: "8H 45M",
            rating: 4.9,
            thumbnail: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)"
        },
        {
            id: 3,
            title: "BIOSPHERE SYNERGY",
            description: "Implementing AI-MALL™ nodes within established corporate neural networks.",
            episodes: 10,
            duration: "5H 20M",
            rating: 4.7,
            thumbnail: "linear-gradient(135deg, #3b82f6 0%, #2dd4bf 100%)"
        }
    ];

    return (
        <div className="h-full overflow-y-auto no-scrollbar bg-transparent p-8 lg:p-12 relative overflow-hidden">
            {/* Background Aesthetic Section */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[30%] left-[-10%] w-[600px] h-[600px] bg-[#d946ef]/5 rounded-full blur-[140px] animate-blob" />
                <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-[#8b5cf6]/5 rounded-full blur-[120px] animate-blob animation-delay-3000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-7xl mx-auto space-y-20 pb-24 relative z-10"
            >
                {/* Header Section */}
                <header className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="px-5 py-2 bg-[#d946ef]/10 border border-[#d946ef]/20 rounded-full flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#d946ef] animate-pulse" />
                            <span className="text-[#d946ef] text-[10px] font-black tracking-[0.3em] uppercase">Visual Array Online</span>
                        </div>
                        <span className="text-gray-400 text-[10px] font-black tracking-[0.3em] uppercase opacity-60">Masterclass v3.4</span>
                    </div>
                    <div className="flex items-center gap-8 mb-6">
                        <div className="w-20 h-20 rounded-[32px] bg-white flex items-center justify-center shadow-2xl border border-white/80 shrink-0">
                            <Film className="w-10 h-10 text-[#8b5cf6]" strokeWidth={1.5} />
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-none">
                            AI-Mall <span className="text-[#d946ef]">A-Series.</span>
                        </h1>
                    </div>
                    <p className="text-gray-400 font-bold text-xl tracking-tight max-w-2xl opacity-70 leading-relaxed">
                        Discover curated high-fidelity cinematic series designed to upgrade your cognitive understanding of neural systems.
                    </p>
                </header>

                {/* Series Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {seriesData.map((series, idx) => (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -15 }}
                            key={series.id}
                            className="bg-white/40 backdrop-blur-3xl rounded-[56px] border border-white/60 overflow-hidden hover:shadow-[0_40px_80px_-20px_rgba(139,92,246,0.2)] transition-all duration-700 group cursor-pointer flex flex-col h-full border-b-4 border-b-white/50"
                        >
                            {/* Cinematic Thumbnail */}
                            <div
                                className="h-72 relative overflow-hidden m-4 rounded-[42px] shadow-2xl"
                                style={{ background: series.thumbnail }}
                            >
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-700"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 transition-all duration-500 shadow-2xl overflow-hidden">
                                        <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all" />
                                        <Play className="w-10 h-10 text-white ml-2 relative z-10" fill="white" />
                                    </div>
                                </div>

                                {/* Overlay Badge */}
                                <div className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                    <div className="px-5 py-2 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-[9px] font-black text-white uppercase tracking-[0.2em] shadow-xl">
                                        Neural Masterclass
                                    </div>
                                </div>
                            </div>

                            {/* Narrative Content */}
                            <div className="p-10 space-y-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-3xl font-black text-gray-900 tracking-tighter group-hover:text-[#8b5cf6] transition-colors leading-none uppercase">
                                            {series.title}
                                        </h3>
                                        <sup className="text-[10px] font-black text-[#8b5cf6] opacity-60">TM</sup>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full">
                                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                                        <span className="text-xs font-black text-amber-700 leading-none">{series.rating}</span>
                                    </div>
                                </div>

                                <p className="text-lg font-bold text-gray-400 leading-relaxed min-h-[54px] opacity-80 group-hover:opacity-100 transition-opacity">
                                    {series.description}
                                </p>

                                {/* System Meta Data */}
                                <div className="flex flex-wrap items-center gap-8 pt-6 mt-auto border-t border-white/40">
                                    <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-900 transition-colors">
                                        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                                            <Film className="w-4 h-4 text-[#8b5cf6]" />
                                        </div>
                                        <span>{series.episodes} Nodes</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-gray-900 transition-colors">
                                        <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                                            <Clock className="w-4 h-4 text-[#d946ef]" />
                                        </div>
                                        <span>{series.duration} Runtime</span>
                                    </div>
                                </div>

                                {/* Initialization Action */}
                                <button className="w-full mt-10 py-6 bg-gray-900 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-[#8b5cf6] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group/btn">
                                    Initialize Stream
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Incoming Data Array */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative group p-16 bg-white/40 backdrop-blur-3xl rounded-[64px] border border-white/60 text-center overflow-hidden shadow-2xl border-b-4 border-b-white/40"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8b5cf6] to-transparent opacity-20 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="relative mb-10 w-24 h-24 mx-auto">
                        <div className="absolute inset-0 bg-[#8b5cf6]/20 blur-3xl animate-pulse" />
                        <Sparkles className="w-20 h-20 text-[#8b5cf6] relative animate-pulse-glow" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-4 uppercase">Neural Queue Syncing</h2>
                    <p className="text-gray-500 font-bold text-xl max-w-3xl mx-auto leading-relaxed opacity-70">
                        Our intelligence architects are formalizing new cognitive series to upgrade your operational capabilities.
                        A-Series transmissions are pending synchronization.
                    </p>

                    <div className="mt-12 flex items-center justify-center gap-10 opacity-40">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: `${i * 0.3}s` }} />
                                <div className="h-[2px] w-12 bg-gray-200" />
                            </div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Series;
