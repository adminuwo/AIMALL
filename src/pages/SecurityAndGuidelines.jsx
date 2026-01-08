import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, FileText, Scale, Eye, AlertTriangle, ChevronRight, Sparkles, Phone, Mail } from 'lucide-react';
import ReportModal from '../Components/ReportModal/ReportModal';

const SecurityAndGuidelines = () => {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const sections = [
        {
            id: 1,
            title: "Data Privacy & Protection",
            icon: <Lock className="w-6 h-6 text-[#8b5cf6]" />,
            content: (
                <div className="space-y-6">
                    <p className="text-gray-500 font-medium">AI-Mall™ is committed to safeguarding user data in accordance with global protocols, including GDPR and CCPA.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="p-6 bg-white/40 border border-white/80 rounded-[32px] hover:bg-white transition-all">
                            <h4 className="font-black text-gray-900 text-sm uppercase tracking-wider mb-2">1.1 Data Collection</h4>
                            <p className="text-xs text-gray-400 leading-relaxed font-bold">Usage metadata, device identifiers, and neural link permissions are collected solely for operational efficiency.</p>
                        </div>
                        <div className="p-6 bg-white/40 border border-white/80 rounded-[32px] hover:bg-white transition-all">
                            <h4 className="font-black text-gray-900 text-sm uppercase tracking-wider mb-2">1.2 Data Sharing</h4>
                            <p className="text-xs text-gray-400 leading-relaxed font-bold">AI-Mall™ never auctions personal data to third-party entities. All exchanges are strictly for core system functionality.</p>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            title: "Acceptable Neural Conduct",
            icon: <Shield className="w-6 h-6 text-[#8b5cf6]" />,
            content: (
                <div className="space-y-4">
                    <p className="text-gray-500 font-medium">Users agree to maintain environmental stability by avoiding:</p>
                    <div className="grid grid-cols-1 gap-3">
                        {[
                            "Reverse engineering system architectures",
                            "Attempting to bypass security perimeters",
                            "Injecting malicious or high-entropy logic",
                            "Unauthorized data extraction via automated nodes"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-white/60 border border-white/80 rounded-[24px]">
                                <div className="w-2 h-2 rounded-full bg-[#8b5cf6] shadow-[0_0_10px_rgba(139,92,246,0.3)]" />
                                <span className="text-xs font-black text-gray-900 uppercase tracking-widest">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: 3,
            title: "AI Response Disclaimer",
            icon: <Scale className="w-6 h-6 text-[#8b5cf6]" />,
            content: (
                <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-[40px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <AlertTriangle size={80} className="text-amber-600" />
                    </div>
                    <p className="text-amber-800 font-bold text-sm leading-relaxed mb-4 relative z-10 italic">
                        "Neural outputs are provided as-is. Decisions made based on AI transmissions are the sole responsibility of the operator."
                    </p>
                    <p className="text-xs text-amber-700 font-medium opacity-80 relative z-10">
                        Operators are encouraged to verify critical data through secondary diagnostic arrays.
                    </p>
                </div>
            )
        }
    ];

    return (
        <div className="h-full flex flex-col bg-transparent overflow-y-auto no-scrollbar relative p-8 lg:p-12">
            <div className="max-w-5xl mx-auto w-full space-y-12 pb-24">

                {/* Premium Header */}
                <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-[#d946ef]/10 to-[#8b5cf6]/10 rounded-[64px] blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                    <div className="relative bg-white/40 backdrop-blur-3xl border border-white/60 p-12 lg:p-16 rounded-[56px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#8b5cf6]/5 to-transparent rounded-full -mr-32 -mt-32 blur-3xl"></div>

                        <div className="relative z-10 text-center md:text-left">
                            <span className="px-5 py-2 bg-[#8b5cf6]/10 text-[#8b5cf6] rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 inline-block border border-[#8b5cf6]/20">
                                Global Protocols v2.1
                            </span>
                            <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter mb-6 leading-none">Security & <span className="text-[#8b5cf6]">Guidelines.</span></h1>
                            <p className="text-lg lg:text-xl text-gray-500 font-medium max-w-2xl leading-relaxed">
                                Establishing the framework for lawful use, data protection, and operational security within the AI-Mall™ biosphere.
                            </p>

                            <div className="flex flex-wrap gap-4 mt-10">
                                <div className="flex items-center gap-3 bg-white/60 px-6 py-3 rounded-2xl border border-white/80 shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[11px] font-black text-gray-900 uppercase tracking-widest">Shield Active</span>
                                </div>
                                <div className="flex items-center gap-3 bg-white/60 px-6 py-3 rounded-2xl border border-white/80 shadow-sm">
                                    <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Last Calibration: 17 Dec 2025</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-8">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[56px] p-10 lg:p-12 hover:shadow-[0_25px_50px_-12px_rgba(139,92,246,0.1)] transition-all group"
                        >
                            <div className="flex items-center gap-6 mb-10">
                                <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center shadow-sm border border-white/80 group-hover:rotate-6 transition-transform">
                                    {section.icon}
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 tracking-tight">{section.title}</h3>
                            </div>
                            <div className="relative">
                                {section.content}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Support Hub */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[56px] p-10 lg:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
                        <div className="flex items-center gap-6 mb-8 text-[#8b5cf6]">
                            <div className="w-14 h-14 rounded-2xl bg-[#8b5cf6]/10 flex items-center justify-center">
                                <Sparkles size={24} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Support Node</h3>
                        </div>
                        <p className="text-gray-500 font-medium mb-10 leading-relaxed">Encountering anomalies or need manual intervention? Our neural support array is standing by.</p>

                        <div className="space-y-4">
                            <a href="tel:+918358990909" className="flex items-center justify-between p-6 bg-white/60 border border-white/80 rounded-[32px] hover:bg-white hover:scale-[1.02] transition-all group shadow-sm">
                                <div className="flex items-center gap-4">
                                    <Phone size={18} className="text-[#8b5cf6]" />
                                    <span className="text-sm font-black text-gray-900 uppercase tracking-widest">+91 83589 90909</span>
                                </div>
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-[#8b5cf6]" />
                            </a>
                            <a href="mailto:support@ai-mall.in" className="flex items-center justify-between p-6 bg-white/60 border border-white/80 rounded-[32px] hover:bg-white hover:scale-[1.02] transition-all group shadow-sm">
                                <div className="flex items-center gap-4">
                                    <Mail size={18} className="text-[#8b5cf6]" />
                                    <span className="text-sm font-black text-gray-900 uppercase tracking-widest text-ellipsis overflow-hidden">support@ai-mall.in</span>
                                </div>
                                <ChevronRight size={16} className="text-gray-300 group-hover:text-[#8b5cf6]" />
                            </a>
                        </div>
                    </div>

                    <div className="bg-gray-900/5 backdrop-blur-3xl border border-gray-900/10 rounded-[56px] p-10 lg:p-12 flex flex-col justify-between shadow-inner">
                        <div>
                            <div className="flex items-center gap-6 mb-8 text-red-500">
                                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                                    <AlertTriangle size={24} />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Incident Report</h3>
                            </div>
                            <p className="text-gray-500 font-medium mb-8 leading-relaxed">Report visual artifacts, logic errors, or security perimeters breaches directly to our core engineering team.</p>
                        </div>

                        <button
                            onClick={() => setIsReportModalOpen(true)}
                            className="w-full py-6 bg-gray-900 text-white rounded-[32px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black hover:scale-[1.02] transition-all active:scale-95"
                        >
                            Open Diagnosis Form
                        </button>
                    </div>
                </div>

                {/* Legal Summary */}
                <div className="text-center pt-12">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] max-w-2xl mx-auto opacity-60">
                        © 2025 AI-MALL™ SYSTEM • ALL RIGHTS RESERVED • OPERATED BY UWO™ UNDER NEURAL LICENSE 402-A
                    </p>
                </div>

            </div>

            <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
        </div>
    );
};

export default SecurityAndGuidelines;
