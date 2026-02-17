import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { Mail, CheckCircle, ArrowLeft, AlertCircle, Pencil, Sparkles, Lock } from 'lucide-react';
import { AppRoute, apis } from '../types';
import { apiService } from '../services/apiService';
import axios from 'axios';
import { getUserData, setUserData } from '../userStore/userData';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import Logo from '../assets/Logo.svg';

export default function VerificationForm() {
    const { t, language } = useLanguage();
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [successMessage, setSuccessMessage] = useState('');

    const email = getUserData("user")?.email || "User";
    const navigator = useNavigate();

    // Cooldown timer effect
    React.useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        axios.post(apis.emailVerificationApi, { code: verificationCode, email, language }).then((res) => {
            console.log(res);
            setUserData(res.data)
            navigator(AppRoute.DASHBOARD)

        }).catch((err) => {
            console.log(err);
            setError(err.response?.data?.error || t('verificationFailed'));

        }).finally(() => {
            setLoading(false);
        })
    };

    const handleResendOTP = async () => {
        if (resendCooldown > 0) return;

        setResendLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await axios.post(`${apis.emailVerificationApi}/resend`, { email, language });
            setSuccessMessage(t('verificationCodeResent'));
            setResendCooldown(60); // 60 second cooldown
        } catch (err) {
            console.error('Resend OTP error:', err);
            setError(err.response?.data?.error || 'Failed to resend code. Please try again.');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#fce7f3] relative overflow-hidden">

            {/* Background Dreamy Orbs */}
            <div className="fixed inset-0 -z-10 bg-transparent">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-purple-200/40 blur-[120px] animate-orb-float-1"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-200/40 blur-[120px] animate-orb-float-2"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">

                {/* Header */}
                <div className="text-center mb-0">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="mb-0 mx-auto flex items-center justify-center p-0"
                    >
                        <img src={Logo} alt="AI Mall Logo" className="w-32 h-32 object-contain" />
                    </motion.div>
                </div>

                <div className="text-center mb-10">
                    <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">{t('verify')} <span className="text-[#8b5cf6]">{t('recovery') || 'Identity'}.</span></h2>
                    <p className="text-gray-500 font-black tracking-[0.2em] text-[10px] opacity-70">
                        <span className="uppercase">{t('confirmingNeuralLink')}</span> <span className="text-[#8b5cf6] lowercase">{email}</span>
                    </p>

                    <button
                        onClick={() => navigator(AppRoute.SIGNUP)}
                        className="mt-4 px-5 py-2 rounded-full bg-white/40 border border-white/60 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-[#8b5cf6] hover:bg-white transition-all shadow-sm flex items-center gap-2 mx-auto"
                    >
                        <Pencil className="w-3 h-3" /> {t('editAddress')}
                    </button>
                </div>

                {/* Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/40 backdrop-blur-3xl p-10 rounded-[48px] border border-white/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden group"
                >
                    {/* Subtle Glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8b5cf6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

                    {/* Error */}
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

                    {/* Success Message */}
                    {successMessage && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mb-8 p-5 rounded-3xl bg-green-50/50 border border-green-100/50 flex items-center gap-4 text-green-600 text-[11px] font-black uppercase tracking-wider"
                        >
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            {successMessage}
                        </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleVerify} className="space-y-8 relative z-10">
                        <div className="space-y-3 text-center">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">
                                {t('enterVerificationCode')}
                            </label>

                            <div className="relative group/input">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within/input:text-[#8b5cf6] transition-colors" />
                                <input
                                    type="text"
                                    maxLength={6}
                                    required
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value)}
                                    placeholder="000000"
                                    className="w-full bg-white/60 border border-white/80 rounded-[24px] py-5 text-center text-3xl tracking-[0.5em] text-gray-900 font-black placeholder-gray-300 focus:outline-none focus:ring-4 focus:ring-[#8b5cf6]/10 shadow-sm transition-all font-mono"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-[#8B5CF6] hover:bg-[#7c3aed] text-white rounded-[24px] font-black text-[14px] uppercase tracking-widest shadow-[0_15px_30px_-5px_rgba(139,92,246,0.4)] hover:shadow-[0_20px_40px_-5px_rgba(139,92,246,0.5)] transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <> <CheckCircle size={18} /> {t('verify')} </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        {t('didntReceiveCode')}{' '}
                        <button
                            onClick={handleResendOTP}
                            disabled={resendLoading || resendCooldown > 0}
                            className="text-[#8b5cf6] hover:text-[#7c3aed] transition-colors font-black ml-1 uppercase hover:blur-[0.5px] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {resendLoading ? t('sending') : resendCooldown > 0 ? `${t('wait') || 'Wait'} ${resendCooldown}${t('seconds') || 's'}` : t('resendCode')}
                        </button>
                    </div>
                </motion.div>

                {/* Back link */}
                <Link
                    to={AppRoute.SIGNUP}
                    className="mt-12 flex items-center justify-center gap-3 text-gray-400 hover:text-gray-900 transition-all font-black text-[10px] uppercase tracking-[0.3em]"
                >
                    <ArrowLeft className="w-4 h-4" strokeWidth={3} /> {t('returnToRegistration')}
                </Link>
            </div >
        </div >
    );
}
