import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Cpu, Mail, Lock, User, ArrowLeft, AlertCircle, Sparkles, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiService } from '../services/apiService';
import { AppRoute, apis } from '../types';
import axios from 'axios';
import { setUserData, themeState } from '../userStore/userData.js';
import { useRecoilValue } from 'recoil';
import { logo } from '../constants';
import { useLanguage } from '../context/LanguageContext';
import TermsModal from '../Components/Landing/TermsModal';

const Signup = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const theme = useRecoilValue(themeState);
  const isDark = theme === 'Dark';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsViewed, setTermsViewed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showAgreementError, setShowAgreementError] = useState(false);

  const payLoad = { name, email, password }
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!termsAgreed) {
      setShowAgreementError(true);
      return;
    }
    setIsLoading(true)
    axios.post(apis.signUp, payLoad).then((res) => {
      setUserData(res.data)
      // Set active session flag for new user
      sessionStorage.setItem('activeSession', 'true');
      navigate(AppRoute.E_Verification);
    }).catch((err) => {
      console.log(err);
      setError(err.response.data.error)
    }).finally(() => {
      setIsLoading(false)
    })
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden px-4 transition-colors duration-500 ${isDark ? 'bg-[#0f172a]' : 'bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#fce7f3]'}`}>

      {/* Background Dreamy Orbs */}
      <div className="fixed inset-0 -z-10 bg-transparent">
        <div className={`absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full ${isDark ? 'bg-purple-900/30' : 'bg-purple-200/40'} blur-[120px] animate-orb-float-1`}></div>
        <div className={`absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full ${isDark ? 'bg-blue-900/20' : 'bg-blue-200/40'} blur-[120px] animate-orb-float-2`}></div>
      </div>

      <div className="relative z-10 w-full max-w-md my-10">

        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`inline-flex items-center justify-center w-24 h-24 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/60'} backdrop-blur-xl rounded-[32px] shadow-glass border mb-8 mx-auto group hover:rotate-12 transition-transform duration-500 ring-4 ${isDark ? 'ring-purple-500/10' : 'ring-white/20'}`}
          >
            <img src="/logo/Logo.png" alt="AI Mall Logo" className="w-20 h-20 object-contain drop-shadow-md" />
          </motion.div>
          <h2 className={`text-5xl font-black tracking-tighter mb-2 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('create')} <span className="text-[#8b5cf6] drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">{t('account')}.</span>
          </h2>
          <p className={`text-sm md:text-base font-medium transition-colors ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
            {t('initializeNeuralIdentity')}
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

          {error && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-8 p-5 rounded-3xl bg-red-50/50 border border-red-100/50 flex items-center gap-4 text-red-600 text-[11px] font-black uppercase tracking-wider"
            >
              <AlertCircle className="w-5 h-5 text-red-500" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

            {/* Name */}
            <div className="space-y-3">
              <label className={`text-[10px] font-black uppercase tracking-[0.25em] ml-2 ${isDark ? 'text-purple-300' : 'text-gray-400'}`}>
                {t('fullName')}
              </label>
              <div className="relative group/input">
                <User className={`absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${isDark ? 'text-purple-400 group-focus-within/input:text-white' : 'text-gray-400 group-focus-within/input:text-[#8b5cf6]'}`} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('namePlaceholder')}
                  className={`w-full border rounded-[24px] py-5 pl-16 pr-8 transition-all font-medium focus:outline-none focus:ring-4 ${isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder-white/20 focus:ring-purple-500/20'
                    : 'bg-white/60 border-white/80 text-gray-900 placeholder-gray-400 focus:ring-[#8b5cf6]/10 shadow-sm'
                    }`}
                  required
                />
              </div>
            </div>

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
                      key={showPassword ? 'eye' : 'eye-off'}
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

            {/* Terms of Service Checkbox */}
            <div className="space-y-4 px-2">
              <div className="flex items-start gap-3 group cursor-pointer" onClick={() => termsViewed && setTermsAgreed(!termsAgreed)}>
                <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${termsAgreed
                  ? 'bg-[#8B5CF6] border-[#8B5CF6]'
                  : (termsViewed ? 'border-purple-300' : 'border-gray-200 bg-gray-50/50 cursor-not-allowed')
                  }`}>
                  {termsAgreed && <CheckCircle2 size={12} className="text-white" />}
                </div>
                <p className={`text-[11px] font-bold leading-relaxed transition-colors ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
                  {t('signupAgreeText')} {' '}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setShowTermsModal(true); }}
                    className="text-[#8B5CF6] hover:underline underline-offset-4"
                  >
                    {t('signupTerms')}
                  </button>
                  {' '} {t('signupAnd')} {' '}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setShowTermsModal(true); }}
                    className="text-[#8B5CF6] hover:underline underline-offset-4"
                  >
                    {t('signupPrivacy')}
                  </button>{t('signupAgreedTail')}
                </p>
              </div>

              {showAgreementError && !termsAgreed && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-8"
                >
                  {t('signupAgreeError')}
                </motion.p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !termsAgreed}
              className={`w-full py-5 rounded-[24px] font-black text-[14px] uppercase tracking-widest transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 shadow-[0_15px_30px_-5px_rgba(139,92,246,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(139,92,246,0.5)] ${termsAgreed
                ? 'bg-[#8B5CF6] hover:bg-[#7c3aed] text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50 shadow-none hover:shadow-none'
                }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <> <Sparkles size={18} /> {t('signUp')} </>
              )}
            </button>
          </form>

          {/* Terms Modal */}
          <TermsModal
            isOpen={showTermsModal}
            onClose={() => setShowTermsModal(false)}
            onViewed={() => {
              setTermsViewed(true);
              setShowAgreementError(false);
            }}
          />

          {/* Footer Login Link */}
          <div className="mt-12 text-center relative z-10">
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-6 opacity-60">
              {t('alreadyRegistered')}
            </p>
            <Link to="/login" className="w-full py-5 bg-[#8B5CF6] hover:bg-[#7c3aed] rounded-[24px] font-black text-[14px] uppercase tracking-widest shadow-[0_15px_30px_-5px_rgba(139,92,246,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(139,92,246,0.5)] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
              <Sparkles size={18} className="text-white" /> <span className="text-white">{t('signIn')}</span>
            </Link>
          </div>
        </motion.div>

        {/* Back Home */}
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

export default Signup;
