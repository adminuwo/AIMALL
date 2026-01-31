import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AppRoute } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { useRecoilState } from 'recoil';
import { themeState } from '../../userStore/userData';
import { Globe, Search, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const logo = '/logo/Logo.png';

const Header = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage, languages } = useLanguage();
  const [theme, setTheme] = useRecoilState(themeState);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const langRef = useRef(null);

  const toggleTheme = () => {
    const newTheme = theme === 'Dark' ? 'Light' : 'Dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sequence: English, Hindi, Sanskrit, Marathi, Bengali, Punjabi
  const priorityOrder = ['en', 'hi', 'sa', 'mr', 'bn', 'pa'];

  const filteredLanguages = Object.entries(languages)
    .filter(([key, value]) =>
      value.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      key.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort(([keyA], [keyB]) => {
      const indexA = priorityOrder.indexOf(keyA);
      const indexB = priorityOrder.indexOf(keyB);

      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      return languages[keyA].title.localeCompare(languages[keyB].title);
    });

  return (
    <header className="py-6 relative z-[100]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(AppRoute.HOME)}>
          <div className="relative">
            <img className='w-10 h-10 md:w-14 md:h-14 transition-transform duration-500 group-hover:scale-110' src={logo} alt="AI MALL" />
            <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
          </div>
          <span className={`font-black text-lg md:text-2xl tracking-tighter uppercase transition-colors duration-300 ${theme === 'Dark' ? 'text-white' : 'text-[#1A1A1A]'}`}>
            {t('headerLogoText') || 'AI MALL'}<sup className="text-[10px] md:text-xs font-black ml-0.5">{t('trademark')}</sup>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Language Selector */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-2xl transition-all duration-300 backdrop-blur-md border ${theme === 'Dark'
                ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
                : 'bg-black/5 border-black/5 hover:bg-black/10 text-gray-800'
                }`}
            >
              <Globe className="w-4 h-4 md:w-5 md:h-5 opacity-70" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest block">
                {languages[language]?.title.split(' ')[0]}
              </span>
              <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform duration-300 ${showLangMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showLangMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute right-0 mt-3 w-64 md:w-72 rounded-3xl overflow-hidden shadow-2xl border backdrop-blur-2xl ${theme === 'Dark'
                    ? 'bg-[#12182B]/90 border-white/10 text-white'
                    : 'bg-white/90 border-black/5 text-gray-800'
                    }`}
                >
                  <div className="p-3 border-b border-black/5 dark:border-white/5">
                    <div className={`relative flex items-center rounded-xl px-3 py-2 ${theme === 'Dark' ? 'bg-white/5' : 'bg-black/5'}`}>
                      <Search className="w-4 h-4 opacity-50 mr-2" />
                      <input
                        type="text"
                        placeholder={t('searchLanguage')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs w-full font-bold"
                      />
                    </div>
                  </div>

                  <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-2">
                    {filteredLanguages.map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setLanguage(key);
                          setShowLangMenu(false);
                          setSearchQuery('');
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${language === key
                          ? (theme === 'Dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-50 text-purple-600')
                          : (theme === 'Dark' ? 'hover:bg-white/5' : 'hover:bg-black/5')
                          }`}
                      >
                        <span className={`text-[11px] md:text-xs font-black tracking-wide uppercase ${language === key ? '' : 'opacity-70'}`}>
                          {value.title}
                        </span>
                        {language === key && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <Check className="w-4 h-4" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                    {filteredLanguages.length === 0 && (
                      <div className="py-8 text-center text-xs opacity-50 font-bold uppercase tracking-widest">
                        {t('noLanguagesFound')}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2.5 md:p-1.5 transition-transform duration-150 group relative active:scale-95 touch-manipulation rounded-full ${theme === 'Dark' ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
            aria-label="Toggle Theme"
          >
            <AnimatePresence>
              <motion.div
                key={theme}
                initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 30 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="flex items-center justify-center"
              >
                {theme === 'Dark' ? (
                  <img
                    src="/sun.gif"
                    alt="Sun"
                    className="w-10 h-10 md:w-11 md:h-11 object-contain -scale-x-125 scale-y-125 drop-shadow-[0_0_15px_rgba(255,165,0,0.8)] filter brightness-110"
                  />
                ) : (
                  <img
                    src="/moon.gif"
                    alt="Moon"
                    className="w-8 h-8 md:w-9 md:h-9 object-contain -scale-x-110 scale-y-110 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] filter brightness-125 contrast-125"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

