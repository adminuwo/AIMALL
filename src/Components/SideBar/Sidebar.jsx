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
  CheckCircle
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
  const user = currentUserData?.user || { name: "User", email: "user@example.com", role: "user" };
  const userRole = (user.role === 'admin' || user.role === 'Admin') ? 'admin' : user.role;
  // Check both role and email for admin access (matching backend logic)
  const isAdminView = userRole === 'admin' || user.email === 'admin@uwo24.com';
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const theme = useRecoilValue(themeState);
  const isDark = !isAdminView && theme === 'Dark';

  // Debug: Log user info to verify admin detection
  console.log('🔍 Sidebar Debug:', {
    email: user.email,
    role: user.role,
    userRole,
    isAdminView,
    currentUserData
  });

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
    localStorage.clear();
    navigate(AppRoute.LANDING);
  };

  // token already declared at line 40

  useEffect(() => {
    if (!token || location.pathname === AppRoute.LOGIN) return;

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

  if (notifiyTgl.notify) {
    setTimeout(() => {
      setNotifyTgl({ notify: false });
    }, 2000);
  }

  // Navigation items configuration
  const allNavItems = [
    { id: 'chat', icon: MessageSquare, label: t('chat'), route: '/dashboard/chat', roles: ['user', 'admin', 'vendor'] },
    { id: 'myAgents', icon: Bot, label: t('myAgents'), route: AppRoute.MY_AGENTS, roles: ['user', 'admin', 'vendor'] },
    { id: 'marketplace', icon: ShoppingBag, label: t('marketplace'), route: AppRoute.MARKETPLACE, onClick: () => setNotifyTgl(prev => ({ ...prev, marketPlaceMode: 'AIMall' })), roles: ['user', 'admin', 'vendor'] },
    { id: 'settings', icon: Settings, label: t('settings'), route: AppRoute.PROFILE, roles: ['user', 'vendor'] },
    { id: 'admin', icon: LayoutGrid, label: t('adminDashboard'), route: AppRoute.ADMIN, roles: ['admin'] },
  ];

  // Show all standard user items to guests, but filter admin-only items
  const navItems = allNavItems.filter(item => {
    // 1. If user is Admin, show admin dashboard, admin support, and common items
    if (isAdminView) {
      return item.roles.includes('admin') || ['chat', 'myAgents', 'marketplace'].includes(item.id);
    }
    // 2. For everyone else (User, Vendor, Guest), show these specific ones
    return ['chat', 'myAgents', 'marketplace'].includes(item.id);
  });

  const handleNavClick = (e, item) => {
    const isPublic = item.id === 'chat';
    if (!isLoggedIn && !isPublic) {
      e.preventDefault();
      navigate('/login', { state: { from: location } });
      onClose();
    } else {
      if (item.onClick) item.onClick();
      setExpandedSection(null);
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
          fixed inset-y-0 left-0 z-[200] ${isDark ? 'bg-[#0B0F1A] border-white/5' : 'bg-white/20 backdrop-blur-3xl border-white/40'}
          flex flex-col transition-all duration-500 ease-in-out 
          md:relative md:translate-x-0 shadow-[20px_0_40px_rgba(0,0,0,0.05)] w-46 overflow-hidden
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Dreamy Background blobs from Vendor style */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px] -mr-10 -mt-10 animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-[40px] animate-pulse animation-delay-2000"></div>
        </div>

        {/* Brand Logo Section (h-32 as in Vendor) */}
        <div className="h-28 flex items-center justify-between px-6 border-b border-gray-100/50 relative overflow-hidden group/logo">
          <Link
            to="/"
            onClick={() => { setNotifyTgl(prev => ({ ...prev, marketPlaceMode: 'AIMall' })); onClose(); }}
            className="flex items-center gap-4 relative z-10"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tighter uppercase leading-none transition-colors`}>AI MALL</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse border border-white" />
              </div>
            </div>
          </Link>

          {/* Close Button (Mobile Only) */}
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-xl hover:bg-white/40 text-gray-400 hover:text-gray-900 transition-colors z-20"
          >
            <X size={20} />
          </button>
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
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-[18px] text-[9px] font-black uppercase tracking-wider transition-all duration-300 group relative overflow-hidden border ${isActive
                    ? `${isDark ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/20 text-white shadow-[0_0_20px_rgba(139,92,246,0.2)]' : 'bg-white text-[#7c3aed] border-purple-100 shadow-[0_10px_20px_-5px_rgba(124,58,237,0.2)]'} scale-[1.02]`
                    : `${isDark ? 'text-white border-transparent hover:bg-white/5 hover:text-[#8B5CF6]' : 'text-gray-500 border-transparent hover:bg-white/40 hover:text-gray-900'} hover:shadow-lg hover:scale-[1.02]`
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`absolute inset-0 ${isDark ? 'bg-[#8B5CF6]' : 'bg-gradient-to-r from-[#d946ef] to-[#8b5cf6]'} opacity-0 transition-opacity duration-300 ${isActive ? 'opacity-20' : 'group-hover:opacity-0'}`} />
                    <item.icon size={14} className={`mr-3 transition-colors relative z-10 ${isActive ? 'text-[#8B5CF6]' : `${isDark ? 'text-[#6F76A8]' : 'text-gray-400'} group-hover:text-[#8B5CF6]`}`} />
                    <span className="relative z-10">{item.label}</span>
                    {isActive && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.8)]" />}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex-1" /> {/* Spacer to keep nav at top and profile at bottom */}

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
                onClose();
              }
            }}
            className={({ isActive }) =>
              `flex items-center px-4 py-2.5 rounded-[18px] text-[9px] font-black uppercase tracking-wider transition-all duration-300 group relative overflow-hidden border ${isActive
                ? `${isDark ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/20 text-[#8B5CF6] shadow-[0_0_20px_rgba(139,92,246,0.2)]' : 'bg-white text-[#7c3aed] border-purple-100 shadow-[0_10px_20px_-5px_rgba(124,58,237,0.2)]'} scale-[1.02]`
                : `${isDark ? 'text-[#AAB0D6] border-transparent hover:bg-white/5 hover:text-[#8B5CF6]' : 'text-gray-500 border-transparent hover:bg-white/40 hover:text-gray-900'} hover:shadow-lg hover:scale-[1.02]`
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative mr-3 z-10">
                  <Bell size={14} className={`transition-colors ${isActive ? 'text-[#8B5CF6]' : `${isDark ? 'text-[#6F76A8]' : 'text-gray-400'} group-hover:text-[#8B5CF6]`}`} />
                  {notifications.filter(n => !n.isRead).length > 0 && (
                    <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[7px] font-black text-white flex items-center justify-center border border-white">
                      {notifications.filter(n => !n.isRead).length}
                    </div>
                  )}
                </div>
                <span className="relative z-10">{t('notifications')}</span>
                {isActive && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.8)]" />}
              </>
            )}
          </NavLink>
        </div>

        {/* User Profile and Help Section */}
        <div className="p-4 border-t border-white/20 space-y-1 bg-gradient-to-t from-white/10 to-transparent">
          {/* Profile Hub Button */}
          <button
            onClick={(e) => {
              if (!isLoggedIn) {
                navigate('/login', { state: { from: location } });
                onClose();
              } else {
                // If admin, navigate to Admin Settings page, otherwise to User Profile
                navigate(isAdminView ? AppRoute.SETTINGS : AppRoute.PROFILE);
                onClose();
              }
            }}
            className={`flex items-center w-full px-4 py-2.5 rounded-[18px] text-[9px] font-black uppercase tracking-wider transition-all duration-300 group relative overflow-hidden border ${isDark ? 'text-[#AAB0D6] border-transparent hover:bg-white/5 hover:text-[#8B5CF6]' : 'text-gray-500 border-transparent hover:bg-white/40 hover:text-gray-900'} hover:shadow-lg hover:scale-[1.02]`}
          >
            <div className={`absolute inset-0 ${isDark ? 'bg-[#8B5CF6]' : 'bg-gradient-to-r from-[#d946ef] to-[#8b5cf6]'} opacity-0 transition-opacity duration-300 group-hover:opacity-10`} />
            <div className={`w-6 h-6 rounded-lg mr-3 flex items-center justify-center ${isDark ? 'bg-[#161D35] text-[#AAB0D6]' : 'bg-gray-100 text-[#7c3aed]'} font-black text-[10px] z-10 group-hover:bg-[#8B5CF6] group-hover:text-white transition-all shadow-sm`}>
              {user.name.charAt(0)}
            </div>
            <span className="relative z-10">{t('personalProfile')}</span>
          </button>

          <button
            onClick={() => { setIsFaqOpen(true); onClose(); }}
            className={`flex items-center w-full px-4 py-2.5 rounded-[18px] text-[9px] font-black uppercase tracking-wider transition-all duration-300 group relative overflow-hidden border ${isDark ? 'text-[#AAB0D6] border-transparent hover:bg-white/5 hover:text-[#8B5CF6]' : 'text-gray-500 border-transparent hover:bg-white/40 hover:text-gray-900'} hover:shadow-lg hover:scale-[1.02]`}
          >
            <HelpCircle size={15} className={`mr-3 ${isDark ? 'text-[#6F76A8]' : 'text-gray-400'} group-hover:text-[#8B5CF6] transition-colors relative z-10`} />
            <span className="relative z-10">{t('helpFaq')}</span>
          </button>

          <div className="pt-1">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2.5 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all duration-300 group text-gray-400 hover:text-red-500 hover:bg-red-50/50"
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center md:p-4 bg-slate-900/30 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`glass-card md:rounded-[56px] w-full max-w-2xl h-full md:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl ${isDark ? 'bg-[#161D35] border-[#8B5CF6]/10 shadow-[0_40px_80px_rgba(0,0,0,0.5)]' : 'border-white/80 bg-white/60'}`}
          >
            <div className={`p-4 md:p-8 border-b ${isDark ? 'border-white/10 bg-white/5' : 'border-white/40 bg-white/20'} flex justify-between items-center shrink-0`}>
              <div className={`flex gap-2 md:gap-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/60'} p-1.5 rounded-full border`}>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`text-[10px] font-black uppercase tracking-widest px-4 md:px-6 py-2.5 rounded-full transition-all ${activeTab === 'faq' ? (isDark ? 'bg-[#8B5CF6] text-white shadow-lg' : 'bg-white text-[#7c3aed] shadow-sm') : (isDark ? 'text-[#6F76A8] hover:text-[#8B5CF6]' : 'text-slate-500 hover:text-[#7c3aed]')}`}
                >
                  Knowledge
                </button>
                <button
                  onClick={() => setActiveTab('help')}
                  className={`text-[10px] font-black uppercase tracking-widest px-4 md:px-6 py-2.5 rounded-full transition-all ${activeTab === 'help' ? (isDark ? 'bg-[#8B5CF6] text-white shadow-lg' : 'bg-white text-[#7c3aed] shadow-sm') : (isDark ? 'text-white hover:text-[#8B5CF6]' : 'text-slate-500 hover:text-[#7c3aed]')}`}
                >
                  Support
                </button>
              </div>
              <button
                onClick={() => setIsFaqOpen(false)}
                className={`p-3 ${isDark ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-white/40 hover:bg-white text-slate-500 hover:text-slate-900'} rounded-2xl transition-all shadow-sm shrink-0`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-6 no-scrollbar">
              {activeTab === 'faq' ? (
                <>
                  <p className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-500'} font-bold uppercase tracking-widest opacity-60`}>General Guidelines</p>
                  {faqs.map((faq, index) => (
                    <div key={index} className={`border ${isDark ? 'border-[#8B5CF6]/10 bg-[#0B0F1A]' : 'border-white/60 bg-white/20'} rounded-[32px] overflow-hidden hover:bg-white/10 transition-all`}>
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                        className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                      >
                        <span className={`font-black ${isDark ? 'text-white' : 'text-slate-900'} text-sm tracking-tight`}>{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 ${isDark ? 'text-[#8B5CF6]' : 'text-[#7c3aed]'} transition-transform duration-500 ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {openFaqIndex === index && (
                          <motion.div
                            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className={`px-8 pb-8 ${isDark ? 'text-white' : 'text-slate-500'} text-sm font-medium leading-relaxed opacity-80`}>
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex flex-col gap-8">
                  <div className="space-y-4">
                    <label className={`block text-[10px] font-black ${isDark ? 'text-[#6F76A8]' : 'text-slate-400'} uppercase tracking-widest ml-1`}>Issue Category</label>
                    <div className="relative group">
                      <select
                        value={issueType}
                        onChange={(e) => setIssueType(e.target.value)}
                        className={`w-full p-5 pr-12 rounded-[24px] ${isDark ? 'bg-[#0B0F1A] border-white/10 text-white' : 'bg-white/60 border-white/80 text-slate-900'} border focus:ring-4 focus:ring-blue-500/10 outline-none appearance-none font-black text-sm transition-all`}
                      >
                        {issueOptions.map((opt) => (
                          <option key={opt} value={opt} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>{opt}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className={`block text-[10px] font-black ${isDark ? 'text-[#6F76A8]' : 'text-slate-400'} uppercase tracking-widest ml-1`}>Case Details</label>
                    <textarea
                      className={`w-full p-6 rounded-[32px] ${isDark ? 'bg-[#0B0F1A] border-white/10 text-white' : 'bg-white/60 border-white/80 text-slate-900'} border focus:ring-4 focus:ring-blue-500/10 outline-none resize-none font-medium min-h-[180px] transition-all`}
                      placeholder="Specify your request..."
                      value={issueText}
                      onChange={(e) => setIssueText(e.target.value)}
                    />
                  </div>

                  <button
                    onClick={handleSupportSubmit}
                    disabled={isSending || !issueText.trim()}
                    className={`w-full py-6 mt-4 ${isDark ? 'bg-[#8B5CF6] hover:bg-[#7c3aed]' : 'bg-[#7c3aed] hover:bg-[#6d28d9]'} text-white rounded-[28px] font-black text-[14px] uppercase tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2`}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        Sending...
                      </>
                    ) : sendStatus === 'success' ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Ticket Created!
                      </>
                    ) : 'Send Message'}
                  </button>

                  <p className={`text-[10px] text-center font-black ${isDark ? 'text-[#6F76A8]' : 'text-slate-400'} uppercase tracking-widest mt-4`}>
                    Direct Channel: <a href="mailto:admin@uwo24.com" className={`${isDark ? 'text-[#8B5CF6]' : 'text-blue-600'} hover:underline`}>admin@uwo24.com</a>
                  </p>
                </div>
              )}
            </div>

            <div className={`p-8 border-t ${isDark ? 'border-white/10 bg-white/5' : 'border-white/40 bg-white/20'} flex justify-center`}>
              <button
                onClick={() => setIsFaqOpen(false)}
                className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-white hover:text-[#8B5CF6]' : 'text-slate-500 hover:text-slate-900'} px-10 py-3 rounded-full hover:bg-white/5 transition-all outline-none border-none`}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
