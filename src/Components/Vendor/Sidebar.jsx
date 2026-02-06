import React from 'react';
import { LayoutDashboard, Box, DollarSign, Settings, LogOut, Users, ShieldAlert, Zap, Globe, Cpu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const menuItems = [
        { name: 'Overview', icon: LayoutDashboard, path: '/vendor/overview' },
        { name: 'My agents', icon: Box, path: '/vendor/apps' },
        { name: 'Revenue and payout', icon: DollarSign, path: '/vendor/revenue' },
        { name: 'User Support', icon: Users, path: '/vendor/user-support' },
        { name: 'Admin Support', icon: ShieldAlert, path: '/vendor/admin-support' },
        { name: 'setting', icon: Settings, path: '/vendor/settings' },
    ];

    const isActive = (path) => {
        if (location.pathname === path) return true;
        if (path !== '/vendor/overview' && location.pathname.startsWith(path) && path !== '/vendor/revenue') return true;
        return false;
    };

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={`fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={toggleSidebar}
            />

            {/* Sidebar */}
            <div className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-white/20 backdrop-blur-3xl border-r border-white/40 flex flex-col z-50 transition-all duration-500 ease-out lg:translate-x-0 shadow-[20px_0_40px_rgba(0,0,0,0.05)] ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                {/* Brand Logo Section */}
                <div className="h-32 flex items-center justify-between px-8 border-b border-gray-100/50 relative overflow-hidden group/logo">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px] pointer-events-none -mr-10 -mt-10 group-hover/logo:bg-purple-500/20 transition-all duration-700" />
                    <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none" />

                    <Link to="/" className="flex items-center gap-4 relative z-10 hover:opacity-70 transition-opacity">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="text-2xl font-black text-gray-900 tracking-tighter uppercase leading-none">AI MALL<sup className="text-[10px] md:text-[0.45em] font-bold ml-0.5 relative -top-[0.6em] md:-top-[0.8em]">TM</sup></span>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse border-2 border-white" />
                            </div>
                        </div>
                    </Link>

                    {/* Close Button (Mobile Only) */}
                    <button
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 rounded-xl hover:bg-white/40 text-gray-400 hover:text-gray-900 transition-colors z-20"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Menu */}
                <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-3 no-scrollbar">
                    {menuItems.map((item) => {
                        const active = isActive(item.path);

                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => window.innerWidth < 768 && toggleSidebar()}
                                className={`flex items-center px-5 py-4 rounded-[20px] text-xs font-black uppercase tracking-wider transition-all duration-300 group relative overflow-hidden border ${active
                                    ? 'bg-white text-[#7c3aed] shadow-[0_10px_20px_-5px_rgba(124,58,237,0.2)] scale-105 border-purple-100'
                                    : 'text-gray-500 border-transparent hover:bg-white/40 hover:text-gray-900 hover:shadow-lg hover:scale-[1.02]'
                                    }`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r from-[#d946ef] to-[#8b5cf6] opacity-0 transition-opacity duration-300 ${active ? 'opacity-20' : 'group-hover:opacity-0'}`} />
                                <item.icon size={18} className={`mr-4 transition-colors relative z-10 ${active ? 'text-[#d946ef]' : 'text-gray-400 group-hover:text-[#8b5cf6]'}`} />
                                <span className="relative z-10">{item.name}</span>
                                {active && <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-[#d946ef] animate-pulse" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-6 border-t border-white/20 space-y-4 bg-gradient-to-t from-white/10 to-transparent">
                    <button
                        onClick={() => navigate('/dashboard/marketplace')}
                        className="flex items-center justify-center w-full px-4 py-4 rounded-[20px] text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-white hover:text-[#8b5cf6] hover:shadow-xl transition-all group border border-transparent hover:border-white/50"
                    >
                        <LogOut size={16} className="mr-3 group-hover:-translate-x-1 transition-transform rotate-180" />
                        Go To AI MALL
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
