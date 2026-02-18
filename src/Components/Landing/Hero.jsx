// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router';
// import { AppRoute } from '../../types';

// const Hero = () => {
//     const navigate = useNavigate();
//     const [isVisible, setIsVisible] = useState(false);

//     useEffect(() => {
//         setIsVisible(true);
//     }, []);

//     return (
//         <section className="relative overflow-visible min-h-[500px] flex items-center py-10 md:py-0">
//             {/* Background Elements */}
//             <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-b from-purple-200/30 to-blue-200/30 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

//             <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-16 flex flex-col items-center justify-center text-center">
//                 <div className="z-10 w-full max-w-4xl">
//                     <h1 className={`text-5xl md:text-[5rem] font-bold leading-[1.0] mb-4 text-[#1A1A1A] tracking-tight transition-all duration-1000 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//                         Discover & Deploy <br></br>AI Solutions <br />
//                         <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6]">
//                             AI Solutions
//                         </span>
//                     </h1>

//                     <p className={`text-lg md:text-2xl text-[#444] mb-8 max-w-2xl mx-auto font-medium transition-all duration-1000 delay-100 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//                         Your vendors marketplace for intelligent agents
//                     </p>

//                     <div className={`flex flex-wrap gap-4 justify-center transition-all duration-1000 delay-200 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
//                         <button
//                             onClick={() => navigate('/dashboard/chat')}
//                             className="px-8 py-3 rounded-full font-bold text-base text-white bg-[#8b5cf6] hover:bg-[#7c3aed] shadow-lg shadow-purple-500/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/60 active:scale-95 outline-none focus:ring-4 focus:ring-purple-400/50">
//                             AI Mall
//                         </button>
//                         <button
//                             onClick={() => window.location.href = "https://a-series-bgve.onrender.com"}
//                             className="px-8 py-3 rounded-full font-bold text-base text-white bg-[#3b82f6] hover:bg-[#2563eb] shadow-lg shadow-blue-500/50 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/60 active:scale-95 outline-none focus:ring-4 focus:ring-blue-400/50">
//                             A Series
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default Hero;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../userStore/userData';
import { useLanguage } from '../../context/LanguageContext';
import './Hero.css';
const Logo = "/logo/Logo.png";

