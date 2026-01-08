import React, { useState, useEffect } from 'react';
import { X, Check, DollarSign, AlertCircle, Sparkles, Zap, Shield, Globe, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PricingConfigModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [selectedPlans, setSelectedPlans] = useState([]);
    const [currency, setCurrency] = useState('USD');
    const [prices, setPrices] = useState({});
    const [intervals, setIntervals] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    useEffect(() => {
        if (initialData) {
            setSelectedPlans(initialData.selectedPlans || []);
            setCurrency(initialData.currency || 'USD');
            setPrices(initialData.prices || {});
            setIntervals(initialData.intervals || {});
        }
    }, [initialData, isOpen]);

    const togglePlan = (plan) => {
        if (selectedPlans.includes(plan)) {
            setSelectedPlans(selectedPlans.filter(p => p !== plan));
            const newPrices = { ...prices }; delete newPrices[plan]; setPrices(newPrices);
            const newIntervals = { ...intervals }; delete newIntervals[plan]; setIntervals(newIntervals);
        } else {
            setSelectedPlans([...selectedPlans, plan]);
            if (plan !== 'Free') setIntervals(prev => ({ ...prev, [plan]: 'Monthly' }));
        }
    };

    const handlePriceChange = (plan, value) => setPrices({ ...prices, [plan]: value });
    const handleIntervalChange = (plan, value) => setIntervals({ ...intervals, [plan]: value });

    const validate = () => {
        setError('');
        if (selectedPlans.length === 0) {
            setError('Please select at least one plan to continue.');
            return false;
        }
        for (const plan of selectedPlans) {
            if (plan !== 'Free' && !prices[plan]) {
                setError(`Price configuration is required for the ${plan} tier.`);
                return false;
            }
        }
        return true;
    };

    const handleSave = () => {
        if (validate()) {
            onSave({ selectedPlans, currency, prices, intervals });
            onClose();
        }
    };

    if (!isOpen) return null;

    const planData = [
        {
            name: 'Free',
            icon: <Sparkles className="w-5 h-5" />,
            features: ['1 Week Discovery Access', '1,000 Messages / Mo', 'Community Support'],
            desc: 'Trial deployment protocols'
        },
        {
            name: 'Basic',
            icon: <Zap className="w-5 h-5" />,
            features: ['10,000 Messages / Mo', 'Standard latency', 'Email support'],
            desc: 'Growth-ready infrastructure'
        },
        {
            name: 'Pro',
            icon: <Shield className="w-5 h-5" />,
            features: ['Unlimited Messages', 'Priority support', 'Custom branding', 'Analytics suite'],
            desc: 'Enterprise-grade deployment',
            recommended: true
        }
    ];

    const currencyOptions = ['INR', 'USD', 'EUR', 'GBP'];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-gray-900/60 backdrop-blur-xl transition-all duration-500"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-white/95 rounded-[32px] w-full max-w-5xl shadow-[0_32px_120px_-20px_rgba(0,0,0,0.3)] border border-white/50 overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 md:p-10 border-b border-gray-100 flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">Choose Your <span className="text-[#8b5cf6]">Subscription Plan</span></h2>
                                <p className="text-xs md:text-sm font-bold text-gray-500 mt-2 tracking-tight">Configure your agent's revenue protocol for the global marketplace</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-3 hover:bg-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all duration-300 transform hover:rotate-90"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 md:p-10 flex-1 space-y-12">
                            {/* Currency Selection - Enhanced Visibility */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-br from-white/80 to-purple-50/50 backdrop-blur-md border border-purple-100/50 p-6 md:p-8 rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm"
                            >
                                <div className="space-y-1.5">
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-900">Transaction Currency</h4>
                                </div>
                                <div className="flex bg-gray-200/40 p-1.5 rounded-2xl border border-white/50 self-start shadow-inner">
                                    {currencyOptions.map(curr => (
                                        <motion.button
                                            key={curr}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setCurrency(curr)}
                                            className={`px-6 py-3 rounded-xl text-xs font-black transition-all duration-300 ${currency === curr
                                                ? 'bg-white text-gray-900 shadow-[0_4px_12px_rgba(0,0,0,0.05)] ring-1 ring-black/5 scale-105'
                                                : 'text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            {curr}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Plan Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {planData.map((plan, idx) => {
                                    const isSelected = selectedPlans.includes(plan.name);
                                    const isFree = plan.name === 'Free';

                                    return (
                                        <motion.div
                                            key={plan.name}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            onClick={() => togglePlan(plan.name)}
                                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                            className={`group relative p-8 rounded-[32px] border-2 cursor-pointer transition-all duration-300 flex flex-col h-full bg-white ${isSelected
                                                ? 'border-[#8b5cf6] shadow-2xl shadow-purple-500/15'
                                                : 'border-transparent bg-gray-50/50 hover:border-gray-200 hover:shadow-xl'
                                                }`}
                                        >
                                            {isSelected && (
                                                <div className="absolute inset-0 rounded-[30px] border-2 border-[#8b5cf6] animate-pulse opacity-20 pointer-events-none" />
                                            )}

                                            {plan.recommended && (
                                                <div className="absolute top-4 right-4 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse">
                                                    Recommended
                                                </div>
                                            )}

                                            <div className="space-y-6 flex-1">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isSelected ? 'bg-[#8b5cf6] text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-400 group-hover:text-[#8b5cf6]'
                                                    }`}>
                                                    {plan.icon}
                                                </div>

                                                <div>
                                                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{plan.name}</h3>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{plan.desc}</p>
                                                </div>

                                                <div className="pt-4 space-y-4">
                                                    {isFree ? (
                                                        <div className="text-3xl font-black text-gray-900 tracking-tighter">$0<span className="text-lg text-gray-400 ml-1">/forever</span></div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            <div className="space-y-2">
                                                                <label className="text-[10px] font-black uppercase tracking-widest text-[#8b5cf6] block ml-1">Enter your price</label>
                                                                <div className={`flex items-baseline gap-1 p-4 rounded-2xl border-2 transition-all group-focus-within:border-purple-400 group-focus-within:ring-4 group-focus-within:ring-purple-500/5 ${isSelected ? 'bg-purple-50/30 border-purple-100' : 'bg-white border-gray-100 hover:border-gray-200'
                                                                    }`}>
                                                                    <span className="text-3xl font-black text-gray-900 tracking-tighter">
                                                                        {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹'}
                                                                    </span>
                                                                    <input
                                                                        type="number"
                                                                        value={prices[plan.name] || ''}
                                                                        onChange={(e) => handlePriceChange(plan.name, e.target.value)}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                        className="w-full bg-transparent focus:outline-none text-3xl font-black text-gray-900 tracking-tighter placeholder:text-gray-200 cursor-text"
                                                                        placeholder="Set price"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="flex bg-gray-100 p-1.5 rounded-xl border border-gray-200/50">
                                                                {['Monthly', 'Yearly'].map(intv => (
                                                                    <button
                                                                        key={intv}
                                                                        onClick={(e) => { e.stopPropagation(); handleIntervalChange(plan.name, intv); }}
                                                                        className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${intervals[plan.name] === intv ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                                                            }`}
                                                                    >
                                                                        {intv}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="pt-6 space-y-3">
                                                    {plan.features.map(feat => (
                                                        <div key={feat} className="flex items-center gap-2 text-xs font-bold text-gray-600">
                                                            <Check size={14} className="text-[#8b5cf6] shrink-0" />
                                                            {feat}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="pt-8">
                                                <div className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-500 transform active:scale-95 ${isSelected
                                                    ? 'bg-gray-900 text-white shadow-xl translate-z-10'
                                                    : 'bg-white border border-gray-100 text-gray-400 group-hover:bg-gray-50'
                                                    }`}>
                                                    {isSelected ? <span className="flex items-center gap-2">Selected <Check size={14} strokeWidth={4} /></span> : 'Select Plan'}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Error Section */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-red-50 border border-red-100 p-5 rounded-2xl flex items-center gap-3 text-red-600"
                                    >
                                        <AlertCircle size={18} />
                                        <span className="text-xs font-black uppercase tracking-wide">{error}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Sticky Action Footer - Ultra High Visibility */}
                        <div className="sticky bottom-0 p-8 md:p-10 bg-white border-t border-gray-100 flex items-center justify-between gap-6 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.02)]">
                            <motion.button
                                whileHover={{ x: -2, backgroundColor: '#f3f4f6' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="px-10 py-5 text-xs font-black uppercase tracking-widest text-gray-600 hover:text-gray-900 rounded-2xl transition-all border border-gray-100 hover:border-gray-200"
                            >
                                Cancel
                            </motion.button>
                            <motion.button
                                whileHover={{ y: -2, scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSave}
                                className={`px-12 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-3 ${selectedPlans.length > 0
                                    ? 'bg-gradient-to-r from-[#7c3aed] to-[#c026d3] text-white shadow-[0_20px_40px_-10px_rgba(124,58,237,0.4)] hover:shadow-[0_25px_50px_-12px_rgba(124,58,237,0.5)]'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed opacity-60 shadow-none'
                                    }`}
                            >
                                Update Plan Configuration
                                <ChevronRight size={18} strokeWidth={4} />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PricingConfigModal;
