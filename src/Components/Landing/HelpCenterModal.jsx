import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Loader2, CheckCircle2 } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { useLanguage } from '../../context/LanguageContext';

const HelpCenterModal = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState('KNOWLEDGE');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [supportCategory, setSupportCategory] = useState('General Inquiry');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setSubmitted(false);
            setMessage('');
            // Set default category localized
            setSupportCategory('General Inquiry');
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleTicketSubmit = async () => {
        if (!message.trim()) return;
        setLoading(true);
        try {
            await apiService.submitReport({
                type: supportCategory,
                description: message,
                priority: 'medium'
            });
            setSubmitted(true);
            setMessage('');
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            console.error("Support submission error:", err);
            alert("Failed to submit support ticket. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const faqs = [
        {
            question: t('faq1_q') || "What exactly is AI-Mall?",
            answer: t('faq1_a') || "AI-Mall is India's first dedicated marketplace for AI agents, offering a wide range of specialized AI solutions for various needs."
        },
        {
            question: t('faq2_q') || "How does the subscription plan work?",
            answer: t('faq2_a') || "We offer flexible subscription tiers. You can choose a monthly or annual plan that best fits your usage requirements."
        },
        {
            question: t('faq3_q') || "Which AI models power these agents?",
            answer: t('faq3_a') || "Our agents are powered by state-of-the-art LLMs including GPT-4, Claude 3, and specialized open-source models optimized for specific tasks."
        },
        {
            question: t('faq4_q') || "Is my data secure on the server?",
            answer: t('faq4_a') || "Yes, we prioritize data security. All data is encrypted at rest and in transit, following industry-standard security protocols."
        },
        {
            question: t('faq5_q') || "How many agents can I use right now?",
            answer: t('faq5_a') || "Depending on your plan, you can access multiple agents simultaneously. Check your plan details for specific limits."
        },
        {
            question: t('faq6_q') || "Can I create my own agent?",
            answer: t('faq6_a') || "Yes! Our Vendor Dashboard allows developers to create, test, and monetize their own custom AI agents on the marketplace."
        },
        {
            question: t('faq7_q') || "Why should I use this over other AI solutions?",
            answer: t('faq7_a') || "AI-Mall offers a curated, secure, and integrated environment where you can find specialized agents for specific workflows, saving you time on prompt engineering."
        },
        {
            question: t('faq8_q') || "Is it mobile-friendly?",
            answer: t('faq8_a') || "Absolutely. The AI-Mall interface is fully responsive and optimized for a seamless experience on smartphones and tablets."
        },
        {
            question: t('faq9_q') || "How do I get started?",
            answer: t('faq9_a') || "Simply sign up for an account, browse the marketplace, pick an agent, and start chatting immediately!"
        }
    ];

    const toggleFaq = (index) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-white/40 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[20px] md:rounded-[32px] overflow-hidden flex flex-col max-h-[85vh] md:max-h-[85vh] animate-in fade-in zoom-in duration-300">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 pb-2 gap-4 md:gap-0">
                    <div className="flex w-full md:w-auto bg-white/50 rounded-full p-1 border border-white/40">
                        <button
                            onClick={() => setActiveTab('KNOWLEDGE')}
                            className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-bold tracking-wider transition-all duration-300 ${activeTab === 'KNOWLEDGE'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {t('knowledge') || 'KNOWLEDGE'}
                        </button>
                        <button
                            onClick={() => setActiveTab('SUPPORT')}
                            className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-bold tracking-wider transition-all duration-300 ${activeTab === 'SUPPORT'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {t('supportHeading') || 'SUPPORT'}
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 md:static p-2 rounded-full bg-white/40 hover:bg-white/60 transition-colors border border-white/40 text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 pt-2 custom-scrollbar">

                    {activeTab === 'KNOWLEDGE' && (
                        <div className="space-y-4 md:space-y-6">
                            <h3 className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">{t('generalGuidelines')}</h3>
                            <div className="space-y-3">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="overflow-hidden rounded-2xl md:rounded-3xl bg-white/40 border border-white/40 hover:bg-white/50 transition-colors">
                                        <button
                                            onClick={() => toggleFaq(index)}
                                            className="w-full flex items-center justify-between p-4 md:p-5 text-left"
                                        >
                                            <span className="font-semibold text-gray-800 text-xs md:text-sm pr-4">{faq.question}</span>
                                            {expandedFaq === index ? (
                                                <ChevronUp size={16} className="text-gray-500" />
                                            ) : (
                                                <ChevronDown size={16} className="text-gray-500" />
                                            )}
                                        </button>
                                        <div
                                            className={`px-4 md:px-5 text-xs md:text-sm text-gray-600 leading-relaxed transition-all duration-300 ease-in-out ${expandedFaq === index ? 'max-h-60 pb-4 md:pb-5 opacity-100' : 'max-h-0 opacity-0'
                                                }`}
                                        >
                                            {faq.answer}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'SUPPORT' && (
                        <div className="space-y-4 md:space-y-6 animate-in slide-in-from-right-4 duration-300">
                            {submitted ? (
                                <div className="h-64 flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{t('ticketInitialized') || 'Ticket Initialized!'}</h3>
                                        <p className="text-sm text-gray-500">{t('ticketNotified') || 'Our support team has been notified.'}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">{t('issueCategory') || 'Issue Category'}</label>
                                        <div className="relative">
                                            <select
                                                value={supportCategory}
                                                onChange={(e) => setSupportCategory(e.target.value)}
                                                className="w-full p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/40 border border-white/40 text-sm md:text-base text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                                            >
                                                <option value="General Inquiry">{t('inquiryGeneral')}</option>
                                                <option value="Payment Issue">{t('inquiryPayment')}</option>
                                                <option value="Refund Request">{t('inquiryRefund')}</option>
                                                <option value="Technical Support">{t('inquiryTechnical')}</option>
                                                <option value="Account Access">{t('inquiryAccount')}</option>
                                                <option value="Other">{t('inquiryOther')}</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">{t('caseDetails') || 'Case Details'}</label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder={t('specifyRequest') || "Specify your request..."}
                                            className="w-full p-3 md:p-4 h-32 md:h-40 rounded-xl md:rounded-2xl bg-white/40 border border-white/40 text-sm md:text-base text-gray-800 font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                                        ></textarea>
                                    </div>

                                    <button
                                        onClick={handleTicketSubmit}
                                        disabled={loading || !message.trim()}
                                        className="w-full py-3 md:py-4 bg-white/50 hover:bg-white/70 border border-white/50 rounded-xl md:rounded-2xl text-gray-800 font-bold shadow-sm hover:shadow transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                {t('submitting') || 'SUBMITTING...'}
                                            </>
                                        ) : (
                                            t('initializeTicket') || 'Initialize Ticket'
                                        )}
                                    </button>

                                    <div className="text-center pt-2 md:pt-4">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"> {t('directChannel') || 'Direct Channel'}: <a href="mailto:admin@uwo24.com" className="text-blue-500 hover:text-blue-600 block md:inline mt-1 md:mt-0 normal-case">admin@uwo24.com</a></p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* Footer Dismiss */}
                {!isOpen ? null : (
                    <div className="p-4 border-t border-purple-100/30 bg-purple-50/20 text-center">
                        <button
                            onClick={onClose}
                            className="px-8 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 border border-purple-200/50 shadow-sm"
                        >
                            {t('dismiss') || 'Dismiss'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HelpCenterModal;
