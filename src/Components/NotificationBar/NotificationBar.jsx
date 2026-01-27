import React from 'react';
import { Laptop, X, AlertCircle, CheckCircle } from 'lucide-react';
import { toggleState, themeState } from '../../userStore/userData';
import { useRecoilState, useRecoilValue } from 'recoil';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationBar = ({ msg, error }) => {
  const [notifiyTgl, setNotifyTgl] = useRecoilState(toggleState);
  const theme = useRecoilValue(themeState);
  const isDark = theme === 'Dark';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="fixed top-8 right-8 z-[10000]"
      >
        <div className={`
          flex items-center gap-4 px-6 py-4 rounded-[24px] shadow-2xl border backdrop-blur-3xl transition-colors duration-500
          ${error
            ? (isDark ? 'bg-red-950/80 border-red-500/20 text-red-100' : 'bg-red-50/80 border-red-200 text-red-900')
            : (isDark ? 'bg-[#161D35]/80 border-[#8B5CF6]/20 text-[#E6E9F2]' : 'bg-white/80 border-white text-gray-900')
          }
        `}>
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-lg transition-colors
            ${error ? 'bg-red-500 text-white' : (isDark ? 'bg-[#8B5CF6] text-white' : 'bg-gray-900 text-white')}
          `}>
            {error ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          </div>

          <div className="flex flex-col">
            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${error ? 'text-red-400' : (isDark ? 'text-[#6F76A8]' : 'text-gray-400')}`}>
              {error ? 'System Alert' : 'System Notification'}
            </span>
            <span className={`text-sm font-bold leading-tight max-w-[200px] transition-colors ${isDark ? 'text-[#E6E9F2]' : 'text-slate-900'}`}>{msg}</span>
          </div>

          <button
            onClick={() => { setNotifyTgl({ ...notifiyTgl, notify: false }) }}
            className={`
              p-2 rounded-full transition-all ml-2
              ${error ? (isDark ? 'hover:bg-red-900/40 text-red-400' : 'hover:bg-red-100 text-red-700') : (isDark ? 'hover:bg-white/10 text-[#6F76A8]' : 'hover:bg-gray-100 text-gray-500')}
            `}
          >
            <X size={18} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default NotificationBar;
