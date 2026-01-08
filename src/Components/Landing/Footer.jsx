import React from 'react';
import { Link } from 'react-router';
import { Linkedin, Twitter, Facebook, Instagram, Youtube, MessageCircle, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative mt-20 bg-[#ffffff]/60 backdrop-blur-3xl border-t border-white/60 pt-24 pb-10 rounded-t-[80px] shadow-[0_-20px_60px_-15px_rgba(255,255,255,0.8)] overflow-hidden">
            {/* Colorful Background Blobs matching reference */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[100px] mix-blend-multiply animate-blob"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-400/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000"></div>
                <div className="absolute top-[20%] right-[20%] w-[400px] h-[400px] bg-purple-400/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-4000"></div>
            </div>

            {/* Shimmer Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-[200%] animate-[shimmer_10s_infinite_linear] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">A</div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">A-Series™</span>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed font-medium">
                            A-Series™ — India's First AI App Marketplace.<br />
                            100 AI Apps | A-Series™ | Partner Integrations<br />
                            Powered by UWO™
                        </p>

                        {/* Animated Social Icons - Glassy Cards */}
                        <div className="flex gap-3 pt-4">
                            {[
                                { icon: Linkedin, color: 'hover:text-[#0077b5] hover:bg-[#0077b5]/20' },
                                { icon: Twitter, color: 'hover:text-[#1da1f2] hover:bg-[#1da1f2]/20' },
                                { icon: Facebook, color: 'hover:text-[#1877f2] hover:bg-[#1877f2]/20' },
                                { icon: Instagram, color: 'hover:text-[#e4405f] hover:bg-[#e4405f]/20' },
                                { icon: Youtube, color: 'hover:text-[#ff0000] hover:bg-[#ff0000]/20' },
                                { icon: MessageCircle, color: 'hover:text-[#25d366] hover:bg-[#25d366]/20' }
                            ].map((social, index) => (
                                <a key={index} href="#" className={`p-2.5 rounded-xl bg-white/90 backdrop-blur-md border border-white shadow-md text-gray-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${social.color}`}>
                                    <social.icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Explore Links */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Explore</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link to="/dashboard/marketplace" className="text-gray-500 hover:text-blue-600 font-medium transition-all duration-300 hover:translate-x-2 inline-block">
                                    Marketplace
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard/agents" className="text-gray-500 hover:text-blue-600 font-medium transition-all duration-300 hover:translate-x-2 inline-block">
                                    My Agents
                                </Link>
                            </li>
                            <li>
                                <Link to="/vendor" className="text-gray-500 hover:text-blue-600 font-medium transition-all duration-300 hover:translate-x-2 inline-block">
                                    Become a Vendor
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition-all duration-300 hover:translate-x-2 inline-block">
                                    Live Demos
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Support</h3>
                        <ul className="space-y-4">
                            {['Help Center', 'Security & Guidelines', 'Contact Us', 'Status Page'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-500 hover:text-blue-600 font-medium transition-all duration-300 hover:translate-x-2 inline-block">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-6">Contact</h3>
                        <ul className="space-y-5">
                            <li className="flex items-start gap-3 text-gray-500 group">
                                <MapPin size={20} className="text-blue-500 mt-0.5 group-hover:scale-110 transition-transform" />
                                <span className="group-hover:text-gray-700 transition-colors">Jabalpur, Madhya Pradesh</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-500 group">
                                <Mail size={20} className="text-blue-500 group-hover:scale-110 transition-transform" />
                                <a href="mailto:support@a-series.ai" className="group-hover:text-gray-700 transition-colors">support@a-series.ai</a>
                            </li>
                            <li className="flex items-center gap-3 text-gray-500 group">
                                <Phone size={20} className="text-blue-500 group-hover:scale-110 transition-transform" />
                                <span className="group-hover:text-gray-700 transition-colors">+91 83589 90909</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-400">
                    <p>© 2026 A-Series. All rights reserved. Partnered with UWO-LINK™.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-gray-600 transition-colors">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
