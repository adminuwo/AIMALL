import React, { useState } from 'react';
import { Link } from 'react-router';
import { MapPin, Mail, Phone } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import { themeState } from '../../userStore/userData';
import LinkedinIcon from '../../assets/social-icons/Linkedin.svg';
import TwitterIcon from '../../assets/social-icons/X.svg';
import FacebookIcon from '../../assets/social-icons/FB.svg';
import InstagramIcon from '../../assets/social-icons/Insta.svg';
import YoutubeIcon from '../../assets/social-icons/YT.svg';
import ThreadIcon from '../../assets/social-icons/Threads.svg';
import HelpCenterModal from './HelpCenterModal';
import SecurityGuidelinesModal from './SecurityGuidelinesModal';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
    const [isHelpCenterOpen, setIsHelpCenterOpen] = useState(false);
    const [isSecurityOpen, setIsSecurityOpen] = useState(false);
    const theme = useRecoilValue(themeState);
    const isDark = theme === 'Dark';
    const { t } = useLanguage();

    return (
        <>
            <HelpCenterModal isOpen={isHelpCenterOpen} onClose={() => setIsHelpCenterOpen(false)} />
            <SecurityGuidelinesModal isOpen={isSecurityOpen} onClose={() => setIsSecurityOpen(false)} />

            <footer
                className={`
                relative mt-20
                backdrop-blur-[16px]
                border-t 
                pt-24 pb-10
                rounded-t-[80px]
                shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.08)]
                overflow-hidden transition-colors duration-250
                ${isDark
                        ? 'bg-white/5 border-white/10'
                        : 'bg-[linear-gradient(135deg,rgba(59,130,246,0.12),rgba(139,92,246,0.12))] border-white/35'
                    }
                `}
            >
                {/* Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                    <div className={`absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] mix-blend-multiply animate-blob ${isDark ? 'bg-cyan-900/40' : 'bg-cyan-400/20'}`}></div>
                    <div className={`absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000 ${isDark ? 'bg-fuchsia-900/40' : 'bg-fuchsia-400/20'}`}></div>
                    <div className={`absolute top-[20%] right-[20%] w-[400px] h-[400px] rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-4000 ${isDark ? 'bg-purple-900/40' : 'bg-purple-400/20'}`}></div>
                </div>

                {/* Shimmer Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-[200%] animate-[shimmer_10s_infinite_linear] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-16 relative z-10">
                    <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-8 mb-16">

                        {/* Brand */}
                        <div className="space-y-2">
                            <img src="/logo/Logo.png" alt="AI Mall Logo" className="w-16 h-16 object-contain" />
                            <p className={`text-sm leading-relaxed font-medium ${isDark ? 'footer-text-glow' : 'text-black'}`}>
                                AI-MALL<sup className="text-[10px] md:text-[0.5em] font-black ml-0.5 relative -top-[0.5em] md:-top-[0.7em]">TM</sup> — {t('footerTagline')}<br />
                                {t('aiAppsCount')} | AI-MALL<sup className="text-[10px] md:text-[0.5em] font-black ml-0.5 relative -top-[0.5em] md:-top-[0.7em]">TM</sup> | {t('partnerIntegrations')}<br />
                                {t('poweredBy')}<sup className="text-[10px] md:text-[0.5em] font-black ml-0.5 relative -top-[0.5em] md:-top-[0.7em]">TM</sup>
                            </p>

                            <div className="flex gap-3 pt-2">
                                {[
                                    { icon: LinkedinIcon, link: 'https://www.linkedin.com/in/aimall-global/' },
                                    { icon: TwitterIcon, link: 'https://x.com/aimallglobal' },
                                    { icon: FacebookIcon, link: 'https://www.facebook.com/aimallglobal/' },
                                    { icon: InstagramIcon, link: 'https://www.instagram.com/aimall.global/' },
                                    { icon: YoutubeIcon, link: 'https://www.youtube.com/@aimallglobal' },
                                    { icon: ThreadIcon, link: 'https://www.threads.com/@aimallglobal' }
                                ].map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg rounded-lg overflow-hidden group"
                                    >
                                        <img
                                            src={social.icon}
                                            alt="social"
                                            className="w-8 h-8 object-cover group-hover:scale-110 transition-transform"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Explore */}
                        <div>
                            <h3 className={`text-sm font-black uppercase tracking-wider mb-6 underline underline-offset-4 footer-text-glow ${isDark ? 'text-white' : 'text-black'}`}>{t('explore')}</h3>
                            <ul className="space-y-4">
                                {[
                                    { name: t('marketplace'), link: '/dashboard/marketplace' },
                                    { name: t('myAgentsNav'), link: '/dashboard/agents' },
                                    { name: t('becomeVendor'), link: '/vendor-register' }
                                ].map((item, i) => (
                                    <li key={i}>
                                        <Link
                                            to={item.link}
                                            className="footer-glow-link font-bold transition-all duration-300 hover:translate-x-2 inline-block"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className={`text-sm font-black uppercase tracking-wider mb-6 underline underline-offset-4 footer-text-glow ${isDark ? 'text-white' : 'text-black'}`}>{t('supportHeading')}</h3>
                            <ul className="space-y-4">
                                <li>
                                    <button
                                        onClick={() => setIsHelpCenterOpen(true)}
                                        className="footer-glow-purple font-bold transition-all duration-300 hover:translate-x-2"
                                    >
                                        {t('helpCenter')}
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setIsSecurityOpen(true)}
                                        className="footer-glow-purple font-bold transition-all duration-300 hover:translate-x-2"
                                    >
                                        {t('securityGuidelines')}
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className={`text-sm font-black uppercase tracking-wider mb-6 underline underline-offset-4 footer-text-glow ${isDark ? 'text-white' : 'text-black'}`}>{t('contactHeading')}</h3>
                            <ul className="space-y-5">
                                <li className="flex gap-3 group cursor-pointer">
                                    <MapPin size={20} className="footer-glow-link group-hover:text-[#8b5cf6] transition-all duration-300" />
                                    <a
                                        href="https://www.google.com/maps/place/Jabalpur,+Madhya+Pradesh/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="footer-glow-link font-bold transition-all group-hover:translate-x-1"
                                    >
                                        {t('jabalpurAddress')}
                                    </a>
                                </li>
                                <li className="flex gap-3 group cursor-pointer">
                                    <Mail size={20} className="footer-glow-link group-hover:text-[#8b5cf6] transition-all duration-300" />
                                    <a
                                        href="mailto:admin@uwo24.com"
                                        className="footer-glow-link font-bold transition-all group-hover:translate-x-1 normal-case"
                                    >
                                        admin@uwo24.com
                                    </a>
                                </li>

                            </ul>
                        </div>
                    </div>

                    {/* Bottom */}
                    <div className={`pt-8 border-t text-sm font-bold text-center drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)] ${isDark ? 'border-white/10 footer-text-glow' : 'border-white/30 text-black'}`}>
                        {t('copyright')}<sup className="text-[10px] md:text-[0.5em] font-black ml-0.5 relative -top-[0.5em] md:-top-[0.7em]">TM</sup>. {t('allRightsReserved')}<sup className="text-[10px] md:text-[0.5em] font-black ml-0.5 relative -top-[0.5em] md:-top-[0.7em]">TM</sup>
                    </div>

                </div>
            </footer>
        </>
    );
};

export default Footer;
