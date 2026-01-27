import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilState, useRecoilValue } from 'recoil';
import { toggleState, themeState, userData } from '../../userStore/userData';
import { X, Zap, CheckCircle, CreditCard, ShieldCheck } from 'lucide-react';
import { apis } from '../../types';
import axios from 'axios';

const SubscriptionForm = ({ id }) => {
  const [subscripTgl, setSubscripTgl] = useRecoilState(toggleState)
  const theme = useRecoilValue(themeState);
  const isDark = theme === 'Dark';
  const currentUserData = useRecoilValue(userData);
  const user = currentUserData.user;
  const userId = user?.id || user?._id;
  console.log("SubscriptionForm: Using userId:", userId);


  function buyAgent(e) {
    e.preventDefault();

    if (!userId) {
      console.error("User ID missing or not logged in");
      return;
    }
    axios.post(`${apis.buyAgent}/${id}`, { userId })
      .then((res) => {
        setSubscripTgl({ ...subscripTgl, subscripPgTgl: false, notify: true });
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }


  return (
    <AnimatePresence>
      <div className={`fixed inset-0 z-[9999] ${isDark ? 'bg-[#0B0F1A]/80' : 'bg-gray-900/60'} backdrop-blur-md flex justify-center items-center p-4`}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          className="w-full max-w-md relative"
        >
          {/* Decorative Elements */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#8b5cf6]/20 rounded-full blur-[80px] pointer-events-none" />
          <div className={`absolute -bottom-20 -right-20 w-64 h-64 bg-[#d946ef]/20 rounded-full blur-[80px] pointer-events-none`} />

          <div className={`${isDark ? 'bg-[#161D35] border-[#8B5CF6]/10' : 'bg-white/40 border-white/60'} backdrop-blur-3xl rounded-[48px] border shadow-2xl overflow-hidden relative z-10`}>
            {/* Header */}
            <div className="p-8 pb-0 text-center relative">
              <button onClick={() => { setSubscripTgl({ ...subscripTgl, subscripPgTgl: false }) }} className={`absolute top-6 right-6 p-2 rounded-full ${isDark ? 'bg-white/5 text-[#6F76A8] hover:bg-white/10' : 'bg-white/40 text-gray-500 hover:bg-white hover:text-red-500'} transition-all shadow-sm group`}>
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              </button>
              <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-[#d946ef] to-[#8b5cf6] mx-auto flex items-center justify-center shadow-lg shadow-purple-500/30 mb-6">
                <Zap className="w-8 h-8 text-white fill-white" />
              </div>
              <h2 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-gray-900'} tracking-tighter uppercase mb-2`}>Upgrade Access</h2>
              <p className={`${isDark ? 'text-white' : 'text-gray-500'} font-bold text-sm tracking-tight px-4 opacity-80`}>Unlock advanced neural capabilities for this agent node.</p>
            </div>

            {/* Plans */}
            <form className="p-8 space-y-4">
              <label className="relative block group cursor-pointer">
                <input defaultValue="free" id="free" name="plan" type="radio" className="peer sr-only" />
                <div className={`p-5 rounded-[24px] ${isDark ? 'bg-[#0B0F1A] border-2 border-transparent peer-checked:border-[#8B5CF6] peer-checked:bg-[#12182B]' : 'bg-white/40 border-2 border-transparent peer-checked:border-[#8b5cf6] peer-checked:bg-white/60'} transition-all flex items-center justify-between group-hover:bg-white/50`}>
                  <div className="flex flex-col">
                    <span className={`text-sm font-black ${isDark ? 'text-white' : 'text-gray-900'} uppercase tracking-wide`}>Trial Node</span>
                    <span className={`text-xs ${isDark ? 'text-[#AAB0D6]' : 'text-gray-500'} font-bold`}>Limited bandwidth</span>
                  </div>
                  <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>Free</span>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 right-4 w-6 h-6 rounded-full border-2 border-gray-300 peer-checked:border-[#8b5cf6] peer-checked:bg-[#8b5cf6] transition-all flex items-center justify-center scale-0 peer-checked:scale-100">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </label>

              <label className="relative block group cursor-pointer">
                <input defaultValue="monthly" id="monthly" name="plan" type="radio" className="peer sr-only" />
                <div className={`p-5 rounded-[24px] ${isDark ? 'bg-[#0B0F1A] border-2 border-transparent peer-checked:border-[#8B5CF6] peer-checked:bg-[#12182B]' : 'bg-white/40 border-2 border-transparent peer-checked:border-[#8b5cf6] peer-checked:bg-white/60'} transition-all flex items-center justify-between group-hover:bg-white/50 relative overflow-hidden`}>
                  <div className={`absolute top-0 right-0 px-3 py-1 ${isDark ? 'bg-[#8B5CF6]' : 'bg-[#8b5cf6]'} text-white text-[9px] font-black uppercase tracking-widest rounded-bl-2xl`}>Usually Selected</div>
                  <div className="flex flex-col">
                    <span className={`text-sm font-black ${isDark ? 'text-white' : 'text-gray-900'} uppercase tracking-wide`}>Standard Link</span>
                    <span className={`text-xs ${isDark ? 'text-[#AAB0D6]' : 'text-gray-500'} font-bold`}>Full feature access</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>₹49</span>
                    <span className={`text-[10px] block ${isDark ? 'text-[#AAB0D6]' : 'text-gray-400'} font-bold text-right uppercase`}>/ Month</span>
                  </div>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 right-4 w-6 h-6 rounded-full border-2 border-gray-300 peer-checked:border-[#8b5cf6] peer-checked:bg-[#8b5cf6] transition-all flex items-center justify-center scale-0 peer-checked:scale-100 scale-x-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </label>

              <label className="relative block group cursor-pointer">
                <input defaultValue="annual" id="annual" name="plan" type="radio" className="peer sr-only" />
                <div className={`p-5 rounded-[24px] ${isDark ? 'bg-[#0B0F1A] border-2 border-transparent peer-checked:border-[#8B5CF6] peer-checked:bg-[#12182B]' : 'bg-white/40 border-2 border-transparent peer-checked:border-[#8b5cf6] peer-checked:bg-white/60'} transition-all flex items-center justify-between group-hover:bg-white/50`}>
                  <div className="flex flex-col">
                    <span className={`text-sm font-black ${isDark ? 'text-white' : 'text-gray-900'} uppercase tracking-wide`}>Quantum Link</span>
                    <span className={`text-xs text-green-600 font-bold uppercase tracking-wide ${isDark ? 'bg-green-900/20' : 'bg-green-100'} px-2 py-0.5 rounded-lg w-max mt-1`}>Save 20%</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-gray-900'}`}>₹228</span>
                    <span className={`text-[10px] block ${isDark ? 'text-[#AAB0D6]' : 'text-gray-400'} font-bold text-right uppercase`}>/ Year</span>
                  </div>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 right-4 w-6 h-6 rounded-full border-2 border-gray-300 peer-checked:border-[#8b5cf6] peer-checked:bg-[#8b5cf6] transition-all flex items-center justify-center scale-0 peer-checked:scale-100">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              </label>

              <button
                type="button"
                onClick={buyAgent}
                className={`w-full py-5 ${isDark ? 'bg-[#8B5CF6] hover:bg-[#7c3aed]' : 'bg-gray-900 hover:bg-[#8b5cf6]'} text-white rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all mt-4 flex items-center justify-center gap-3 group`}
              >
                <CreditCard className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Initialize Subscription
              </button>

              <div className={`flex items-center justify-center gap-2 text-[10px] ${isDark ? 'text-[#AAB0D6]' : 'text-gray-400'} font-bold uppercase tracking-wider pt-2`}>
                <ShieldCheck className="w-3 h-3" /> Secure Payment Gateway
              </div>

            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default SubscriptionForm;
