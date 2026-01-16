import React from 'react';
import { useNavigate } from 'react-router';
import { Bot, User, Zap, ArrowRight, UserCircle } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import { themeState } from '../userStore/userData';

const Series = () => {
    const theme = useRecoilValue(themeState);
    const isDark = theme === 'Dark';
    const navigate = useNavigate();
    const Logo = "/logo/Logo.png";

    return (
        <div className={`min-h-screen ${isDark ? 'bg-slate-950' : 'bg-white'} relative overflow-hidden font-sans transition-colors duration-700`}>
            {/* Header */}
            <header className="absolute top-0 w-full p-6 flex justify-between items-center z-10 px-8 lg:px-16">
                <div className="flex items-center gap-2">
                    <img src={Logo} alt="AI Mall Logo" className="w-8 h-8 object-contain" />
                    <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} tracking-tight transition-colors`}>A-Series™</span>
                </div>
                <button className={`${isDark ? 'text-blue-400 hover:bg-slate-900' : 'text-blue-600 hover:bg-blue-50'} p-2 rounded-full transition-all`}>
                    <UserCircle className="w-8 h-8" strokeWidth={1.5} />
                </button>
            </header>

            {/* Main Content */}
            <main className="relative z-0 flex flex-col items-center justify-center min-h-screen text-center px-4 max-w-5xl mx-auto pt-20">

                {/* Badge */}
                <div className="mb-10 animate-fade-in-up">
                    <span className={`px-5 py-2 rounded-full ${isDark ? 'bg-slate-900 text-slate-400' : 'bg-gray-100 text-gray-600'} text-sm font-medium tracking-wide transition-colors`}>
                        Powered by UWO
                    </span>
                </div>

                {/* Headline */}
                <h1 className={`text-6xl md:text-7xl lg:text-8xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tighter leading-[1.1] mb-8 max-w-4xl animate-fade-in-up delay-100 transition-colors`}>
                    The Future of <br />
                    <span className="text-[#2563eb]">Conversational AI</span>
                </h1>

                {/* Subheadline */}
                <p className={`text-xl ${isDark ? 'text-slate-400' : 'text-gray-600'} max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-200 transition-colors`}>
                    Experience the next generation of intelligent assistance. A-Series™ learns, adapts, and creates with you in real-time through a stunning interface.
                </p>

                {/* CTA Button */}
                <div className="animate-fade-in-up delay-300">
                    <button
                        onClick={() => window.location.href = 'https://ai-mall.onrender.com/dashboard/chat'}
                        className="group relative px-10 py-5 bg-[#2563eb] text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 hover:shadow-blue-600/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        <div className="relative z-10 flex items-center gap-2">
                            Start Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                </div>
            </main>

            {/* Footer Stats */}
            <div className={`absolute bottom-0 w-full ${isDark ? 'bg-slate-950 border-t border-white/5' : 'bg-white border-t border-gray-100/50'} py-12 px-8 lg:px-16 animate-fade-in-up delay-300 transition-colors`}>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 md:gap-4">

                    {/* Stat Items */}
                    <div className="flex items-center gap-4 group cursor-default">
                        <div className={`w-12 h-12 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-all duration-300`}>
                            <Bot className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'} transition-colors`}>100+</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Agents</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 group cursor-default">
                        <div className={`w-12 h-12 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-all duration-300`}>
                            <User className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'} transition-colors`}>10k+</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Happy Users</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 group cursor-default">
                        <div className={`w-12 h-12 ${isDark ? 'bg-blue-900/20' : 'bg-blue-50'} rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-all duration-300`}>
                            <Zap className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                            <div className={`text-2xl font-black ${isDark ? 'text-white' : 'text-gray-900'} transition-colors`}>&lt;50ms</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Fast Inference</div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Background Gradients */}
            <div className={`fixed inset-0 pointer-events-none -z-10 ${isDark ? 'bg-slate-950' : 'bg-white'} transition-colors duration-700`}>
                <div className={`absolute top-[-10%] right-[-5%] w-[500px] h-[500px] ${isDark ? 'bg-blue-900/20' : 'bg-blue-100/40'} rounded-full blur-[120px] transition-colors`} />
                <div className={`absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] ${isDark ? 'bg-purple-900/20' : 'bg-purple-50/60'} rounded-full blur-[100px] transition-colors`} />
            </div>
        </div>
    );
};

export default Series;
