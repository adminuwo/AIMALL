import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

const HelpCenterModal = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('KNOWLEDGE');
    const [expandedFaq, setExpandedFaq] = useState(null);
    const [supportCategory, setSupportCategory] = useState('General Inquiry');

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

    const faqs = [
        {
            question: "What exactly is AI-Mall?",
            answer: "AI-Mall is India's first dedicated marketplace for AI agents, offering a wide range of specialized AI solutions for various needs."
        },
        {
            question: "How does the subscription plan work?",
            answer: "We offer flexible subscription tiers. You can choose a monthly or annual plan that best fits your usage requirements."
        },
        {
            question: "Which AI models power these agents?",
            answer: "Our agents are powered by state-of-the-art LLMs including GPT-4, Claude 3, and specialized open-source models optimized for specific tasks."
        },
        {
            question: "Is my data secure on the server?",
            answer: "Yes, we prioritize data security. All data is encrypted at rest and in transit, following industry-standard security protocols."
        },
        {
            question: "How many agents can I use right now?",
            answer: "Depending on your plan, you can access multiple agents simultaneously. Check your plan details for specific limits."
        },
        {
            question: "Can I create my own agent?",
            answer: "Yes! Our Vendor Dashboard allows developers to create, test, and monetize their own custom AI agents on the marketplace."
        },
        {
            question: "Why should I use this over other AI solutions?",
            answer: "AI-Mall offers a curated, secure, and integrated environment where you can find specialized agents for specific workflows, saving you time on prompt engineering."
        },
        {
            question: "Is it mobile-friendly?",
            answer: "Absolutely. The AI-Mall interface is fully responsive and optimized for a seamless experience on smartphones and tablets."
        },
        {
            question: "How do I get started?",
            answer: "Simply sign up for an account, browse the marketplace, pick an agent, and start chatting immediately!"
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
                            KNOWLEDGE
                        </button>
                        <button
                            onClick={() => setActiveTab('SUPPORT')}
                            className={`flex-1 md:flex-none px-4 md:px-6 py-2 rounded-full text-[10px] md:text-xs font-bold tracking-wider transition-all duration-300 ${activeTab === 'SUPPORT'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            SUPPORT
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
                            <h3 className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">General Guidelines</h3>
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
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Issue Category</label>
                                    <div className="relative">
                                        <select
                                            value={supportCategory}
                                            onChange={(e) => setSupportCategory(e.target.value)}
                                            className="w-full p-3 md:p-4 rounded-xl md:rounded-2xl bg-white/40 border border-white/40 text-sm md:text-base text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
                                        >
                                            <option>General Inquiry</option>
                                            <option>Payment Issue</option>
                                            <option>Refund Request</option>
                                            <option>Technical Support</option>
                                            <option>Account Access</option>
                                            <option>Other</option>
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Case Details</label>
                                    <textarea
                                        placeholder="Specify your request..."
                                        className="w-full p-3 md:p-4 h-32 md:h-40 rounded-xl md:rounded-2xl bg-white/40 border border-white/40 text-sm md:text-base text-gray-800 font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                                    ></textarea>
                                </div>

                                <button className="w-full py-3 md:py-4 bg-white/50 hover:bg-white/70 border border-white/50 rounded-xl md:rounded-2xl text-gray-800 font-bold shadow-sm hover:shadow transition-all active:scale-[0.98]">
                                    Initialize Ticket
                                </button>

                                <div className="text-center pt-2 md:pt-4">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest"> Direct Channel: <a href="mailto:aditilakhera0@gmail.com" className="text-blue-500 hover:text-blue-600 block md:inline mt-1 md:mt-0">aditilakhera0@gmail.com</a></p>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Dismiss */}
                {!isOpen ? null : (
                    <div className="p-3 md:p-4 border-t border-white/20 bg-white/10 text-center">
                        <button onClick={onClose} className="text-[10px] font-bold text-gray-500 hover:text-gray-700 uppercase tracking-[0.2em] transition-colors">
                            Dismiss
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HelpCenterModal;
