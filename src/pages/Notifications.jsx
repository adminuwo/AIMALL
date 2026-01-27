import React, { useEffect, useState } from 'react';
import { Bell, Check, Trash2, Clock, ShieldAlert, BadgeInfo, BadgeCheck, Sparkles, X, Activity, Zap, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { apis } from '../types';
import { getUserData, notificationState } from '../userStore/userData';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilState, useRecoilValue } from 'recoil';
import { themeState } from '../userStore/userData';
import { useLanguage } from '../context/LanguageContext';

const Notifications = () => {
    const navigate = useNavigate();
    const theme = useRecoilValue(themeState);
    const isDark = theme === 'Dark';
    const { t } = useLanguage();
    const [notifications, setNotifications] = useRecoilState(notificationState);
    const [loading, setLoading] = useState(true);
    const [appIcons, setAppIcons] = useState({});
    const token = getUserData()?.token;

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get(apis.notifications, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    timeout: 5000
                });
                setNotifications(res.data);
            } catch (err) {
                console.error('Error fetching notifications:', err);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchNotifications();
        }
    }, [token]);

    useEffect(() => {
        const fetchAppIcons = async () => {
            const uniqueTargetIds = [...new Set(notifications.filter(n => n.targetId).map(n => n.targetId))];
            const icons = {};

            for (const targetId of uniqueTargetIds) {
                try {
                    const res = await axios.get(`${apis.agents}/${targetId}`);
                    if (res.data && res.data.avatar) {
                        icons[targetId] = res.data.avatar;
                    }
                } catch (err) {
                    console.error(`Failed to fetch icon for ${targetId}:`, err);
                }
            }
            setAppIcons(icons);
        };

        if (notifications.length > 0) {
            fetchAppIcons();
        }
    }, [notifications]);

    const markAsRead = async (id) => {
        try {
            // Optimistically update the UI immediately
            setNotifications(prevNotifications =>
                prevNotifications.map(n => n._id === id ? { ...n, isRead: true } : n)
            );

            // Then sync with backend
            await axios.put(`${apis.notifications}/${id}/read`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error('Error marking as read:', err);
            // If backend fails, revert the change
            setNotifications(prevNotifications =>
                prevNotifications.map(n => n._id === id ? { ...n, isRead: false } : n)
            );
        }
    };

    const deleteNotification = async (id) => {
        try {
            // Optimistically remove from UI immediately
            const previousNotifications = notifications;
            setNotifications(prevNotifications => prevNotifications.filter(n => n._id !== id));

            // Then sync with backend
            await axios.delete(`${apis.notifications}/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (err) {
            console.error('Error deleting notification:', err);
            // If backend fails, restore the notifications
            setNotifications(notifications);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'ALERT': return <ShieldAlert className="w-7 h-7 text-red-500" />;
            case 'SUCCESS': return <BadgeCheck className="w-7 h-7 text-emerald-500" />;
            default: return <BadgeInfo className="w-7 h-7 text-[#8b5cf6]" />;
        }
    };

    const filteredNotifications = notifications
        .filter(notif => {
            // Support replies should always be shown
            if (notif.title === 'New Support Reply') return true;

            const isVendorNotification =
                notif.message.includes('Congratulations!') ||
                notif.message.includes('approved') ||
                notif.message.includes('rejected') ||
                notif.message.includes('good work');
            return !isVendorNotification;
        });

    return (
        <div className={`p-4 md:p-8 lg:p-12 h-screen overflow-y-auto no-scrollbar bg-transparent relative transition-colors duration-700 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {/* Decorative Background Glows */}
            <div className={`absolute top-0 left-1/4 w-[600px] h-[600px] ${isDark ? 'bg-purple-900/10' : 'bg-[#8b5cf6]/5'} rounded-full blur-[120px] pointer-events-none animate-pulse`} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-5xl mx-auto relative z-10"
            >
                <div className="mb-10 md:mb-16">
                    <h1 className={`text-3xl md:text-5xl lg:text-7xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tighter mb-4 md:mb-6 leading-none transition-colors`}>{t('notificationsHeading')}<span className="text-[#8B5CF6]">.</span></h1>
                    <p className={`${isDark ? 'text-white' : 'text-gray-500'} font-bold text-lg md:text-xl tracking-tight max-w-2xl opacity-70 transition-colors`}>{t('notificationsDesc')}</p>
                </div>

                <div className="grid gap-6 md:gap-8">
                    <AnimatePresence mode='popLayout'>
                        {filteredNotifications.length === 0 && !loading && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`${isDark ? 'bg-[#161D35] border-[#8B5CF6]/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]' : 'bg-white/40 border-white/60 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)]'} backdrop-blur-3xl p-10 md:p-24 rounded-[48px] md:rounded-[64px] border text-center relative overflow-hidden transition-all duration-700`}
                            >
                                <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#8B5CF6]/5 to-transparent' : 'bg-gradient-to-br from-[#8b5cf6]/5 to-transparent'}`} />
                                <div className={`w-24 h-24 rounded-[36px] ${isDark ? 'bg-[#0B0F1A]' : 'bg-white'} flex items-center justify-center text-[#8B5CF6] mx-auto mb-10 shadow-2xl border ${isDark ? 'border-white/5' : 'border-white/60'} relative z-10 transition-colors`}>
                                    <Bell className="w-10 h-10 opacity-30 animate-pulse" />
                                </div>
                                <h3 className={`text-2xl md:text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tight mb-4 relative z-10 uppercase transition-colors`}>{t('noNotificationsTitle')}</h3>
                                <p className={`${isDark ? 'text-white' : 'text-gray-500'} font-bold text-base md:text-lg max-w-sm mx-auto relative z-10 leading-relaxed transition-colors opacity-80`}>{t('noNotificationsDesc')}</p>
                            </motion.div>
                        )}

                        {filteredNotifications.map((notif, idx) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
                                key={notif._id}
                                className={`${isDark ? 'bg-[#161D35] shadow-[0_20px_40px_rgba(0,0,0,0.3)]' : 'bg-white/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.02)]'} backdrop-blur-3xl p-3 md:p-10 rounded-2xl md:rounded-[56px] border transition-all flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-10 hover:shadow-[0_40px_80px_-20px_rgba(139,92,246,0.15)] group relative overflow-hidden ${!notif.isRead ? (isDark ? 'border-[#8B5CF6]/40 ring-1 ring-[#8B5CF6]/10' : 'border-[#8b5cf6]/40 ring-1 ring-[#8b5cf6]/10') : (isDark ? 'border-white/5' : 'border-white/60')
                                    }`}
                            >
                                {!notif.isRead && (
                                    <div className="absolute top-0 left-0 w-2 h-full bg-[#8B5CF6]" />
                                )}

                                {notif.title === 'New Support Reply' && (
                                    <div
                                        className="absolute inset-0 cursor-pointer z-[1] hover:bg-black/5 transition-colors"
                                        onClick={() => navigate('/dashboard/admin-support')}
                                    />
                                )}

                                <div className={`w-10 h-10 md:w-20 md:h-20 shrink-0 rounded-xl md:rounded-[32px] flex items-center justify-center shadow-2xl border ${isDark ? 'border-white/5' : 'border-white'} transition-all duration-700 group-hover:rotate-6 ${notif.type === 'ALERT' ? (isDark ? 'bg-red-900/20' : 'bg-red-50') :
                                    notif.type === 'SUCCESS' ? (isDark ? 'bg-emerald-900/20' : 'bg-emerald-50') : (isDark ? 'bg-[#0B0F1A]' : 'bg-white')
                                    }`}>
                                    {appIcons[notif.targetId] ? (
                                        <img src={appIcons[notif.targetId]} alt="App" className="w-8 h-8 md:w-12 md:h-12 rounded-[12px] md:rounded-[20px] object-cover shadow-sm" />
                                    ) : (
                                        <div className="scale-75 md:scale-100">{getIcon(notif.type)}</div>
                                    )}
                                </div>

                                <div className="flex-1 space-y-3 md:space-y-4 w-full">
                                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-2 md:gap-4">
                                        <div className="space-y-1 text-center md:text-left">
                                            <div className="flex items-center gap-3 justify-center md:justify-start">
                                                <h3 className={`text-lg md:text-2xl font-black tracking-tight uppercase transition-colors ${!notif.isRead ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-white/60' : 'text-gray-500')}`}>
                                                    {notif.title}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-2 justify-center md:justify-start">
                                            </div>
                                        </div>
                                        <div className={`flex items-center gap-2 md:gap-3 ${isDark ? 'bg-[#0B0F1A]' : 'bg-white/60'} px-3 md:px-5 py-1.5 md:py-2 rounded-xl md:rounded-2xl border ${isDark ? 'border-white/5' : 'border-white/80'} shadow-sm transition-colors`}>
                                            <Clock className="w-3 h-3 md:w-4 md:h-4 text-[#8B5CF6]" />
                                            <span className={`text-[10px] font-black ${isDark ? 'text-white/70' : 'text-gray-900'} uppercase tracking-widest transition-colors`}>
                                                {new Date(notif.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                                            </span>
                                        </div>
                                    </div>

                                    <p className={`text-sm md:text-lg font-bold leading-relaxed max-w-3xl text-center md:text-left transition-colors ${!notif.isRead ? (isDark ? 'text-white' : 'text-gray-600') : (isDark ? 'text-white/60' : 'text-gray-400')}`}>
                                        {notif.message}
                                    </p>

                                    <div className="flex flex-row items-center gap-2 md:gap-8 pt-2 md:pt-4 relative z-10 w-full">
                                        {!notif.isRead && (
                                            <button
                                                onClick={() => markAsRead(notif._id)}
                                                className={`w-fit md:w-auto text-xs md:text-[11px] font-black text-[#8B5CF6] flex items-center justify-center gap-2 md:gap-3 uppercase tracking-[0.2em] hover:bg-[#8B5CF6] hover:text-white px-3 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl transition-all shadow-sm border ${isDark ? 'border-[#8B5CF6]/20 bg-[#161D35]' : 'border-[#8b5cf6]/20 bg-white'}`}
                                            >
                                                <BadgeCheck className="w-4 h-4" /> Mark as Read
                                            </button>
                                        )}

                                        <button
                                            onClick={() => deleteNotification(notif._id)}
                                            className="w-fit md:w-auto text-xs md:text-[11px] font-black text-red-500 flex items-center justify-center gap-2 md:gap-3 uppercase tracking-[0.2em] px-3 py-2 md:px-6 md:py-3 rounded-xl md:rounded-2xl transition-all relative group/btn overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-red-500 opacity-0 group-hover/btn:opacity-10 transition-opacity" />
                                            <Trash2 className="w-4 h-4" /> Delete
                                        </button>

                                        <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hidden md:flex">
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <div className="flex flex-col items-center justify-center p-20 gap-6">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full border-4 border-[#8B5CF6]/10 border-t-[#8B5CF6] animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Zap size={24} className="text-[#8B5CF6] animate-pulse" />
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-[#8B5CF6] uppercase tracking-[0.4em] animate-pulse">Syncing Nexus Data...</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Notifications;
