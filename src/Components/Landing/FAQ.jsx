import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
    { id: 1, question: "How does the AI-MALL integration work?", answer: "Our platform provides a standardized API layer. You can connect any listed AI agent to your workflow using a single secure key and our universal SDK." },
    { id: 2, question: "Is my data secure with vendor agents?", answer: "Yes. All data passes through our encrypted gateway. Vendors only receive the necessary payload to process requests, and we enforce strict privacy compliance." },
    { id: 3, question: "Can I monetize my own AI agent?", answer: "Absolutely. You can list your agent on AI-MALL, set your own pricing (per request or subscription), and we handle the billing and distribution." },
    { id: 4, question: "What support do you offer for enterprise?", answer: "Enterprise teams get dedicated account management, SLA guarantees, private cloud deployment options, and custom integration workshops." }
];

const FAQ = () => {
    const [openId, setOpenId] = useState(null);

    return (
        <section className="py-20">
            <div className="container max-w-3xl">
                <h2 className="text-3xl font-bold mb-12 text-[#1A1A1A] text-center">Frequently Asked Questions</h2>

                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="group bg-white/40 backdrop-blur-lg border border-white/60 rounded-[20px] overflow-hidden transition-all duration-300 hover:bg-white/60 shadow-sm">
                            <button
                                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-bold text-[#1A1A1A] text-lg">{faq.question}</span>
                                <div className={`p-2 rounded-full bg-blue-50 text-blue-600 transition-transform duration-300 ${openId === faq.id ? 'rotate-180 bg-blue-100' : ''}`}>
                                    {openId === faq.id ? <Minus size={20} /> : <Plus size={20} />}
                                </div>
                            </button>

                            <div className={`transition-all duration-300 ease-in-out ${openId === faq.id ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <p className="px-6 pb-6 text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
