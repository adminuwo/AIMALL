import React, { useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { X, Shield, Lock, AlertTriangle, Scale, FileText, Eye, Building, Copyright, AlertOctagon, FileEdit, FileQuestion } from 'lucide-react';

const SecurityGuidelinesModal = ({ isOpen, onClose }) => {

    const { t } = useLanguage();

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const sections = [
        {
            icon: Lock,
            title: t('sec1Title') || "1. Data Privacy & Protection",
            color: "text-blue-600",
            bg: "bg-blue-500/10",
            content: (
                <div className="space-y-4 text-sm text-gray-600">
                    <p>{t('sec1Content1') || "A-Series™ is committed to safeguarding user data in accordance with applicable data protection laws, including but not limited to GDPR and CCPA."}</p>
                    <div>
                        <strong className="block text-gray-900 mb-1">{t('sec1Header1') || "1.1 Data Collection"}</strong>
                        <p>{t('sec1Text1') || "A-Series™ may collect personal and technical information including account details, usage metadata, device identifiers, and file access permissions."}</p>
                    </div>
                    <div>
                        <strong className="block text-gray-900 mb-1">{t('sec1Header2') || "1.2 Data Usage"}</strong>
                        <p>{t('sec1Text2') || "Collected data shall be used exclusively to provide platform services, improve performance, and communicate important updates."}</p>
                    </div>
                    <div>
                        <strong className="block text-gray-900 mb-1">{t('sec1Header3') || "1.3 Data Sharing"}</strong>
                        <p>{t('sec1Text3') || "A-Series™ does not sell personal data. Data may be shared with trusted third-party service providers strictly for operational requirements."}</p>
                    </div>
                    <div>
                        <strong className="block text-gray-900 mb-1">{t('sec1Header4') || "1.4 User Rights"}</strong>
                        <p>{t('sec1Text4') || "Users retain the right to access, rectify, or request deletion of their data by contacting contact@ai-mall.in."}</p>
                    </div>
                </div>
            )
        },
        {
            icon: Shield,
            title: t('sec2Title') || "2. Account Security Responsibilities",
            color: "text-indigo-600",
            bg: "bg-indigo-500/10",
            content: (
                <div className="space-y-3 text-sm text-gray-600">
                    <p><strong className="text-gray-900">2.1</strong> {t('sec2Content1') || "Users are responsible for maintaining the confidentiality of their credentials."}</p>
                    <p><strong className="text-gray-900">2.2</strong> {t('sec2Content2') || "A-Series™ employs encryption and secure session handling. Users must report unauthorized access immediately."}</p>
                </div>
            )
        },
        {
            icon: AlertTriangle,
            title: t('sec3Title') || "3. Acceptable Use & Prohibited Conduct",
            color: "text-amber-600",
            bg: "bg-amber-500/10",
            content: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-medium text-gray-700 mt-2">
                    <div className="p-3 bg-white/30 rounded-lg flex items-center gap-2 border border-white/40">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        {t('sec3Item1') || "Illegal or unauthorized use"}
                    </div>
                    <div className="p-3 bg-white/30 rounded-lg flex items-center gap-2 border border-white/40">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        {t('sec3Item2') || "Reverse engineering models"}
                    </div>
                    <div className="p-3 bg-white/30 rounded-lg flex items-center gap-2 border border-white/40">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        {t('sec3Item3') || "Uploading malicious content"}
                    </div>
                    <div className="p-3 bg-white/30 rounded-lg flex items-center gap-2 border border-white/40">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        {t('sec3Item4') || "Bypassing security controls"}
                    </div>
                </div>
            )
        },
        {
            icon: Scale,
            title: t('sec4Title') || "4. AI Usage & Content Disclaimer",
            color: "text-cyan-600",
            bg: "bg-cyan-500/10",
            content: (
                <div className="space-y-3 text-sm text-gray-600">
                    <div className="p-3 bg-white/30 rounded-xl border border-white/40">
                        <p><strong className="text-gray-900">4.1 Accuracy:</strong> {t('sec4Content1') || "AI outputs are provided on an 'as-is' basis and may contain inaccuracies."}</p>
                    </div>
                    <div className="p-3 bg-white/30 rounded-xl border border-white/40">
                        <p><strong className="text-gray-900">4.2 Reliability:</strong> {t('sec4Content2') || "A-Series™ is not responsible for outcomes arising from reliance on AI-generated content."}</p>
                    </div>
                </div>
            )
        },
        {
            icon: FileText,
            title: t('sec5Title') || "5. File Upload & Document Security",
            color: "text-blue-600",
            bg: "bg-blue-500/10",
            content: (
                <p className="text-sm text-gray-600 leading-relaxed">{t('sec5Content') || "Uploaded files are processed solely for functionality (analysis, RAG). Executable or malicious files may be rejected."}</p>
            )
        },
        {
            icon: Eye,
            title: t('sec6Title') || "6. Cookies & Tracking",
            color: "text-blue-600",
            bg: "bg-blue-500/10",
            content: (
                <p className="text-sm text-gray-600 leading-relaxed">{t('sec6Content') || "A-Series™ uses cookies for functionality and security. Users may manage cookies via browser settings."}</p>
            )
        },
        {
            icon: Building,
            title: t('sec7Title') || "7. Third-Party Services",
            color: "text-blue-600",
            bg: "bg-blue-500/10",
            content: (
                <p className="text-sm text-gray-600 leading-relaxed">{t('sec7Content') || "Integrations with cloud providers and AI services are governed by contracts and limited to operational necessity."}</p>
            )
        },
        {
            icon: Copyright,
            title: t('sec8Title') || "8. Intellectual Property",
            color: "text-blue-600",
            bg: "bg-blue-500/10",
            content: (
                <p className="text-sm text-gray-600 leading-relaxed">{t('sec8Content') || "All rights, licenses, and ownership remain with A-Series™ and UWO™. No transfer of ownership is implied."}</p>
            )
        },
        {
            icon: AlertOctagon,
            title: t('sec9Title') || "9. Enforcement",
            color: "text-blue-600",
            bg: "bg-blue-500/10",
            content: (
                <p className="text-sm text-gray-600 leading-relaxed">{t('sec9Content') || "We monitor for compliance and reserve the right to suspend or terminate accounts for violations or security threats."}</p>
            )
        },
        {
            icon: FileEdit,
            title: t('sec10Title') || "10. Policy Updates",
            color: "text-blue-600",
            bg: "bg-blue-500/10",
            content: (
                <p className="text-sm text-gray-600 leading-relaxed">{t('sec10Content') || "Modifications may occur at any time. Continued use of the platform constitutes acceptance of updated terms."}</p>
            )
        },
        {
            icon: FileQuestion,
            title: t('sec11Title') || "11. Contact",
            color: "text-blue-600",
            bg: "bg-blue-500/10",
            content: (
                <p className="text-sm text-gray-600 leading-relaxed">{t('sec11Content') || "For concerns or rights requests, contact"} <a href="mailto:contact@ai-mall.in" className="text-blue-600 hover:underline font-medium">contact@ai-mall.in</a>.</p>
            )
        },
        {
            icon: AlertTriangle,
            title: t('sec12Title') || "12. Incident Support",
            color: "text-blue-600",
            bg: "bg-blue-500/10",
            content: (
                <div className="space-y-3">
                    <p className="text-sm text-gray-600">{t('sec12Content') || "Report security violations or technical issues immediately."}</p>
                    <div className="flex gap-3">
                        <a href="#" className="px-4 py-2 bg-blue-500/10 text-blue-600 text-xs font-bold rounded-lg hover:bg-blue-500/20 transition-colors flex items-center gap-2 border border-blue-500/10">
                            📧 {t('openForm') || "Open Form"}
                        </a>
                        <a href="tel:+918358990909" className="px-4 py-2 bg-pink-500/10 text-pink-600 text-xs font-bold rounded-lg hover:bg-pink-500/20 transition-colors flex items-center gap-2 border border-pink-500/10">
                            📞 +91 83589 90909
                        </a>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-5xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[20px] md:rounded-[32px] overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh] animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="p-5 md:p-8 pb-4 border-b border-white/40 flex items-start justify-between bg-white/10 z-10">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="p-2 md:p-3 bg-white/50 rounded-2xl text-blue-600 shadow-sm border border-white/50">
                            <Shield size={24} className="md:w-7 md:h-7" strokeWidth={2} />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-2xl font-bold text-gray-900 leading-tight">{t('secHeading')}</h2>
                            <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{t('secPolicySubtitle') || "Comprehensive Platform Policy"}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/40 transition-colors text-gray-500 hover:text-gray-700 border border-transparent hover:border-white/40"
                    >
                        <X size={20} className="md:w-6 md:h-6" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-5 md:p-8 custom-scrollbar">

                    {/* Intro Box */}
                    <div className="mb-6 md:mb-8 p-4 md:p-6 bg-white/40 border border-white/50 rounded-2xl shadow-sm text-gray-700 text-xs md:text-sm leading-relaxed backdrop-blur-sm">
                        {t('secIntro') || "This section governs the acceptable use, data protection practices, and security standards applicable to"} <strong className="text-gray-900">AI Mall</strong>, {t('operatedBy') || "operated by"} <strong className="text-gray-900">UWO™</strong>.
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                        {sections.map((section, index) => (
                            <div key={index} className="bg-white/40 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/50 shadow-sm hover:shadow-md transition-all hover:bg-white/50 group backdrop-blur-sm">
                                <div className="flex items-center gap-3 mb-3 md:mb-4">
                                    <section.icon size={18} className={`md:w-5 md:h-5 ${section.color}`} />
                                    <h3 className="font-bold text-gray-900 text-sm md:text-base">{section.title}</h3>
                                </div>

                                {section.content}
                            </div>
                        ))}
                    </div>

                </div>

                {/* Footer */}
                {/* Footer */}
                <div className="p-3 md:p-6 border-t border-white/20 bg-white/20 flex flex-col md:flex-row items-center justify-between gap-3 backdrop-blur-md">
                    <div className="flex items-start gap-2 p-2.5 md:p-4 bg-white/30 rounded-xl max-w-2xl border border-white/30 w-full md:w-auto">
                        <span className="text-base md:text-lg">🧠</span>
                        <div>
                            <strong className="text-sm text-gray-900 block mb-0.5">{t('legalSummaryTitle') || "Legal Summary"}</strong>
                            <p className="text-[10px] md:text-xs text-gray-500 italic leading-tight">"{t('legalSummaryText') || "These Guidelines establish the framework for lawful use, data protection, AI governance, and operational security within the AI Mall platform."}"</p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-95 whitespace-nowrap"
                    >
                        {t('closeGuidelines') || "Close Guidelines"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SecurityGuidelinesModal;
