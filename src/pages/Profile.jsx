import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CircleUser,
    Settings,
    Shield,
    Clock,
    Star,
    Infinity,
    ChevronRight,
    LogOut,
    User as UserIcon,
    Globe,
    Zap,
    IndianRupee,
    LayoutGrid,
    Sparkles,
    Sun,
    Moon
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { AppRoute } from '../types';
import { getUserData, clearUser, themeState } from '../userStore/userData';
import { useRecoilState } from 'recoil';
import { useLanguage } from '../context/LanguageContext';

const Profile = () => {
    const navigate = useNavigate();
    const user = getUserData() || { name: 'User', email: 'user@example.com' };
    const [theme, setTheme] = useRecoilState(themeState);
    const isDark = theme === 'Dark';
    const { t, language, setLanguage, languages } = useLanguage();
    const [isLanguageOpen, setIsLanguageOpen] = React.useState(false);

    React.useEffect(() => {
        // If admin, redirect to admin settings
        const isAdmin = user.role === 'admin' || user.role === 'Admin' || user.email === 'admin@uwo24.com';
        if (isAdmin) {
            navigate(AppRoute.SETTINGS);
            return;
        }

        localStorage.setItem('theme', theme);
        if (isDark) {
            document.documentElement.classList.add('dark');
            document.body.style.background = '#0B0F1A';
        } else {
            document.documentElement.classList.remove('dark');
            document.body.style.background = 'linear-gradient(120deg, #E0C3FC 0%, #8EC5FC 100%)';
        }
    }, [theme, isDark]);


    const handleLogout = () => {
        clearUser();
        navigate(AppRoute.LANDING);
    };

    const fileInputRef = React.useRef(null);
    const [previewImage, setPreviewImage] = React.useState(null);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                // In a real app, upload logic here
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="h-full flex flex-col bg-transparent p-4 md:p-8 lg:p-12 overflow-y-auto no-scrollbar relative">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
            />
            <div className="max-w-5xl mx-auto w-full space-y-6 md:space-y-12 pb-24 animate-in fade-in slide-in-from-bottom duration-700">

                {/* Profile Header - High Fidelity Glass */}
                <div className={`flex flex-col md:flex-row items-center gap-6 md:gap-10 ${isDark ? 'bg-[#161D35] border-[#8B5CF6]/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]' : 'bg-white/40 border-white/60 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]'} backdrop-blur-3xl border p-6 md:p-10 lg:p-16 rounded-[40px] md:rounded-[64px] relative overflow-hidden group transition-all duration-700`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                    <div className={`absolute top-0 right-0 w-64 h-64 ${isDark ? 'bg-[#8B5CF6]/10' : 'bg-[#8b5cf6]/5'} rounded-full blur-[100px] pointer-events-none`} />

                    <div className="relative group/avatar cursor-pointer" onClick={handleImageClick}>
                        <div className={`w-24 h-24 md:w-36 md:h-36 rounded-[32px] md:rounded-[48px] ${isDark ? 'bg-[#0B0F1A] border-white/10' : 'bg-white border-white/60'} p-2 border shadow-2xl relative z-10 transition-colors`}>
                            <div className="w-full h-full rounded-[24px] md:rounded-[40px] bg-gradient-to-br from-[#d946ef] to-[#8B5CF6] flex items-center justify-center text-white overflow-hidden shadow-inner relative">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="w-10 h-10 md:w-16 md:h-16" strokeWidth={1.5} />
                                )}
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-bold uppercase tracking-wider">Change</span>
                                </div>
                            </div>
                        </div>
                        <div className={`absolute -bottom-2 -right-2 w-8 h-8 md:w-12 md:h-12 bg-emerald-500 border-4 md:border-8 ${isDark ? 'border-[#0B0F1A]' : 'border-white'} rounded-[16px] md:rounded-[20px] z-20 shadow-lg flex items-center justify-center transition-colors`}>
                            <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-3 md:space-y-4 relative z-10">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                            <h1 className={`text-3xl md:text-5xl lg:text-6xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tighter leading-none transition-colors`}>{user.name}<span className="text-[#8B5CF6]">.</span></h1>
                        </div>
                        <p className={`${isDark ? 'text-white' : 'text-gray-500'} font-bold text-xl tracking-tight opacity-70 transition-colors`}>{user.email}</p>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-[#0B0F1A] border-white/5 text-white/70' : 'bg-white/40 border-white/60 text-gray-400'} px-4 py-2 rounded-xl border transition-all`}>
                                <Clock size={12} className="text-[#8B5CF6]" />
                                Dec 2025
                            </div>
                            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-[#0B0F1A] border-white/5 text-white/70' : 'bg-white/40 border-white/60 text-gray-400'} px-4 py-2 rounded-xl border transition-all`}>
                                <Shield size={12} className="text-[#8B5CF6]" />
                                Shield Active
                            </div>
                        </div>
                    </div>


                </div>


                <div className="space-y-6 md:space-y-12">
                    {/* Settings Card */}
                    <div className={`${isDark ? 'bg-[#161D35] border-[#8B5CF6]/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)]' : 'bg-white/40 border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]'} backdrop-blur-3xl border rounded-[40px] md:rounded-[64px] p-6 md:p-12 space-y-8 md:space-y-12 transition-all duration-700 w-full`}>
                        <div className="flex items-center gap-4 md:gap-5">
                            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-[16px] md:rounded-[20px] ${isDark ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]/20' : 'bg-[#8b5cf6]/10 border-[#8b5cf6]/20'} flex items-center justify-center text-[#8B5CF6] border shadow-sm transition-colors`}>
                                <Settings size={18} className="md:w-6 md:h-6" />
                            </div>
                            <h2 className={`text-xl md:text-3xl font-black tracking-tight uppercase transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>{t('settings')}</h2>
                        </div>

                        <div className="flex flex-col gap-6 w-full">
                            <div className="flex flex-col md:flex-row gap-6 w-full">
                                {/* Language Selector */}
                                <div className="flex-1 flex flex-col gap-4">
                                    <div
                                        onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                                        className={`flex justify-between items-center p-4 md:p-8 ${isDark ? 'bg-[#0B0F1A] border-white/5 hover:bg-[#12182B] hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]' : 'bg-white/40 border-white hover:bg-white hover:shadow-2xl'} border rounded-[24px] md:rounded-[32px] hover:-translate-y-1 transition-all duration-500 cursor-pointer group`}
                                    >
                                        <div className="flex items-center gap-4 md:gap-6">
                                            <Globe className={`w-5 h-5 md:w-6 md:h-6 ${isDark ? 'text-white/40 group-hover:text-[#8B5CF6]' : 'text-gray-300 group-hover:text-[#8b5cf6]'} transition-colors`} />
                                            <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-gray-400'}`}>{t('language')}</span>
                                        </div>
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <span className={`text-xs md:text-sm font-black uppercase tracking-tight text-right transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>{languages[language]?.title}</span>
                                            <motion.div
                                                animate={{ rotate: isLanguageOpen ? 90 : 0 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            >
                                                <ChevronRight className={`w-4 h-4 md:w-5 md:h-5 ${isDark ? 'text-white/20' : 'text-gray-200'} group-hover:text-[#8B5CF6]`} />
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Expandable Language List */}
                                    <AnimatePresence>
                                        {isLanguageOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden no-scrollbar flex flex-col gap-2"
                                            >
                                                {Object.entries(languages).map(([key, langInfo]) => (
                                                    <motion.div
                                                        key={key}
                                                        onClick={() => {
                                                            setLanguage(key);
                                                            setIsLanguageOpen(false);
                                                        }}
                                                        whileHover={{ x: 10 }}
                                                        className={`p-4 md:p-6 rounded-[20px] md:rounded-[24px] flex items-center justify-between cursor-pointer border transition-all ${language === key
                                                                ? (isDark ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]/30 text-white shadow-lg' : 'bg-white border-[#8B5CF6]/20 text-[#8B5CF6] shadow-md')
                                                                : (isDark ? 'bg-[#0B0F1A]/50 border-white/5 text-white/60 hover:text-white' : 'bg-white/20 border-white/40 text-gray-500 hover:text-gray-900')
                                                            }`}
                                                    >
                                                        <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{langInfo.title}</span>
                                                        {language === key && <Zap size={14} className="text-[#8B5CF6] fill-[#8B5CF6]" />}
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Mode Selector */}
                                <div
                                    onClick={() => setTheme(prev => prev === 'Light' ? 'Dark' : 'Light')}
                                    className={`flex-1 flex justify-between items-center p-4 md:p-8 ${isDark ? 'bg-[#0B0F1A] border-white/5 hover:bg-[#12182B] hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]' : 'bg-white/40 border-white hover:bg-white hover:shadow-2xl'} border rounded-[24px] md:rounded-[32px] hover:-translate-y-1 transition-all duration-500 cursor-pointer group h-fit`}
                                >
                                    <div className="flex items-center gap-4 md:gap-6">
                                        {theme === 'Light' ? <Sun className={`w-5 h-5 md:w-6 md:h-6 ${isDark ? 'text-white/40' : 'text-gray-300 group-hover:text-[#8b5cf6]'} transition-colors`} /> : <Moon className={`w-5 h-5 md:w-6 md:h-6 ${isDark ? 'text-white/40 group-hover:text-[#8B5CF6]' : 'text-gray-300'} transition-colors`} />}
                                        <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white' : 'text-gray-400'}`}>{t('mode')}</span>
                                    </div>
                                    <div className={`flex items-center gap-2 ${isDark ? 'bg-[#0B0F1A]' : 'bg-gray-100'} rounded-full p-1 border ${isDark ? 'border-white/10' : 'border-gray-200'} transition-colors`}>
                                        <div className={`px-4 md:px-5 py-1.5 rounded-full text-[9px] md:text-[10px] font-black transition-all ${theme === 'Light' ? 'bg-[#8B5CF6] text-white shadow-lg' : 'text-gray-400'}`}>{t('light')}</div>
                                        <div className={`px-4 md:px-5 py-1.5 rounded-full text-[9px] md:text-[10px] font-black transition-all ${theme === 'Dark' ? 'bg-[#8B5CF6] text-white shadow-lg' : 'text-gray-400'}`}>{t('dark')}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className={`w-full py-5 md:py-8 ${isDark ? 'bg-red-950/20 text-red-400 border-red-500/20 hover:bg-red-500 hover:text-white hover:shadow-red-500/20' : 'bg-red-50 text-red-500 border-red-500/10 hover:bg-red-500 hover:text-white hover:shadow-red-500/30'} border rounded-[32px] md:rounded-[40px] font-black text-xs uppercase tracking-[0.3em] shadow-sm transition-all flex items-center justify-center gap-4 active:scale-95 group duration-500`}
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        {t('signOut')}
                    </button>
                </div>


            </div>
        </div>
    );
};

export default Profile;
