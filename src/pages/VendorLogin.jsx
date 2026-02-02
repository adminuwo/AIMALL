import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, Lock, Loader2, AlertCircle, Clock, XCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import apiService from '../services/apiService';

const VendorLogin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [statusMessage, setStatusMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setStatusMessage(null);

        if (!formData.email || !formData.password) {
            setError('Please enter both email and password');
            return;
        }

        setLoading(true);
        try {
            const response = await apiService.loginVendor({
                email: formData.email,
                password: formData.password
            });

            if (response.success) {
                // Store token and user data
                const userData = { ...response.user, token: response.token };
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(userData));

                // Redirect to vendor dashboard
                navigate('/vendor/overview');
            }
        } catch (err) {
            const errorData = err.response?.data;

            // Handle different vendor statuses
            if (errorData?.vendorStatus === 'pending') {
                setStatusMessage({
                    type: 'pending',
                    message: errorData.message || 'Your registration is under admin review.'
                });
            } else if (errorData?.vendorStatus === 'rejected') {
                setStatusMessage({
                    type: 'rejected',
                    message: errorData.message || 'Your vendor application was rejected.',
                    reason: errorData.rejectionReason
                });
            } else {
                setError(errorData?.message || 'Invalid email or password');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setStatusMessage(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#fce7f3] flex items-center justify-center p-6">
            {/* Background Orbs */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-200/30 blur-[120px]"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/30 blur-[120px]"></div>
                <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-pink-200/20 blur-[100px]"></div>
            </div>

            <div className="w-full max-w-md bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[48px] p-12 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
                        Vendor <span className="text-[#8b5cf6]">Login</span>
                    </h1>
                    <p className="text-slate-600 font-medium">Access your vendor dashboard</p>
                </div>

                {/* Status Messages */}
                {statusMessage && (
                    <div className={`mb-6 rounded-2xl p-6 border ${statusMessage.type === 'pending'
                        ? 'bg-amber-50 border-amber-200'
                        : 'bg-red-50 border-red-200'
                        }`}>
                        <div className="flex items-start gap-3">
                            {statusMessage.type === 'pending' ? (
                                <Clock className="w-6 h-6 text-amber-500 shrink-0" />
                            ) : (
                                <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                            )}
                            <div className="flex-1">
                                <h3 className={`font-bold text-sm mb-2 ${statusMessage.type === 'pending' ? 'text-amber-900' : 'text-red-900'
                                    }`}>
                                    {statusMessage.type === 'pending' ? 'Pending Approval' : 'Application Rejected'}
                                </h3>
                                <p className={`text-sm font-medium ${statusMessage.type === 'pending' ? 'text-amber-700' : 'text-red-700'
                                    }`}>
                                    {statusMessage.message}
                                </p>
                                {statusMessage.reason && (
                                    <div className="mt-3 pt-3 border-t border-red-200">
                                        <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Reason:</p>
                                        <p className="text-sm text-red-700">{statusMessage.reason}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-white/60 border border-white/80 rounded-[24px] pl-12 pr-4 py-4 text-sm outline-none focus:ring-4 focus:ring-[#8b5cf6]/10 transition-all font-medium"
                                placeholder="vendor@example.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">
                            Password
                        </label>
                        <div className="relative flex items-center">
                            <div className="absolute left-4 inset-y-0 flex items-center pointer-events-none">
                                <Lock className="w-5 h-5 text-slate-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-white/60 border border-white/80 rounded-[24px] pl-12 pr-12 py-4 text-sm outline-none focus:ring-4 focus:ring-[#8b5cf6]/10 transition-all font-medium"
                                placeholder="Enter your password"
                                required
                            />
                            <div className="absolute right-4 inset-y-0 flex items-center">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95 hover:bg-slate-100/50"
                                >
                                    <motion.div
                                        key={showPassword ? 'eye' : 'eye-off'}
                                        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                                        transition={{ duration: 0.2, ease: "easeOut" }}
                                    >
                                        {showPassword ? (
                                            <Eye className="w-4 h-4 text-slate-400" />
                                        ) : (
                                            <EyeOff className="w-4 h-4 text-slate-400" />
                                        )}
                                    </motion.div>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-right -mt-2">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-[#8b5cf6] font-bold hover:underline transition-all"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#8b5cf6] text-white py-4 rounded-full text-sm font-black uppercase tracking-widest hover:bg-[#7c3aed] transition-all shadow-lg shadow-[#8b5cf6]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            'Login'
                        )}
                    </button>

                    {/* Register Link */}
                    <p className="text-center text-sm text-slate-600 font-medium">
                        New vendor?{' '}
                        <Link to="/vendor-register" className="text-[#8b5cf6] font-bold hover:underline">
                            Register here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default VendorLogin;
