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
    Moon,
    Type,
    Smartphone,
    Monitor,
    History,
    Lock,
    MapPin,
    AlertCircle,
    Info,
    Laptop,
    Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { AppRoute } from '../types';
import {
    getUserData,
    clearUser,
    themeState,
    fontSizeState,
    fontStyleState,
    chatHistoryState,
    userData,
    setUserData as saveToStorage
} from '../userStore/userData';
import { useRecoilState } from 'recoil';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Edit3, Camera, X, Check, Search } from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();
    const [userState, setUserRecoilState] = useRecoilState(userData);
    const user = userState.user || { name: 'User', email: 'user@example.com' };
    const [theme, setTheme] = useRecoilState(themeState);
    const isDark = theme === 'Dark';
    const { t } = useLanguage();

    // Editing State
    const [isEditing, setIsEditing] = React.useState(false);
    const [editForm, setEditForm] = React.useState({
        name: user.name,
        email: user.email,
        photo: user.photo || ''
    });

    const [previewImage, setPreviewImage] = React.useState(user.photo || null);

    // Typography State
    const [fontSize, setFontSize] = useRecoilState(fontSizeState);
    const [fontStyle, setFontStyle] = useRecoilState(fontStyleState);
    const [chatHistory, setChatHistory] = useRecoilState(chatHistoryState);

    // Dropdown States
    const [isFontSizeOpen, setIsFontSizeOpen] = React.useState(false);
    const [isFontStyleOpen, setIsFontStyleOpen] = React.useState(false);
    const [fontSearchQuery, setFontSearchQuery] = React.useState('');

    // Dynamic Device Detection
    const getDeviceInfo = () => {
        const ua = navigator.userAgent;
        let device = 'Unknown Device';
        let type = 'Browser';
        let browser = 'Unknown Browser';

        // Detect Browser
        if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Safari')) browser = 'Safari';
        else if (ua.includes('Edge')) browser = 'Edge';

        // Detect OS / Device
        if (ua.includes('Windows')) {
            device = `Chrome on Windows`;
            type = 'Laptop';
        } else if (ua.includes('Macintosh')) {
            device = `Safari on macOS`;
            type = 'Laptop';
        } else if (ua.includes('iPhone')) {
            device = 'iPhone';
            type = 'Mobile';
        } else if (ua.includes('Android')) {
            device = 'Android Device';
            type = 'Mobile';
        }

        return { device, type, browser };
    };

    // Device Activity State
    const [sessions, setSessions] = React.useState([]);

    React.useEffect(() => {
        const current = getDeviceInfo();
        setSessions([
            {
                id: Date.now(),
                device: current.device,
                type: current.type,
                location: 'Jabalpur, India', // This could ideally be fetched from a geo-IP API
                time: t('activeNow'),
                lastActive: t('currentlyOnline'),
                current: true
            }
        ]);
    }, []);

    const handleTerminateSession = (id) => {
        if (window.confirm(t('confirmLogoutDevice'))) {
            setSessions(prev => prev.filter(s => s.id !== id));
        }
    };

    const handleLogOutAll = () => {
        if (window.confirm(t('confirmLogoutAll'))) {
            setSessions(prev => prev.filter(s => s.current));
        }
    };

    // Sync form with user data when it changes externally
    React.useEffect(() => {
        if (!isEditing) {
            setEditForm({
                name: user.name,
                email: user.email,
                photo: user.photo || ''
            });
            setPreviewImage(user.photo || null);
        }
    }, [user, isEditing]);

    // Cross-Tab Sync
    React.useEffect(() => {
        const handleStorageSync = (e) => {
            if (e.key === 'user' && e.newValue) {
                try {
                    const newUser = JSON.parse(e.newValue);
                    setUserRecoilState({ user: newUser });
                } catch (err) {
                    console.error("Failed to sync user data across tabs", err);
                }
            }
        };
        window.addEventListener('storage', handleStorageSync);
        return () => window.removeEventListener('storage', handleStorageSync);
    }, [setUserRecoilState]);

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
    // previewImage state moved above for better scope management

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
                setEditForm(prev => ({ ...prev, photo: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        const updatedUser = {
            ...user,
            name: editForm.name,
            email: editForm.email,
            photo: editForm.photo || user.photo
        };
        saveToStorage(updatedUser);
        setUserRecoilState({ user: updatedUser });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditForm({
            name: user.name,
            email: user.email,
            photo: user.photo || ''
        });
        setPreviewImage(user.photo || null);
        setIsEditing(false);
    };

    // Persist settings
    React.useEffect(() => {
        localStorage.setItem('fontSize', fontSize);
    }, [fontSize]);

    React.useEffect(() => {
        localStorage.setItem('fontStyle', fontStyle);
    }, [fontStyle]);

    React.useEffect(() => {
        localStorage.setItem('chatHistory', chatHistory);
    }, [chatHistory]);

    return (
        <div className={`h-full flex flex-col bg-transparent p-4 md:p-8 lg:p-12 overflow-y-auto no-scrollbar relative transition-colors duration-700 ${isDark ? 'bg-[#1a2235]' : ''}`}>
            {/* Global Background (for consistency) */}
            {isDark && (
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a2235] via-[#242f49] to-[#1a2235]"></div>
                    <div className="absolute top-[-10%] right-[-10%] w-[60vmax] h-[60vmax] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
                </div>
            )}

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
            />
            <div className="max-w-5xl mx-auto w-full space-y-6 md:space-y-12 pb-24 animate-in fade-in slide-in-from-bottom duration-700 relative z-10">

                {/* Profile Header - High Fidelity Glass */}
                <div className={`flex flex-col md:flex-row items-center gap-6 md:gap-10 ${isDark ? 'bg-[#242f49] border-white/5 shadow-[0_40px_80px_rgba(0,0,0,0.5)]' : 'bg-white/40 border-white/60 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]'} backdrop-blur-3xl border p-5 md:p-10 lg:p-16 rounded-[32px] md:rounded-[64px] relative overflow-hidden group transition-all duration-700`}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-1000"></div>
                    <div className={`absolute top-0 right-0 w-64 h-64 ${isDark ? 'bg-[#8B5CF6]/10' : 'bg-[#8b5cf6]/5'} rounded-full blur-[100px] pointer-events-none`} />

                    <div className="relative group/avatar cursor-pointer" onClick={handleImageClick}>
                        <div className={`w-24 h-24 md:w-36 md:h-36 rounded-[32px] md:rounded-[48px] ${isDark ? 'bg-[#1a2235] border-white/10' : 'bg-white border-white/60'} p-2 border shadow-2xl relative z-10 transition-colors`}>
                            <div className="w-full h-full rounded-[24px] md:rounded-[40px] bg-gradient-to-br from-[#d946ef] to-[#8B5CF6] flex items-center justify-center text-white overflow-hidden shadow-inner relative">
                                {previewImage ? (
                                    <img src={previewImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="w-10 h-10 md:w-16 md:h-16" strokeWidth={1.5} />
                                )}
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                                    <span className="text-white text-xs font-bold uppercase tracking-wider">{t('change')}</span>
                                </div>
                            </div>
                        </div>
                        <div className={`absolute -bottom-2 -right-2 w-8 h-8 md:w-12 md:h-12 bg-emerald-500 border-4 md:border-8 ${isDark ? 'border-[#1a2235]' : 'border-white'} rounded-[16px] md:rounded-[20px] z-20 shadow-lg flex items-center justify-center transition-colors`}>
                            <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                        </div>
                    </div>

                    <div className="text-center md:text-left space-y-3 md:space-y-4 relative z-10 flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-2 flex-1">
                                {isEditing ? (
                                    <div className="space-y-4 max-w-md animate-in fade-in slide-in-from-left duration-500">
                                        <div className="relative group/input">
                                            <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/20' : 'text-gray-300'}`}>
                                                <UserIcon size={20} />
                                            </div>
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className={`w-full pl-12 pr-6 py-4 rounded-2xl ${isDark ? 'bg-[#1a2235] border-[#8B5CF6]/20 text-[#f1f5f9]' : 'bg-white border-gray-100 text-gray-900'} border-2 focus:border-[#8B5CF6] outline-none transition-all font-bold text-lg tracking-tight`}
                                                placeholder={t('enterName')}
                                            />
                                        </div>
                                        <div className="relative group/input">
                                            <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-white/20' : 'text-gray-300'}`}>
                                                <Mail size={20} />
                                            </div>
                                            <input
                                                type="email"
                                                value={editForm.email}
                                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                className={`w-full pl-12 pr-6 py-4 rounded-2xl ${isDark ? 'bg-[#1a2235] border-[#8B5CF6]/20 text-[#f1f5f9]' : 'bg-white border-gray-100 text-gray-900'} border-2 focus:border-[#8B5CF6] outline-none transition-all font-bold text-lg tracking-tight`}
                                                placeholder={t('enterEmail')}
                                            />
                                        </div>

                                        <div className="flex items-center gap-3 pt-2">
                                            <button
                                                onClick={handleSave}
                                                className={`flex-[2] flex items-center justify-center gap-2 py-3.5 rounded-2xl ${isDark ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 hover:bg-[#8B5CF6]/20' : 'bg-white border-[#8B5CF6]/10 hover:border-[#8B5CF6]'} border-2 text-[#8B5CF6] font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:scale-[1.02] active:scale-95 transition-all outline-none`}
                                            >
                                                <Check size={14} className="text-[#8B5CF6]" />
                                                {t('saveChanges')}
                                            </button>
                                            <button
                                                onClick={handleCancel}
                                                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border ${isDark ? 'bg-[#1a2235] border-white/10 text-[#cbd5e1] hover:text-[#f1f5f9] hover:border-white/20' : 'bg-white border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-200'}`}
                                            >
                                                <X size={14} />
                                                {t('cancel')}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h1 className={`text-3xl md:text-5xl lg:text-6xl font-black ${isDark ? 'text-[#f1f5f9]' : 'text-gray-900'} tracking-tighter leading-none transition-colors`}>{user.name}<span className="text-[#8B5CF6]">.</span></h1>
                                        <p className={`${isDark ? 'text-[#cbd5e1]' : 'text-gray-500'} font-bold text-xl tracking-tight opacity-70 transition-colors uppercase`}>{user.email}</p>
                                    </>
                                )}
                            </div>

                            {!isEditing && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className={`h-fit px-6 py-3 rounded-2xl border flex items-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${isDark ? 'bg-white/5 border-white/10 text-[#f1f5f9] hover:bg-[#8B5CF6] hover:border-[#8B5CF6]' : 'bg-white border-gray-100 text-gray-500 hover:border-[#8B5CF6] hover:text-[#8B5CF6] shadow-sm'}`}
                                >
                                    <Edit3 size={14} />
                                    {t('editProfile')}
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
                            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-[#1a2235] border-white/5 text-[#cbd5e1]' : 'bg-white/40 border-white/60 text-gray-400'} px-4 py-2 rounded-xl border transition-all`}>
                                <Clock size={12} className="text-[#8B5CF6]" />
                                Dec 2025
                            </div>
                            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${isDark ? 'bg-[#1a2235] border-white/5 text-[#cbd5e1]' : 'bg-white/40 border-white/60 text-gray-400'} px-4 py-2 rounded-xl border transition-all`}>
                                <Shield size={12} className="text-[#8B5CF6]" />
                                {t('shieldActive')}
                            </div>
                        </div>
                    </div>


                </div>


                <div className="space-y-6 md:space-y-12">
                    {/* Settings Card */}
                    <div className={`${isDark ? 'bg-[#242f49] border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.4)]' : 'bg-white/40 border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]'} backdrop-blur-3xl border rounded-[32px] md:rounded-[64px] p-5 md:p-12 space-y-8 md:space-y-12 transition-all duration-700 w-full`}>
                        <div className="flex items-center gap-4 md:gap-5">
                            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-[16px] md:rounded-[20px] ${isDark ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]/20' : 'bg-[#8b5cf6]/10 border-[#8b5cf6]/20'} flex items-center justify-center text-[#8B5CF6] border shadow-sm transition-colors`}>
                                <Settings size={18} className="md:w-6 md:h-6" />
                            </div>
                            <h2 className={`text-xl md:text-3xl font-black tracking-tight uppercase transition-colors ${isDark ? 'text-[#f1f5f9]' : 'text-gray-900'}`}>{t('settings')}</h2>
                        </div>

                        <div className="flex flex-col gap-6 w-full">

                            {/* Personalization Section */}
                            <div className="space-y-6 pt-10 border-t border-white/5">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
                                    <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${isDark ? 'text-[#6F76A8]' : 'text-gray-400'}`}>{t('personalization')}</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Font Size Selector */}
                                    <div className="flex flex-col gap-4">
                                        <div
                                            onClick={() => setIsFontSizeOpen(!isFontSizeOpen)}
                                            className={`flex justify-between items-center p-5 md:p-8 ${isDark ? 'bg-[#1a2235] border-white/5 hover:bg-[#242f49] hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]' : 'bg-white/40 border-white hover:bg-white hover:shadow-2xl'} border rounded-[28px] md:rounded-[32px] transition-all duration-500 cursor-pointer group`}
                                        >
                                            <div className="flex items-center gap-3 md:gap-6">
                                                <Type className={`w-5 h-5 md:w-6 md:h-6 ${isDark ? 'text-[#6F76A8] group-hover:text-[#8B5CF6]' : 'text-gray-300 group-hover:text-[#8b5cf6]'} transition-colors`} />
                                                <div className="flex flex-col">
                                                    <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-[#6F76A8]' : 'text-gray-400'}`}>{t('fontSize')}</span>
                                                    <span className={`text-xs md:text-base font-black uppercase tracking-tight ${isDark ? 'text-[#f1f5f9]' : 'text-gray-900'}`}>{fontSize}</span>
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: isFontSizeOpen ? 90 : 0 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            >
                                                <ChevronRight className={`w-4 h-4 md:w-5 md:h-5 ${isDark ? 'text-[#6F76A8]' : 'text-gray-200'} group-hover:text-[#8B5CF6]`} />
                                            </motion.div>
                                        </div>

                                        <AnimatePresence>
                                            {isFontSizeOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    className="flex flex-wrap gap-3 overflow-hidden"
                                                >
                                                    {['Small', 'Medium', 'Large', 'Extra Large'].map((size) => (
                                                        <button
                                                            key={size}
                                                            onClick={() => { setFontSize(size); setIsFontSizeOpen(false); }}
                                                            className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${fontSize === size
                                                                ? 'bg-[#8B5CF6] text-white shadow-xl shadow-purple-500/30'
                                                                : (isDark ? 'bg-[#1a2235] border-white/5 text-[#6F76A8] hover:border-[#8B5CF6]/40 hover:text-white' : 'bg-white/60 border-white text-gray-400 hover:border-[#8B5CF6]/40 hover:text-gray-900 shadow-sm')
                                                                } border`}
                                                        >
                                                            {size}
                                                        </button>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Font Style Selector */}
                                    <div className="flex flex-col gap-4">
                                        <div
                                            onClick={() => setIsFontStyleOpen(!isFontStyleOpen)}
                                            className={`flex justify-between items-center p-5 md:p-8 ${isDark ? 'bg-[#1a2235] border-white/5 hover:bg-[#242f49] hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]' : 'bg-white/40 border-white hover:bg-white hover:shadow-2xl'} border rounded-[28px] md:rounded-[32px] transition-all duration-500 cursor-pointer group`}
                                        >
                                            <div className="flex items-center gap-3 md:gap-6">
                                                <Monitor className={`w-5 h-5 md:w-6 md:h-6 ${isDark ? 'text-[#6F76A8] group-hover:text-[#8B5CF6]' : 'text-gray-300 group-hover:text-[#8b5cf6]'} transition-colors`} />
                                                <div className="flex flex-col">
                                                    <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-[#6F76A8]' : 'text-gray-400'}`}>{t('typography')}</span>
                                                    <span className={`text-xs md:text-base font-black uppercase tracking-tight ${isDark ? 'text-[#f1f5f9]' : 'text-gray-900'}`}>{fontStyle}</span>
                                                </div>
                                            </div>
                                            <motion.div
                                                animate={{ rotate: isFontStyleOpen ? 90 : 0 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            >
                                                <ChevronRight className={`w-4 h-4 md:w-5 md:h-5 ${isDark ? 'text-[#6F76A8]' : 'text-gray-200'} group-hover:text-[#8B5CF6]`} />
                                            </motion.div>
                                        </div>

                                        <AnimatePresence>
                                            {isFontStyleOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                    className="flex flex-col gap-4 overflow-hidden"
                                                >
                                                    {/* Font Search Bar */}
                                                    <div className="relative group/search-font">
                                                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-[#6F76A8]' : 'text-gray-400'} group-focus-within/search-font:text-[#8B5CF6] transition-colors`} />
                                                        <input
                                                            type="text"
                                                            placeholder={t('searchFonts')}
                                                            value={fontSearchQuery}
                                                            onChange={(e) => setFontSearchQuery(e.target.value)}
                                                            className={`w-full pl-10 pr-4 py-3 rounded-2xl ${isDark ? 'bg-[#242f49] border-white/5 text-[#f1f5f9]' : 'bg-white border-gray-100 text-gray-900'} border-2 focus:border-[#8B5CF6] outline-none transition-all font-bold text-xs uppercase tracking-widest shadow-sm`}
                                                        />
                                                    </div>

                                                    {/* Scrollable Font Grid */}
                                                    <div className="max-h-[240px] overflow-y-auto pr-2 no-scrollbar">
                                                        <div className="flex flex-wrap gap-2 md:gap-3">
                                                            {[
                                                                'Inter', 'Times New Roman', 'California', 'Poppins', 'Roboto', 'Georgia',
                                                                'Arial', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Impact', 'Courier New', 'Garamond'
                                                            ]
                                                                .filter(font => font.toLowerCase().includes(fontSearchQuery.toLowerCase()))
                                                                .map((font) => (
                                                                    <motion.button
                                                                        key={font}
                                                                        whileHover={{ scale: 1.05 }}
                                                                        whileTap={{ scale: 0.95 }}
                                                                        onClick={() => { setFontStyle(font); setIsFontStyleOpen(false); }}
                                                                        className={`px-6 py-4 rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all relative overflow-hidden flex-grow md:flex-grow-0 min-w-[140px] ${fontStyle === font
                                                                            ? 'bg-[#8B5CF6] text-white shadow-[0_15px_30px_rgba(139,92,246,0.5)] border-[#8B5CF6] scale-105 z-10'
                                                                            : (isDark ? 'bg-[#1a2235] border-white/10 text-white/50 hover:bg-[#242f49] hover:text-white hover:border-[#8B5CF6]/40' : 'bg-white border-gray-100 text-gray-400 hover:border-[#8B5CF6]/40 hover:text-gray-900 shadow-sm')
                                                                            } border-2`}
                                                                        style={{ fontFamily: font === 'California' ? 'Apple Garamond, Baskerville, serif' : font }}
                                                                    >
                                                                        {fontStyle === font && (
                                                                            <motion.div
                                                                                layoutId="font-active-glow"
                                                                                className="absolute inset-0 bg-white/10"
                                                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                                            />
                                                                        )}
                                                                        {font}
                                                                    </motion.button>
                                                                ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            {/* Privacy & Security Section */}
                            <div className="space-y-8 pt-10 border-t border-white/5">
                                <div className="flex items-center gap-3">
                                    <Lock className="w-5 h-5 text-[#8B5CF6]" />
                                    <h3 className={`text-sm font-black uppercase tracking-[0.2em] ${isDark ? 'text-[#6F76A8]' : 'text-gray-400'}`}>{t('privacySecurity')}</h3>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {/* Chat History Toggle */}
                                    <div className={`flex flex-col items-center sm:flex-row justify-between p-6 md:p-8 gap-6 ${isDark ? 'bg-[#1a2235] border-white/5 shadow-inner' : 'bg-white/40 border-white'} border rounded-[28px] md:rounded-[32px] group text-center sm:text-left`}>
                                        <div className="flex flex-col items-center sm:items-center sm:flex-row gap-4 md:gap-6">
                                            <div className={`p-3 rounded-2xl ${isDark ? 'bg-[#8B5CF6]/20' : 'bg-[#8B5CF6]/10'} shrink-0`}>
                                                <History className="w-5 h-5 md:w-6 md:h-6 text-[#8B5CF6]" />
                                            </div>
                                            <div className="flex flex-col items-center sm:items-start">
                                                <span className={`text-sm md:text-base font-black tracking-tight ${isDark ? 'text-[#f1f5f9]' : 'text-gray-900'}`}>{t('chatHistoryTitle')}</span>
                                                <span className={`text-[10px] md:text-[11px] font-bold ${isDark ? 'text-[#6F76A8]' : 'text-gray-400'}`}>{t('chatHistoryDesc')}</span>
                                            </div>
                                        </div>
                                        <div
                                            onClick={() => setChatHistory(prev => prev === 'ON' ? 'OFF' : 'ON')}
                                            className={`relative w-16 h-8 md:w-20 md:h-10 p-1 rounded-full cursor-pointer transition-colors duration-500 shrink-0 ${chatHistory === 'ON' ? 'bg-[#8B5CF6]' : (isDark ? 'bg-gray-800' : 'bg-gray-200 shadow-inner')}`}
                                        >
                                            <motion.div
                                                animate={{ x: chatHistory === 'ON' ? (window.innerWidth >= 768 ? 40 : 32) : 0 }}
                                                className="w-6 h-6 md:w-8 md:h-8 bg-white rounded-full shadow-lg flex items-center justify-center font-black text-[8px] md:text-[10px] text-black"
                                            >
                                                {chatHistory === 'ON' ? 'ON' : 'OFF'}
                                            </motion.div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between gap-2 pl-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Monitor className={`w-4 h-4 ${isDark ? 'text-[#6F76A8]' : 'text-gray-400'}`} />
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-[#6F76A8]' : 'text-gray-400'}`}>{t('deviceActivity')}</span>
                                        </div>
                                        <button
                                            onClick={handleLogOutAll}
                                            className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${isDark ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-red-50 border-red-100 text-red-500 hover:bg-red-600 hover:text-white hover:shadow-lg'} border shadow-sm active:scale-95`}
                                        >
                                            {t('logOutAll')}
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {sessions.map((session) => (
                                            <div
                                                key={session.id}
                                                className={`group p-5 md:p-8 flex flex-col sm:flex-row items-center sm:items-center justify-between border rounded-[28px] md:rounded-[36px] transition-all duration-500 relative overflow-hidden gap-6 ${isDark
                                                    ? 'bg-[#1a2235]/60 border-white/5 hover:bg-[#242f49] hover:border-[#8B5CF6]/30 shadow-2xl'
                                                    : 'bg-white/60 border-white hover:bg-white hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)]'
                                                    }`}
                                            >
                                                {/* Background Glow Effect */}
                                                <div className={`absolute top-0 right-0 w-32 h-32 blur-[50px] transition-opacity duration-700 opacity-0 group-hover:opacity-10 ${isDark ? 'bg-[#8B5CF6]/10' : 'bg-purple-100/50'}`} />

                                                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 md:gap-8 relative z-10 w-full sm:w-auto text-center sm:text-left">
                                                    <div className={`w-12 h-12 md:w-16 md:h-16 rounded-[18px] md:rounded-[22px] flex items-center justify-center transition-all duration-500 shrink-0 ${isDark
                                                        ? 'bg-[#242f49] text-white border-white/10 group-hover:bg-[#8B5CF6] group-hover:text-white'
                                                        : 'bg-white text-gray-900 border-gray-100 group-hover:bg-gradient-to-br group-hover:from-[#ec4899] group-hover:to-[#8b5cf6] group-hover:text-white group-hover:shadow-lg'
                                                        } border`}>
                                                        {session.type === 'Laptop' ? <Laptop size={20} className="md:w-6 md:h-6" /> : session.type === 'Mobile' ? <Smartphone size={20} className="md:w-6 md:h-6" /> : <Globe size={20} className="md:w-6 md:h-6" />}
                                                    </div>
                                                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 md:gap-3">
                                                            <span className={`text-sm md:text-lg font-black tracking-tight ${isDark ? 'text-[#f1f5f9]' : 'text-gray-900'} truncate`}>{session.device}</span>
                                                            {session.current && (
                                                                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[7px] md:text-[8px] font-black uppercase tracking-widest shadow-[0_4px_10px_rgba(16,185,129,0.3)] animate-pulse">{t('live')}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-[9px] md:text-[12px] font-bold transition-colors">
                                                            <span className={`flex items-center gap-1.5 ${isDark ? 'text-[#6F76A8]' : 'text-gray-400'}`}>
                                                                <MapPin size={10} className="text-[#8B5CF6] md:w-3 md:h-3" />
                                                                {session.location}
                                                            </span>
                                                            <span className={`hidden sm:block w-1 h-1 rounded-full ${isDark ? 'bg-slate-700' : 'bg-gray-200'}`} />
                                                            <span className={`${isDark ? 'text-[#8B5CF6]' : 'text-[#8B5CF6]'}`}>{session.time}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {!session.current && (
                                                    <button
                                                        onClick={() => handleTerminateSession(session.id)}
                                                        className={`w-full sm:w-auto p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all relative z-10 flex items-center justify-center gap-2 font-black text-[9px] uppercase tracking-widest ${isDark
                                                            ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white shadow-lg shadow-red-500/10 border border-red-500/20'
                                                            : 'bg-red-50 hover:bg-red-500 text-red-500 hover:text-white shadow-[0_8px_20px_rgba(239,68,68,0.1)]'
                                                            }`}
                                                    >
                                                        <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                                                        <span className="sm:hidden">Terminate Session</span>
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
