import React, { useState, useEffect, useRef } from 'react';
import { X, Shield, ScrollText, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../userStore/userData';

const TermsModal = ({ isOpen, onClose, onViewed }) => {
    const { t } = useLanguage();
    const theme = useRecoilValue(themeState);
    const isDark = theme === 'Dark';
    const scrollRef = useRef(null);
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setHasScrolledToBottom(false);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            // Buffer of 10px to account for rounding errors
            if (scrollTop + clientHeight >= scrollHeight - 10) {
                if (!hasScrolledToBottom) {
                    setHasScrolledToBottom(true);
                    onViewed();
                }
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative w-full max-w-2xl border shadow-2xl rounded-[32px] overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-300 transition-colors ${isDark ? 'bg-[#0f172a] border-white/10' : 'bg-white/40 backdrop-blur-3xl border-white/60'
                }`}>

                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b ${isDark ? 'border-white/5' : 'border-white/20'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                            <ScrollText size={20} />
                        </div>
                        <div>
                            <h3 className={`text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {t('termsTitle')}
                            </h3>
                            <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                                {t('termsSubtitle')}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-white/60' : 'bg-white/60 hover:bg-white/80 text-gray-600 border border-white/60'}`}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Area */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto p-8 pt-6 custom-scrollbar"
                >
                    <div className={`prose prose-sm max-w-none space-y-8 ${isDark ? 'prose-invert text-white/70' : 'text-gray-600'}`}>
                        <section className="space-y-4">
                            <h4 className={`text-base font-black uppercase tracking-widest ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{t('termsSection1Title')}</h4>
                            <p className="text-sm leading-relaxed font-medium">
                                {t('termsSection1Content')}
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h4 className={`text-base font-black uppercase tracking-widest ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{t('termsSection2Title')}</h4>
                            <p className="text-sm leading-relaxed font-medium">
                                {t('termsSection2Content')}
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-sm font-medium">
                                <li>{t('termsSection2List1')}</li>
                                <li>{t('termsSection2List2')}</li>
                                <li>{t('termsSection2List3')}</li>
                                <li>{t('termsSection2List4')}</li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h4 className={`text-base font-black uppercase tracking-widest ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{t('termsSection3Title')}</h4>
                            <p className="text-sm leading-relaxed font-medium">
                                {t('termsSection3Content')}
                            </p>
                        </section>

                        <section className="space-y-4">
                            <h4 className={`text-base font-black uppercase tracking-widest ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>{t('termsSection4Title')}</h4>
                            <p className="text-sm leading-relaxed font-medium">
                                {t('termsSection4Content')}
                            </p>
                        </section>

                        <div className={`p-6 rounded-2xl border flex items-start gap-4 ${isDark ? 'bg-purple-500/5 border-purple-500/20' : 'bg-purple-50 border-purple-100'}`}>
                            <Shield className={`shrink-0 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} size={24} />
                            <div>
                                <h5 className={`text-sm font-black uppercase tracking-wider mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('termsComplianceVerified')}</h5>
                                <p className="text-xs leading-relaxed font-medium opacity-70">
                                    {t('termsComplianceDesc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Detection */}
                <div className={`p-6 border-t flex flex-col gap-4 items-center justify-center ${isDark ? 'border-white/5 bg-white/2' : 'border-white/20 bg-white/20'}`}>
                    {!hasScrolledToBottom ? (
                        <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                            {t('termsScrollToContinue')}
                        </p>
                    ) : (
                        <div className="flex items-center gap-2 text-green-500 animate-in fade-in slide-in-from-bottom-2">
                            <CheckCircle2 size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('termsLegalRead')}</span>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className={`px-10 py-3 rounded-full font-black text-[12px] uppercase tracking-widest transition-all ${hasScrolledToBottom
                            ? 'bg-purple-600 text-white shadow-lg active:scale-95'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        disabled={!hasScrolledToBottom}
                    >
                        {t('termsIUnderstand')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
