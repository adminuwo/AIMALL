import React, { useState, useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { themeState } from '../userStore/userData';
import Header from '../Components/Landing/Header';
import Hero from '../Components/Landing/Hero';
import Stats from '../Components/Landing/Stats';
import HowItWorks from '../Components/Landing/HowItWorks';
import Testimonials from '../Components/Landing/Testimonials';
import Footer from '../Components/Landing/Footer';
// import SecurityModal from '../Components/LiveDemo/SecurityModal';

const Landing = () => {
  // const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const theme = useRecoilValue(themeState);
  const isDark = theme === 'Dark';

  // Sync theme with body class for global CSS support
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    // Cleanup on unmount (optional, depends on if other pages handle it)
  }, [isDark]);

  // Clear localStorage on fresh landing page visit to prevent auto-login
  useEffect(() => {
    const hasActiveSession = sessionStorage.getItem('activeSession');
    if (!hasActiveSession) {
      const lang = localStorage.getItem('preferredLanguage');
      localStorage.clear();
      if (lang) localStorage.setItem('preferredLanguage', lang);
    }
    sessionStorage.setItem('activeSession', 'true');
  }, []);

  return (
    <div className={`min-h-screen font-sans ${isDark ? 'text-white' : 'text-gray-900'} selection:bg-purple-100 selection:text-purple-900 overflow-hidden relative transition-colors duration-200`}>
      <div className="fixed inset-0 -z-10">
        {/* Base Background Color */}
        <div className={`absolute inset-0 transition-colors duration-200 ${isDark ? 'bg-[#1a2235]' : 'bg-white'}`}></div>

        <img
          src="/landing_bg.jpg"
          alt="Background"
          className={`w-full h-full object-cover transition-opacity duration-200 ${isDark ? 'opacity-90' : 'opacity-80'}`}
        />
        {/* Overlay to ensure text readability */}
        <div className={`absolute inset-0 backdrop-blur-[1px] transition-colors duration-200 ${isDark ? 'bg-black/10' : 'bg-white/20'}`}></div>
      </div>

      <Header />
      <Hero />
      {/* <Stats /> */}

      <HowItWorks />
      <Testimonials />

      <Footer />

      {/* <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      /> */}
    </div>
  );
};

export default Landing;