const Hero = () => {
    const navigate = useNavigate();
    const theme = useRecoilValue(themeState);
    const isDark = theme === 'Dark';
    const [isVisible, setIsVisible] = useState(false);
    const [showAIMall, setShowAIMall] = useState(false);
    const [showASeries, setShowASeries] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Close cards when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (window.innerWidth < 768) {
                if (!event.target.closest('.hover-card') && !event.target.closest('button')) {
                    setShowAIMall(false);
                    setShowASeries(false);
                }
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <section className="relative overflow-visible min-h-[400px] sm:min-h-[500px] flex items-center py-6 sm:py-10 md:pb-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 xl:px-16 w-full flex flex-col items-center justify-center text-center md:-mt-10">
                <div className="z-10 max-w-4xl w-full flex flex-col items-center">

                    <div className={`mb-6 relative transition-all duration-1000 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <div className="absolute inset-0 bg-purple-500/30 blur-3xl rounded-full scale-110"></div>
                        <img
                            src={Logo}
                            alt="AI Mall Logo"
                            className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 object-contain relative z-10 drop-shadow-2xl animate-float"
                        />
                    </div>

                    <h1
                        className={`${isDark ? 'text-white' : 'hero-heading-dark'} text-2xl sm:text-3xl md:text-5xl lg:text-[4.5rem] font-bold leading-[1.2] mb-3 sm:mb-4 md:mb-0 drop-shadow-sm transition-[opacity,transform,color] duration-500 delay-100 ease-out transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    >
                        {t('heroHeading')} <br />
                        {t('heroHeadingLine2')}
                    </h1>

                    <div className="h-3 sm:h-4 md:h-6" />

                    <p
                        className={`${isDark ? 'text-white/90' : 'hero-subtext-dark'} text-sm sm:text-base md:text-xl lg:text-2xl mb-6 sm:mb-8 md:mb-10 font-medium drop-shadow-sm transition-[opacity,transform,color] duration-500 delay-200 ease-out transform px-4 sm:px-0 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    >
                        {t('heroSubheading')}
                    </p>

                    <div className={`relative w-full flex flex-col md:flex-row gap-4 sm:gap-6 justify-center items-center transition-[opacity,transform] duration-500 delay-300 ease-out transform px-4 sm:px-0 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

                        {/* ================= AI MALL ================= */}
                        <div
                            className="relative w-full max-w-[280px] md:w-auto flex flex-col items-center"
                            onMouseEnter={() => window.innerWidth >= 768 && setShowAIMall(true)}
                            onMouseLeave={() => window.innerWidth >= 768 && setShowAIMall(false)}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.innerWidth < 768) {
                                        if (showAIMall) {
                                            navigate('/dashboard/chat');
                                        } else {
                                            setShowAIMall(true);
                                            setShowASeries(false);
                                        }
                                    } else {
                                        navigate('/dashboard/chat');
                                    }
                                }}
                                className="w-full md:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-[#8b5cf6] hover:bg-[#7c3aed]
                                shadow-lg shadow-purple-500/50 transition-all duration-300
                                hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/70
                                active:scale-95 outline-none">
                                {t('aiMallButton')}<sup className="text-[10px] md:text-[0.45em] font-black ml-0.5 relative -top-[0.6em] md:-top-[0.8em]">{t('trademark')}</sup>
                            </button>

                            {/* AI Mall Card */}
                            <div className={`hover-card absolute left-0 right-0 mx-auto md:left-auto md:right-full md:translate-x-0 top-full mt-3 w-full sm:w-80 transition-all duration-300 z-50
                                ${showAIMall ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 pointer-events-none invisible'}`}>
                                <div className="rounded-xl p-3 sm:p-5 text-white
                                    bg-gradient-to-br from-purple-600/90 via-violet-600/85 to-indigo-600/80
                                    border border-purple-300/40
                                    shadow-[0_0_25px_rgba(168,85,247,0.5)]
                                    backdrop-blur-md">
                                    <h4 className="text-sm sm:text-lg font-semibold mb-1.5 sm:mb-2 text-white">{t('aiMallCardTitle')}<sup className="text-[10px] md:text-[0.45em] font-black ml-1 relative -top-[0.5em] md:-top-[0.7em]">{t('trademark')}</sup></h4>
                                    <p className="text-xs sm:text-sm text-white leading-relaxed">
                                        {t('aiMallCardDesc')}
                                    </p>
                                    <button
                                        onClick={() => navigate('/dashboard/chat')}
                                        className="mt-2 sm:mt-3 w-full py-1.5 sm:py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs sm:text-sm font-semibold transition-colors md:hidden">
                                        {t('goToAIMall')}<sup className="text-[10px] md:text-[0.45em] font-black ml-1 relative -top-[0.5em] md:-top-[0.7em]">{t('trademark')}</sup> →
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ================= A SERIES ================= */}
                        <div
                            className="relative w-full max-w-[280px] md:w-auto flex flex-col items-center"
                            onMouseEnter={() => window.innerWidth >= 768 && setShowASeries(true)}
                            onMouseLeave={() => window.innerWidth >= 768 && setShowASeries(false)}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.innerWidth < 768) {
                                        if (showASeries) {
                                            window.location.href = "https://a-series-bgve.onrender.com";
                                        } else {
                                            setShowASeries(true);
                                            setShowAIMall(false);
                                        }
                                    } else {
                                        window.location.href = "https://a-series-bgve.onrender.com";
                                    }
                                }}
                                className="w-full md:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-full font-bold text-sm sm:text-base text-white bg-[#3b82f6] hover:bg-[#2563eb]
                                shadow-lg shadow-blue-500/50 transition-all duration-300
                                hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/70
                                active:scale-95 outline-none">
                                {t('aSeriesButton')}<sup className="text-[10px] md:text-[0.45em] font-black ml-0.5 relative -top-[0.6em] md:-top-[0.8em]">{t('trademark')}</sup>
                            </button>

                            {/* A Series Card */}
                            <div className={`hover-card absolute left-0 right-0 mx-auto md:right-auto md:left-full md:translate-x-0 top-full mt-3 w-full sm:w-80 transition-all duration-300 z-50
                                ${showASeries ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-2 pointer-events-none invisible'}`}>
                                <div className="rounded-xl p-3 sm:p-5 text-white
                                    bg-gradient-to-br from-[#2563eb] via-[#3b82f6] to-[#1d4ed8]
                                    border border-blue-300/40
                                    shadow-[0_0_25px_rgba(59,130,246,0.5)]
                                    backdrop-blur-md">
                                    <h4 className="text-sm sm:text-lg font-semibold mb-1.5 sm:mb-2 text-white">{t('aSeriesCardTitle')}<sup className="text-[10px] md:text-[0.45em] font-black ml-1 relative -top-[0.5em] md:-top-[0.7em]">{t('trademark')}</sup></h4>
                                    <p className="text-xs sm:text-sm text-white leading-relaxed">
                                        {t('aSeriesCardDesc')}
                                    </p>
                                    <button
                                        onClick={() => window.location.href = "https://a-series-bgve.onrender.com"}
                                        className="mt-2 sm:mt-3 w-full py-1.5 sm:py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs sm:text-sm font-semibold transition-colors md:hidden">
                                        {t('goToASeries')}<sup className="text-[10px] md:text-[0.45em] font-black ml-1 relative -top-[0.5em] md:-top-[0.7em]">{t('trademark')}</sup> →
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Dynamic Spacer for mobile - pushes HowItWorks down ONLY when A Series card is open */}
                    <div
                        className={`transition-all duration-300 ease-in-out md:hidden ${showASeries ? 'h-[150px]' : 'h-0'}`}
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;
