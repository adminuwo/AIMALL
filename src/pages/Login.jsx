import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router';
import { Cpu, Mail, Lock, ArrowLeft, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { apis, AppRoute } from '../types';
import { setUserData, userData as userDataAtom, themeState } from '../userStore/userData';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { useLanguage } from '../context/LanguageContext';

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useRecoilValue(themeState);
  const isDark = theme === 'Dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const setUserRecoil = useSetRecoilState(userDataAtom);

  const payload = { email, password }
  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("")
    setLoading(true)
    axios.post(apis.logIn, payload).then((res) => {
      setError(false)
      setMessage(res.data.message)
      const from = location.state?.from?.pathname || AppRoute.DASHBOARD;
      navigate(from, { replace: true });
      setUserData(res.data)
      setUserRecoil({ user: res.data })
      localStorage.setItem("userId", res.data.id)
      localStorage.setItem("token", res.data.token)
      // Set active session flag to prevent auto-logout
      sessionStorage.setItem('activeSession', 'true');


    }).catch((err) => {
      console.log(err.response?.data?.error);
      setError(true)
      const errorMsg = err.response?.data?.error || "Something went Wrong";
      const detailMsg = err.response?.data?.details ? ` (${err.response.data.details})` : "";
      setMessage(errorMsg + detailMsg);
    }).finally(() => {
      setLoading(false)
    })
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden px-4 transition-colors duration-500 ${isDark ? 'bg-[#0f172a]' : 'bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#fce7f3]'}`}>

      {/* Background Dreamy Orbs */}
      <div className="fixed inset-0 -z-10 bg-transparent">
        <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full ${isDark ? 'bg-purple-900/30' : 'bg-purple-200/40'} blur-[120px] animate-orb-float-1`}></div>
        <div className={`absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full ${isDark ? 'bg-blue-900/20' : 'bg-blue-200/40'} blur-[120px] animate-orb-float-2`}></div>
        <div className={`absolute top-[40%] left-[30%] w-[50%] h-[50%] rounded-full ${isDark ? 'bg-pink-900/10' : 'bg-pink-200/30'} blur-[100px] animate-orb-float-3`}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center justify-center w-24 h-24 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/60'} backdrop-blur-xl rounded-[32px] shadow-glass border mb-8 mx-auto group hover:rotate-12 transition-transform duration-500 ring-4 ${isDark ? 'ring-purple-500/10' : 'ring-white/20'}`}
          >
            <img src="/logo/Logo.png" alt="AI Mall Logo" className="w-20 h-20 object-contain drop-shadow-md" />
          </motion.div>

          <h2 className={`text-3xl md:text-5xl font-black tracking-tighter mb-2 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('secure')} <span className="text-[#8b5cf6] drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">{t('access')}.</span>
          </h2>
          <p className={`text-sm md:text-base font-medium transition-colors ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
            {t('initializeNeuralSession')}
          </p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`p-6 md:p-10 rounded-[32px] md:rounded-[48px] border relative overflow-hidden group transition-all duration-500 ${isDark
            ? 'bg-white/5 border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.4)]'
            : 'bg-white/40 border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] backdrop-blur-3xl'
            }`}
        >
          {/* Subtle Glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8 p-5 rounded-3xl bg-red-50/50 border border-red-100/50 flex items-center gap-4 text-red-600 text-[11px] font-black uppercase tracking-wider"
            >
              <AlertCircle className="w-5 h-5 text-red-500" />
              {message}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

            {/* Email */}
            <div className="space-y-3">
              <label className={`text-[10px] font-black uppercase tracking-[0.25em] ml-2 ${isDark ? 'text-purple-300' : 'text-gray-400'}`}>
                {t('emailAddress')}
              </label>
              <div className="relative group/input">
                <Mail className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDark ? 'text-purple-400 group-focus-within/input:text-white' : 'text-gray-400 group-focus-within/input:text-[#8b5cf6]'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  className={`w-full border rounded-[24px] py-5 pl-16 pr-8 transition-all font-medium focus:outline-none focus:ring-4 ${isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder-white/20 focus:ring-purple-500/20'
                    : 'bg-white/60 border-white/80 text-gray-900 placeholder-gray-400 focus:ring-[#8b5cf6]/10 shadow-sm'
                    }`}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-3">
              <label className={`text-[10px] font-black uppercase tracking-[0.25em] ml-2 ${isDark ? 'text-purple-300' : 'text-gray-400'}`}>
                {t('password')}
              </label>
              <div className="relative group/input flex items-center">
                <div className="absolute left-6 inset-y-0 flex items-center pointer-events-none">
                  <Lock className={`w-5 h-5 transition-colors ${isDark ? 'text-purple-400 group-focus-within/input:text-white' : 'text-gray-400 group-focus-within/input:text-[#8b5cf6]'}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('passwordPlaceholder')}
                  className={`w-full border rounded-[24px] py-5 pl-16 pr-14 transition-all font-medium focus:outline-none focus:ring-4 ${isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder-white/20 focus:ring-purple-500/20'
                    : 'bg-white/60 border-white/80 text-gray-900 placeholder-gray-400 focus:ring-[#8b5cf6]/10 shadow-sm'
                    }`}
                  required
                />
                <div className="absolute right-4 inset-y-0 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${isDark ? 'hover:bg-white/10' : 'hover:bg-[#8b5cf6]/10'}`}
                  >
                    <motion.div
                      key={showPassword ? 'eye-off' : 'eye'}
                      initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      {showPassword ? (
                        <Eye className={`w-5 h-5 transition-colors ${isDark ? 'text-purple-400 group-focus-within/input:text-white' : 'text-gray-400 group-focus-within/input:text-[#8b5cf6]'}`} />
                      ) : (
                        <EyeOff className={`w-5 h-5 transition-colors ${isDark ? 'text-purple-400 group-focus-within/input:text-white' : 'text-gray-400 group-focus-within/input:text-[#8b5cf6]'}`} />
                      )}
                    </motion.div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end px-2">
              <Link to="/forgot-password" size="sm" className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isDark ? 'text-purple-300 hover:text-white' : 'text-gray-500 hover:text-[#8b5cf6]'}`}>
                {t('forgotPassword')}
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-[#8B5CF6] hover:bg-[#7c3aed] text-white rounded-[24px] font-black text-[14px] uppercase tracking-widest shadow-[0_15px_30px_-5px_rgba(139,92,246,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(139,92,246,0.5)] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <> <Sparkles size={18} /> {t('signIn')} </>
              )}
            </button>
          </form>

          {/* Signup Redirect */}
          <div className="mt-12 text-center relative z-10">
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-6 opacity-60">
              {t('dontHaveAccount')}
            </p>
            <Link to="/signup" className="w-full py-5 bg-[#8B5CF6] hover:bg-[#7c3aed] rounded-[24px] font-black text-[14px] uppercase tracking-widest shadow-[0_15px_30px_-5px_rgba(139,92,246,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(139,92,246,0.5)] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
              <Sparkles size={18} className="text-white" /> <span className="text-white">{t('signUp')}</span>
            </Link>
          </div>
        </motion.div>

        {/* Back to Home */}
        <Link
          to="/"
          className={`mt-12 flex items-center justify-center gap-3 transition-all font-black text-[10px] uppercase tracking-[0.3em] group ${isDark ? 'text-white' : 'text-gray-400 hover:text-gray-900'}`}
        >
          <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${isDark ? 'text-purple-400' : ''}`} strokeWidth={3} /> {t('returnToHome')}
        </Link>

      </div>
    </div>
  );
};

export default Login;
