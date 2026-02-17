import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutGrid,
  MessageSquare,
  ShoppingBag,
  Bot,
  Settings,
  LogOut,
  X,
  FileText,
  Bell,
  DollarSign,
  HelpCircle,
  ChevronDown,
  User as UserIcon,
  ShieldAlert,
  Loader2,
  CheckCircle,
  Zap
} from 'lucide-react';
import { apis, AppRoute } from '../../types';
import { faqs } from '../../constants';
import NotificationBar from '../NotificationBar/NotificationBar.jsx';
import { clearUser, getUserData, toggleState, userData, notificationState, themeState } from '../../userStore/userData';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useLanguage } from '../../context/LanguageContext';
import axios from 'axios';
import apiService from '../../services/apiService';

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifiyTgl, setNotifyTgl] = useRecoilState(toggleState);

  // User Data & Role Logic
  const [currentUserData] = useRecoilState(userData);
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const user = (isLoggedIn && currentUserData?.user) ? currentUserData.user : { name: t('guest') || "Guest", email: "", role: "guest" };
  const userRole = (user.role === 'admin' || user.role === 'Admin') ? 'admin' : user.role;
  // Check both role and email for admin access, but ONLY if logged in
  const isAdminView = isLoggedIn && (userRole === 'admin' || user.email === 'admin@uwo24.com');
  const theme = useRecoilValue(themeState);
  const isDark = theme === 'Dark';

  // Debug: Log user info only in non-production or when needed
  // console.log('🔍 Sidebar Debug:', { email: user.email, role: user.role, userRole, isAdminView });

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [notifications, setNotifications] = useRecoilState(notificationState);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const [issueText, setIssueText] = useState("");
  const [activeTab, setActiveTab] = useState("faq");
  const [issueType, setIssueType] = useState("General Inquiry");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const issueOptionsMap = {
    "General Inquiry": "inquiryGeneral",
    "Payment Issue": "inquiryPayment",
    "Refund Request": "inquiryRefund",
    "Technical Support": "inquiryTechnical",
    "Account Access": "inquiryAccount",
    "Other": "inquiryOther"
  };

  const issueOptions = [
    "General Inquiry",
    "Payment Issue",
    "Refund Request",
    "Technical Support",
    "Account Access",
    "Other"
  ];

  const handleSupportSubmit = async () => {
    if (!issueText.trim()) return;

    setIsSending(true);
    setSendStatus(null);

    try {
      // Use the Reports system instead of SupportChat
      await apiService.submitReport({
        type: issueType,
        description: issueText,
        priority: 'medium'
      });

      setSendStatus('success');
      setIssueText("");
      setTimeout(() => {
        setSendStatus(null);
        setIsFaqOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Support submission failed", error);
      setSendStatus('error');
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = () => {
    setNotifications([]);
    localStorage.clear();
    navigate(AppRoute.LANDING);
  };

  // token already declared at line 40

  useEffect(() => {
    if (!token || location.pathname === AppRoute.LOGIN) {
      setNotifications([]);
      return;
    }

    const fetchUserData = async () => {
      try {
        await axios.get(apis.user, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) {
        console.error("User fetch failed", err);
        if (err.response?.status === 401) {
          clearUser();
          navigate(AppRoute.LOGIN);
        }
      }
    };

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(apis.notifications, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Notifications fetch failed", err);
      }
    };

    fetchUserData();
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30 * 1000);
    return () => clearInterval(interval);
  }, [token, location.pathname, navigate, setNotifications]);

  // Close FAQ modal on navigation change
  useEffect(() => {
    setIsFaqOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (notifiyTgl?.notify) {
      const timer = setTimeout(() => {
        setNotifyTgl(prev => ({ ...prev, notify: false }));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [notifiyTgl?.notify, setNotifyTgl]);

  // Navigation items configuration
  const allNavItems = [
    { id: 'chat', icon: MessageSquare, label: t('chat'), route: '/dashboard/chat', roles: ['guest', 'user', 'admin', 'vendor'] },
    { id: 'marketplace', icon: ShoppingBag, label: t('marketplace') || "Marketplace", route: AppRoute.MARKETPLACE, roles: ['guest', 'user', 'admin', 'vendor'] },
    { id: 'admin', icon: LayoutGrid, label: t('adminDashboard'), route: AppRoute.ADMIN, roles: ['admin'] },
    { id: 'adminSupport', icon: ShieldAlert, label: t('adminSupport'), route: AppRoute.ADMIN_SUPPORT, roles: ['admin'] },
  ];

  // Effective role for filtering - if isAdminView is true (email match), treat as admin
  const effectiveRole = isAdminView ? 'admin' : userRole;

  // Filter items based on roles
  const navItems = allNavItems.filter(item => item.roles.includes(effectiveRole));

  const handleNavClick = (e, item) => {
    const isPublic = ['chat', 'marketplace'].includes(item.id);
    if (!isLoggedIn && !isPublic) {
      e.preventDefault();
      navigate('/login', { state: { from: location } });
      onClose();
    } else {
      if (item.onClick) item.onClick();
      setExpandedSection(null);
      setIsFaqOpen(false);
      onClose();
    }
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <>
      {/* Mobile Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-[90] md:hidden backdrop-blur-md"
          onClick={onClose}
        >
          {/* Close Button Floating */}
          <button
            className="absolute top-6 right-6 p-2 bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      )}

      <AnimatePresence>
        {notifiyTgl.notify && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className='fixed inset-x-0 z-[110] flex justify-center items-center mt-6 px-4'
          >
            <NotificationBar msg={"Successfully Owned"} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Container */}
      <div
        className={`
          fixed inset-y-0 left-0 z-[200] ${isDark ? 'bg-[#1a2235] border-white/5' : 'bg-white/20 backdrop-blur-3xl border-white/40'}
          flex flex-col transition-all duration-500 ease-in-out sidebar-main-container
          md:relative md:translate-x-0 shadow-[20px_0_40px_rgba(0,0,0,0.1)] w-46 overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Dreamy Background blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-40">
          <div className={`absolute top-0 right-0 w-32 h-32 ${isDark ? 'bg-[#8B5CF6]/20' : 'bg-purple-500/10'} rounded-full blur-[50px] -mr-10 -mt-10 animate-pulse`}></div>
          <div className={`absolute -bottom-10 -left-10 w-24 h-24 ${isDark ? 'bg-blue-500/20' : 'bg-blue-500/10'} rounded-full blur-[40px] animate-pulse animation-delay-2000`}></div>
        </div>

        {/* Brand Logo Section */}
        <div className={`h-28 flex items-center justify-between px-6 border-b ${isDark ? 'border-white/5' : 'border-gray-100/50'} relative overflow-hidden group/logo`}>
          <Link
            to="/"
            onClick={() => { setNotifyTgl(prev => ({ ...prev, marketPlaceMode: 'AIMall' })); onClose(); }}
            className="flex items-center gap-4 relative z-10"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className={`text-xl font-black ${isDark ? 'text-[#E6E9F2]' : 'text-gray-900'} tracking-tighter uppercase leading-none transition-colors`}>
                  <span className="aiva-glitch" data-text="AI">AI</span> MALL
                  <sup className="text-[10px] md:text-[0.45em] font-black ml-0.5 relative -top-[0.6em] md:-top-[0.8em]">{t('trademark')}</sup>
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="overflow-y-auto pt-4 pb-2 px-4 space-y-1 no-scrollbar">
          {navItems.map((item) => {
            const isActivePath = location.pathname === item.route;

            return (
              <NavLink
                key={item.id}
                to={item.route}
                onClick={(e) => handleNavClick(e, item)}
                className={({ isActive }) => {
                  let isTabActive = isActive && !isFaqOpen;

                  if (item.id === 'marketplace') {
                    isTabActive = isTabActive && (notifiyTgl.marketPlaceMode === 'AIMall' || !notifiyTgl.marketPlaceMode);
                  } else if (item.id === 'aseries_marketplace') {
                    isTabActive = isTabActive && notifiyTgl.marketPlaceMode === 'ASeries';
                  }

                  return `flex items-center px-4 py-2.5 rounded-[18px] text-[9px] font-black uppercase tracking-wider transition-all duration-300 group relative overflow-hidden border ${isTabActive
                    ? `${isDark ? 'sidebar-purple-btn sidebar-active' : 'bg-gradient-to-r from-[#ec4899] via-[#d946ef] to-[#8b5cf6] text-white border-transparent shadow-[0_10px_25px_rgba(236,72,153,0.3)]'} scale-[1.02]`
                    : `${isDark ? 'sidebar-purple-btn' : 'bg-[#8B5CF6] text-white border-transparent shadow-[0_10px_20px_rgba(139,92,246,0.15)] hover:bg-[#7c3aed]'} hover:shadow-xl hover:scale-[1.02]`
                    }`;
                }}
              >
                {({ isActive }) => {
                  let isTabActive = isActive && !isFaqOpen;

                  if (item.id === 'marketplace') {
                    isTabActive = isTabActive && (notifiyTgl.marketPlaceMode === 'AIMall' || !notifiyTgl.marketPlaceMode);
                  } else if (item.id === 'aseries_marketplace') {
                    isTabActive = isTabActive && notifiyTgl.marketPlaceMode === 'ASeries';
                  }

                  return (
                    <>
                      {!isDark && <div className={`absolute inset-0 bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] opacity-0 transition-opacity duration-300 ${isTabActive ? 'opacity-0' : 'group-hover:opacity-5'}`} />}
                      <item.icon size={14} className={`mr-3 transition-colors relative z-10 ${isTabActive ? (isDark ? 'text-white' : 'text-black') : `${isDark ? 'text-[#6F76A8]' : 'text-white'} group-hover:text-white`}`} />
                      <span className={`relative z-10 transition-colors ${isTabActive ? (isDark ? 'text-white' : 'text-black') : 'text-white'}`}>{item.label}</span>
                    </>
                  );
                }}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="px-4 py-1">
          <NavLink
            to={AppRoute.NOTIFICATIONS}
            onClick={(e) => {
              if (!isLoggedIn) {
                e.preventDefault();
                navigate('/login', { state: { from: location } });
                onClose();
              } else {
                setExpandedSection(null);
                setIsFaqOpen(false);
                onClose();
              }
            }}
            className={({ isActive }) => {
              const isTabActive = isActive && !isFaqOpen;
              return `flex items-center px-4 py-2.5 rounded-[18px] text-[9px] font-black uppercase tracking-wider transition-all duration-300 group relative overflow-hidden border ${isTabActive
                ? `${isDark ? 'sidebar-purple-btn sidebar-active' : 'bg-gradient-to-r from-[#ec4899] via-[#d946ef] to-[#8b5cf6] text-white border-transparent shadow-[0_10px_25px_rgba(236,72,153,0.3)]'} scale-[1.02]`
                : `${isDark ? 'sidebar-purple-btn' : 'bg-[#8B5CF6] text-white border-transparent shadow-[0_10px_20px_rgba(139,92,246,0.15)] hover:bg-[#7c3aed]'} hover:shadow-xl hover:scale-[1.02]`
                }`;
            }}
          >
            {({ isActive }) => {
              const isTabActive = isActive && !isFaqOpen;
              return (
                <>
                  {!isDark && <div className={`absolute inset-0 bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] opacity-0 transition-opacity duration-300 ${isTabActive ? 'opacity-0' : 'group-hover:opacity-5'}`} />}
                  <div className="relative mr-3 z-10">
                    <Bell size={14} className={`transition-colors ${isTabActive ? (isDark ? 'text-white' : 'text-black') : `${isDark ? 'text-[#6F76A8]' : 'text-white'} group-hover:text-white`}`} />
                    {notifications.filter(n => !n.isRead).length > 0 && (
                      <div className={`absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[7px] font-black text-white flex items-center justify-center border ${isDark ? 'border-[#1a2235]' : 'border-white'}`}>
                        {notifications.filter(n => !n.isRead).length}
                      </div>
                    )}
                  </div>
                  <span className={`relative z-10 transition-colors ${isTabActive ? (isDark ? 'text-white' : 'text-black') : 'text-white'}`}>{t('notifications')}</span>
                  {isTabActive && <div className={`absolute right-3 w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white' : 'bg-black'} animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]`} />}
                </>
              );
            }}
          </NavLink>
        </div>

        {/* User Profile and Help Section */}
        <div className={`p-4 border-t ${isDark ? 'border-white/10' : 'border-white/20'} space-y-1 bg-gradient-to-t ${isDark ? 'from-white/5' : 'from-white/10'} to-transparent`}>
          <button
            onClick={(e) => {
              if (!isLoggedIn) {
                navigate('/login', { state: { from: location } });
                onClose();
              } else {
                navigate(isAdminView ? AppRoute.SETTINGS : AppRoute.PROFILE);
                setIsFaqOpen(false);
                onClose();
              }
            }}
            className={`flex items-center w-full px-4 py-2.5 rounded-[18px] text-[9px] font-black uppercase tracking-wider transition-all duration-300 group relative overflow-hidden border ${((location.pathname === AppRoute.PROFILE || location.pathname === AppRoute.SETTINGS) && !isFaqOpen)
              ? `${isDark ? 'sidebar-purple-btn sidebar-active' : 'bg-gradient-to-r from-[#ec4899] via-[#d946ef] to-[#8b5cf6] text-white border-transparent shadow-[0_10px_25px_rgba(236,72,153,0.3)]'} scale-[1.02]`
              : `${isDark ? 'sidebar-purple-btn' : 'bg-[#8B5CF6] text-white border-transparent shadow-[0_10px_20px_rgba(139,92,246,0.15)] hover:bg-[#7c3aed]'} hover:shadow-lg hover:scale-[1.02]`
              }`}
          >
            {!isDark && <div className={`absolute inset-0 bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] opacity-0 transition-opacity duration-300 ${((location.pathname === AppRoute.PROFILE || location.pathname === AppRoute.SETTINGS) && !isFaqOpen) ? 'opacity-0' : 'group-hover:opacity-10'}`} />}
            <div className={`profile-initial w-6 h-6 rounded-lg mr-3 flex items-center justify-center font-black text-[10px] z-10 transition-all shadow-sm ${((location.pathname === AppRoute.PROFILE || location.pathname === AppRoute.SETTINGS) && !isFaqOpen)
              ? 'bg-white text-[#ec4899]'
              : `${isDark ? 'bg-white/20 text-white group-hover:bg-white group-hover:text-black' : 'bg-white/20 text-white group-hover:bg-white group-hover:text-[#ec4899]'}`
              }`}>
              {t(user.name?.toUpperCase())?.charAt(0)}
            </div>
            <span className={`relative z-10 transition-colors normal-case ${((location.pathname === AppRoute.PROFILE || location.pathname === AppRoute.SETTINGS) && !isFaqOpen) ? (isDark ? 'text-white' : 'text-black') : ''}`}>{t(user.name)}</span>
            {((location.pathname === AppRoute.PROFILE || location.pathname === AppRoute.SETTINGS) && !isFaqOpen) && <div className={`absolute right-3 w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white' : 'bg-black'} animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]`} />}
          </button>

          <button
            onClick={() => { setIsFaqOpen(true); onClose(); }}
            className={`flex items-center w-full px-4 py-2.5 rounded-[18px] text-[9px] font-black uppercase tracking-wider transition-all duration-300 group relative overflow-hidden border ${isFaqOpen
              ? `${isDark ? 'sidebar-purple-btn sidebar-active' : 'bg-gradient-to-r from-[#ec4899] via-[#d946ef] to-[#8b5cf6] text-white border-transparent shadow-[0_10px_25px_rgba(236,72,153,0.3)]'} scale-[1.02]`
              : `${isDark ? 'sidebar-purple-btn' : 'bg-[#8B5CF6] text-white border-transparent shadow-[0_10px_20px_rgba(139,92,246,0.15)] hover:bg-[#7c3aed]'} hover:shadow-xl hover:scale-[1.02]`
              }`}
          >
            {!isDark && <div className={`absolute inset-0 bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] opacity-0 transition-opacity duration-300 ${isFaqOpen ? 'opacity-0' : 'group-hover:opacity-10'}`} />}
            <HelpCircle size={15} className={`mr-3 transition-colors relative z-10 ${isFaqOpen ? (isDark ? 'text-white' : 'text-black') : 'text-white group-hover:text-white'}`} />
            <span className={`relative z-10 transition-colors ${isFaqOpen ? (isDark ? 'text-white' : 'text-black') : ''}`}>{t('helpFaq')}</span>
            {isFaqOpen && <div className={`absolute right-3 w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white' : 'bg-black'} animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]`} />}
          </button>

          <div className="pt-1">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full px-4 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all duration-300 group border
                ${isDark
                  ? 'bg-red-500/20 border-red-500/10 text-red-400 hover:bg-red-500 hover:text-white hover:shadow-[0_10px_20px_rgba(239,68,68,0.2)]'
                  : 'bg-red-50 border-red-100 text-red-500 hover:bg-red-600 hover:text-white hover:shadow-lg'
                }`}
            >
              <LogOut size={14} className="mr-3 group-hover:-translate-x-1 transition-transform" />
              {t('signOut')}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Profile Panel REMOVED */}

      {/* FAQ Modal */}
      {isFaqOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center md:p-4 bg-[#0f172a]/40 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`md:rounded-[56px] w-full max-w-2xl h-full md:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border transition-all duration-700 ${isDark ? 'bg-[#1a2235] border-[#8B5CF6]/20 shadow-[0_40px_80px_rgba(0,0,0,0.6)]' : 'border-white/80 bg-white/60'}`}
          >
            <div className={`p-4 md:p-8 border-b ${isDark ? 'border-white/5 bg-[#1a2235]/30' : 'border-white/40 bg-white/20'} flex justify-between items-center shrink-0`}>
              <div className={`flex gap-2 md:gap-6 ${isDark ? 'bg-[#1a2235] border-white/5' : 'bg-white/40 border-white/60'} p-1.5 rounded-full border`}>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`text-[10px] font-black uppercase tracking-widest px-4 md:px-6 py-2.5 rounded-full transition-all ${activeTab === 'faq' ? (isDark ? 'bg-[#8B5CF6] text-white shadow-lg' : 'bg-white text-[#7c3aed] shadow-sm') : (isDark ? 'text-[#6F76A8] hover:text-[#8B5CF6]' : 'text-slate-500 hover:text-[#7c3aed]')}`}
                >
                  {t('knowledge')}
                </button>
                <button
                  onClick={() => setActiveTab('help')}
                  className={`text-[10px] font-black uppercase tracking-widest px-4 md:px-6 py-2.5 rounded-full transition-all ${activeTab === 'help' ? (isDark ? 'bg-[#8B5CF6] text-white shadow-lg' : 'bg-white text-[#7c3aed] shadow-sm') : (isDark ? 'text-[#6F76A8] hover:text-[#8B5CF6]' : 'text-slate-500 hover:text-[#7c3aed]')}`}
                >
                  {t('support')}
                </button>
              </div>
              <button
                onClick={() => setIsFaqOpen(false)}
                className={`p-3 ${isDark ? 'bg-white/5 hover:bg-white/10 text-[#f1f5f9]' : 'bg-white/40 hover:bg-white text-slate-500 hover:text-slate-900'} rounded-2xl transition-all shadow-sm shrink-0`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-6 no-scrollbar relative z-10">
              {activeTab === 'faq' ? (
                <>
                  <p className={`text-sm ${isDark ? 'text-[#6F76A8]' : 'text-slate-500'} font-black uppercase tracking-widest opacity-60`}>{t('generalGuidelines')}</p>
                  {Array.from({ length: 9 }, (_, i) => ({
                    question: t(`faq${i + 1}_q`),
                    answer: t(`faq${i + 1}_a`)
                  })).map((faq, index) => (
                    <div key={index} className={`border transition-all duration-300 group/faq ${isDark ? 'border-white/5 bg-[#1a2235] hover:bg-white/5' : 'border-white/60 bg-white/20 hover:bg-white/40'} rounded-[32px] overflow-hidden`}>
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                        className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                      >
                        <span className={`font-black ${isDark ? 'text-[#E6E9F2]' : 'text-slate-900'} text-sm tracking-tight group-hover/faq:text-[#8B5CF6] transition-colors`}>{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 ${isDark ? 'text-[#6F76A8]' : 'text-[#7c3aed]'} transition-transform duration-500 ${openFaqIndex === index ? 'rotate-180 text-[#8B5CF6]' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openFaqIndex === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className={`px-8 pb-8 ${isDark ? 'text-[#C7CBEA]' : 'text-slate-500'} text-sm font-medium leading-relaxed`}>
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex flex-col gap-8 relative">
                  {sendStatus === 'success' ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="h-80 flex flex-col items-center justify-center text-center space-y-6"
                    >
                      <div className="relative">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 10 }}
                          className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]"
                        >
                          <CheckCircle className="w-10 h-10" />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="absolute -inset-4 bg-green-500/20 rounded-full -z-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className={`text-xl md:text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tight`}>
                          {t('messageSent') || 'Message Sent Successfully!'}
                        </h3>
                        <p className={`text-sm md:text-base ${isDark ? 'text-gray-400' : 'text-gray-500'} font-medium`}>
                          {t('supportTeamContact') || 'Our team will review your request and get back to you shortly.'}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <label className={`block text-[10px] font-black ${isDark ? 'text-[#6F76A8]' : 'text-slate-400'} uppercase tracking-[0.2em] ml-2`}>
                          {t('issueCategory') || 'ISSUE CATEGORY'}
                        </label>
                        <div className="relative group/input">
                          <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`w-full px-6 py-4 rounded-[32px] ${isDark ? 'bg-[#131c31] border-white/10 text-[#E6E9F2]' : 'bg-white/60 border-white/80 text-slate-900'} border focus:border-[#8B5CF6]/50 transition-all shadow-glass-sm flex justify-between items-center`}
                          >
                            <span className="font-medium text-left">{t(issueOptionsMap[issueType]) || issueType}</span>
                            <ChevronDown size={20} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''} ${isDark ? 'text-[#6F76A8]' : 'text-slate-400'}`} />
                          </button>

                          <AnimatePresence>
                            {isDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`absolute top-full left-0 right-0 mt-2 z-50 overflow-hidden rounded-[24px] border ${isDark ? 'bg-[#1a2235] border-white/10' : 'bg-white border-purple-100'} shadow-xl max-h-60 overflow-y-auto custom-scrollbar`}
                              >
                                {issueOptions.map((option) => (
                                  <button
                                    key={option}
                                    onClick={() => {
                                      setIssueType(option);
                                      setIsDropdownOpen(false);
                                    }}
                                    className={`w-full px-6 py-3 text-left font-medium text-sm transition-colors ${issueType === option
                                      ? (isDark ? 'bg-[#8B5CF6]/20 text-[#8B5CF6]' : 'bg-purple-50 text-purple-600')
                                      : (isDark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-purple-50/50')
                                      }`}
                                  >
                                    {t(issueOptionsMap[option]) || option}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className={`block text-[10px] font-black ${isDark ? 'text-[#6F76A8]' : 'text-slate-400'} uppercase tracking-[0.2em] ml-2`}>
                          {t('details') || 'DETAILS'}
                        </label>
                        <textarea
                          className={`w-full p-8 rounded-[32px] ${isDark ? 'bg-[#131c31] border-white/10 text-[#E6E9F2] placeholder-[#6F76A8]/50' : 'bg-white/60 border-white/80 text-slate-900 focus:placeholder-transparent'} border focus:border-[#8B5CF6]/50 focus:ring-4 focus:ring-[#8B5CF6]/5 outline-none resize-none font-medium min-h-[220px] transition-all shadow-glass-sm`}
                          placeholder={t('specifyRequest') || "helo admin"}
                          value={issueText}
                          onChange={(e) => setIssueText(e.target.value)}
                        />
                      </div>

                      <div className="px-2">
                        <button
                          onClick={handleSupportSubmit}
                          disabled={isSending || !issueText.trim()}
                          className={`w-full py-5 ${isDark ? 'bg-[#8B5CF6] hover:bg-[#7c3aed] shadow-[0_15px_30px_-5px_rgba(139,92,246,0.4)]' : 'bg-[#8b5cf6] hover:bg-[#7c3aed] shadow-[0_15px_30px_-5px_rgba(139,92,246,0.4)]'} text-white rounded-[24px] font-black text-[14px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 group`}
                        >
                          {isSending ? (
                            <>
                              <Loader2 className="animate-spin w-5 h-5" />
                              {t('sending')}
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                              {t('sendMessage') || 'SEND MESSAGE'}
                            </>
                          )}
                        </button>
                      </div>

                      <p className={`text-[10px] text-center font-black ${isDark ? 'text-[#6F76A8]' : 'text-slate-400'} uppercase tracking-[0.2em] mt-4 opacity-60`}>
                        {t('directChannel')}: <a href="mailto:admin@uwo24.com" className={`text-[#8B5CF6] hover:underline normal-case font-bold ml-1`}>admin@uwo24.com</a>
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className={`p-8 border-t ${isDark ? 'border-white/5 bg-[#131c31]/30' : 'border-white/40 bg-white/20'} flex justify-center shrink-0`}>
              <button
                onClick={() => setIsFaqOpen(false)}
                className="px-10 py-3 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border border-purple-200/50 shadow-sm"
              >
                {t('dismiss')}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
