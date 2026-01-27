import React, { useState, useEffect } from 'react';
import { AlertCircle, Server, ShieldAlert, Settings, Activity, Lock, User, Camera, Mail, Save, Loader2, Users, Calendar, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../../services/apiService';
import { useToast } from '../../Components/Toast/ToastContext';

const PlatformSettings = () => {
    const toast = useToast();
    const [maintenance, setMaintenance] = useState(false);
    const [killSwitch, setKillSwitch] = useState(false);
    const [reqLimit, setReqLimit] = useState(1);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        avatar: ''
    });
    const [admins, setAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [fetchingAdmins, setFetchingAdmins] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [platformConfig, setPlatformConfig] = useState({
        platformName: 'AI-MALL',
        contactEmail: 'support@aimall.com'
    });
    const [savingConfig, setSavingConfig] = useState(false);

    const handleDeleteAdmin = async (id) => {
        try {
            setLoading(true);
            await apiService.deleteUser(id);
            toast.success("Administrator removed successfully");
            setSelectedAdmin(null);
            setConfirmDelete(false);
            fetchAdmins();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to remove administrator");
        } finally {
            setLoading(false);
        }
    };

    const fetchAdmins = async () => {
        try {
            setFetchingAdmins(true);
            const data = await apiService.getAdmins();
            setAdmins(data);
        } catch (error) {
            console.error("Failed to fetch admins", error);
        } finally {
            setFetchingAdmins(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const data = await apiService.getAdminSettings();
            setPlatformConfig({
                platformName: data.platformName || 'AI-MALL',
                contactEmail: data.contactEmail || 'support@aimall.com'
            });
            setMaintenance(data.maintenanceMode || false);
            setKillSwitch(data.globalKillSwitch || false);
            setReqLimit(data.globalRateLimit ? (data.globalRateLimit / 1000) : 1);
        } catch (error) {
            console.error("Failed to fetch settings", error);
        }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setProfile({
            name: user.name || 'Admin User',
            email: user.email || 'admin@uwo24.com', // Updated to new admin email
            avatar: user.avatar || ''
        });
        fetchAdmins();
        fetchSettings();
    }, []);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const url = await apiService.uploadFile(file);
            setProfile(prev => ({ ...prev, avatar: url }));
            toast.success("Avatar uploaded successfully!");
        } catch (error) {
            toast.error("Failed to upload avatar");
        }
    };

    const handleSaveProfile = async () => {
        try {
            setLoading(true);
            const updatedUser = await apiService.updateProfile(profile);

            // Update local storage to persist changes across refresh
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const newUser = { ...currentUser, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(newUser));

            toast.success("Profile updated successfully!");
            // Notify other components that profile was updated
            window.dispatchEvent(new Event('profileUpdated'));
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveConfig = async () => {
        try {
            setSavingConfig(true);
            await apiService.updateAdminSettings({
                platformName: platformConfig.platformName,
                contactEmail: platformConfig.contactEmail
            });
            toast.success("Configuration saved successfully!");
        } catch (error) {
            toast.error("Failed to save configuration");
        } finally {
            setSavingConfig(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 pb-24"
        >
            <div className="flex items-center gap-3 mb-4">
                <Settings className="w-6 h-6 text-[#8b5cf6]" />
                <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Platform Settings & Safety</h2>
            </div>

            {/* User Profile Configuration */}
            <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[32px] p-8 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-[#d946ef]/10 rounded-2xl text-[#d946ef]">
                        <User className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">User Profile</h2>
                        <p className="text-gray-500 font-medium text-xs mt-0.5">Manage your personal admin account details</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#d946ef] to-[#8b5cf6] p-1 shadow-2xl relative group cursor-pointer overflow-hidden">
                            <div className="w-full h-full rounded-full bg-white overflow-hidden relative">
                                {profile.avatar ? (
                                    <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                        <User className="w-12 h-12" />
                                    </div>
                                )}
                                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Camera className="w-8 h-8 text-white" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                                </label>
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Profile Picture</p>
                    </div>

                    {/* Profile Fields */}
                    <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    name="name"
                                    value={profile.name}
                                    onChange={handleProfileChange}
                                    className="w-full bg-white/50 border border-gray-200 rounded-[16px] px-5 py-3 pl-12 font-bold text-sm text-gray-900 outline-none focus:ring-4 focus:ring-[#d946ef]/10 focus:border-[#d946ef] transition-all placeholder:text-gray-300"
                                />
                                <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#d946ef] transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    name="email"
                                    value={profile.email}
                                    onChange={handleProfileChange}
                                    className="w-full bg-white/50 border border-gray-200 rounded-[16px] px-5 py-3 pl-12 font-bold text-sm text-gray-900 outline-none focus:ring-4 focus:ring-[#d946ef]/10 focus:border-[#d946ef] transition-all placeholder:text-gray-300"
                                />
                                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#d946ef] transition-colors" />
                            </div>
                        </div>

                        <div className="md:col-span-2 flex justify-end">
                            <button
                                onClick={handleSaveProfile}
                                disabled={loading}
                                className="px-8 py-3 bg-[#d946ef] text-white rounded-[16px] font-black text-[10px] uppercase tracking-widest hover:bg-[#c026d3] shadow-lg shadow-[#d946ef]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                Save Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* General Config */}
            <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[32px] p-8 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2 uppercase">
                        <Settings className="w-5 h-5 text-[#8b5cf6]" />
                        General Configuration
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Platform Name</label>
                        <input
                            type="text"
                            value={platformConfig.platformName}
                            onChange={(e) => setPlatformConfig({ ...platformConfig, platformName: e.target.value })}
                            className="w-full bg-white/60 border border-white/80 rounded-[16px] px-6 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-4 focus:ring-[#8b5cf6]/10 transition-all uppercase tracking-wide placeholder-gray-400"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-2">Contact Email</label>
                        <input
                            type="text"
                            value={platformConfig.contactEmail}
                            onChange={(e) => setPlatformConfig({ ...platformConfig, contactEmail: e.target.value })}
                            className="w-full bg-white/60 border border-white/80 rounded-[16px] px-6 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-4 focus:ring-[#8b5cf6]/10 transition-all tracking-wide placeholder-gray-400"
                        />
                    </div>
                    <div className="md:col-span-2 flex justify-end mt-4">
                        <button
                            onClick={handleSaveConfig}
                            disabled={savingConfig}
                            className="px-8 py-3 bg-[#d946ef] text-white rounded-[16px] font-black text-[10px] uppercase tracking-widest hover:bg-[#c026d3] shadow-lg shadow-[#d946ef]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-70"
                        >
                            {savingConfig ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Configuration
                        </button>
                    </div>
                </div>
            </div>

            {/* Platform Administrators */}
            <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[32px] p-8 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/5 blur-3xl rounded-full -mr-16 -mt-16"></div>

                <h3 className="text-lg font-black text-gray-900 tracking-tight mb-6 flex items-center gap-2 uppercase">
                    <Users className="w-5 h-5 text-[#8b5cf6]" />
                    Platform Administrators
                </h3>

                {fetchingAdmins ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-4 text-gray-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <p className="text-[10px] font-black uppercase tracking-widest italic">Syncing admin database...</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {admins.map((admin) => (
                            <motion.div
                                key={admin.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedAdmin(admin)}
                                className="group p-4 bg-white/60 border border-white/80 rounded-[24px] cursor-pointer hover:bg-white/80 hover:border-[#8b5cf6]/30 transition-all flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                    {admin.avatar ? (
                                        <img src={admin.avatar} alt={admin.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-[#8b5cf6]/10 text-[#8b5cf6] flex items-center justify-center font-black">
                                            {admin.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-black text-sm text-gray-900 truncate group-hover:text-[#8b5cf6] transition-colors">{admin.name}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{admin.email}</p>
                                </div>
                                <div className="p-2 bg-gray-50 rounded-xl group-hover:bg-[#8b5cf6]/10 transition-colors">
                                    <Info className="w-4 h-4 text-gray-400 group-hover:text-[#8b5cf6]" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Admin Details Modal */}
            <AnimatePresence>
                {selectedAdmin && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                        onClick={() => {
                            setSelectedAdmin(null);
                            setConfirmDelete(false);
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-md bg-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                onClick={() => {
                                    setSelectedAdmin(null);
                                    setConfirmDelete(false);
                                }}
                                className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>

                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="w-24 h-24 rounded-full border-4 border-[#8b5cf6]/20 p-1 mb-4">
                                    <div className="w-full h-full rounded-full overflow-hidden">
                                        {selectedAdmin.avatar ? (
                                            <img src={selectedAdmin.avatar} alt={selectedAdmin.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-[#8b5cf6] text-white flex items-center justify-center text-2xl font-black">
                                                {selectedAdmin.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <h4 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{selectedAdmin.name}</h4>
                                <p className="text-xs font-bold text-[#8b5cf6] uppercase tracking-[0.2em]">{selectedAdmin.email}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-[24px] p-6 border border-gray-100">
                                    <Calendar className="w-5 h-5 text-[#d946ef] mb-3" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Login Date</p>
                                    <p className="font-black text-gray-900 text-sm">
                                        {selectedAdmin.lastLogin ? new Date(selectedAdmin.lastLogin).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        }) : 'Never'}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-[24px] p-6 border border-gray-100">
                                    <Server className="w-5 h-5 text-[#8b5cf6] mb-3" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Agents Created</p>
                                    <p className="font-black text-3xl text-gray-900">{selectedAdmin.agentCount}</p>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                                <Activity className="w-4 h-4 text-emerald-500" />
                                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Administrator Account Verified & Active</p>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100">
                                {confirmDelete ? (
                                    <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 bg-red-100 rounded-xl text-red-600">
                                                <ShieldAlert className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest leading-none">Confirm Deletion</p>
                                                <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest mt-0.5">This action is irreversible</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleDeleteAdmin(selectedAdmin.id)}
                                                disabled={loading}
                                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50"
                                            >
                                                {loading ? "Deleting..." : "Confirm Delete"}
                                            </button>
                                            <button
                                                onClick={() => setConfirmDelete(false)}
                                                className="flex-1 py-3 bg-white border border-gray-100 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setConfirmDelete(true)}
                                        className="w-full py-4 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 border border-gray-100 hover:border-red-100 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group"
                                    >
                                        <ShieldAlert className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                        Delete Administrator Account
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* API Controls */}
            <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[32px] p-8 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.05)]">
                <h3 className="text-lg font-black text-gray-900 tracking-tight mb-6 flex items-center gap-2 uppercase">
                    <Activity className="w-5 h-5 text-[#8b5cf6]" />
                    API Rate Limits
                </h3>
                <div className="p-6 bg-white/40 rounded-[24px] border border-white/60">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Global Requests Per Minute</label>
                        <span className="text-sm font-black text-[#8b5cf6]">{reqLimit}k</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="100"
                        value={reqLimit}
                        onChange={(e) => setReqLimit(e.target.value)}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#8b5cf6] hover:accent-[#7c3aed] transition-all"
                    />
                    <div className="flex justify-between text-[9px] font-black text-gray-400 mt-3 uppercase tracking-widest">
                        <span>1k</span>
                        <span>50x</span>
                        <span>100k</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PlatformSettings;
