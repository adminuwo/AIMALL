import React, { useEffect, useState } from 'react';
import AppListTable from '../../Components/Vendor/AppListTable';
import vendorService from '../../services/vendorService';
import { Loader2, Plus, Grip } from 'lucide-react';
import { motion } from 'framer-motion';

const VendorApps = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const vendorId = user._id || user.id;

    const fetchApps = async () => {
        if (!vendorId) {
            setLoading(false);
            return;
        }
        try {
            // console.log('[VendorApps] Fetching apps... (Supressed log)');
            const data = await vendorService.getVendorApps(vendorId);
            setApps(data);
        } catch (err) {
            console.error('Failed to fetch apps:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApps();
    }, [vendorId]);

    const handleAppCreated = (newApp) => {
        fetchApps();
    };

    return (
        <div className="space-y-8 pb-12">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter mb-2">My <span className="text-[#8b5cf6]">Agents.</span></h1>
                    <p className="text-gray-500 font-bold text-lg tracking-tight max-w-xl">Deploy and manage your autonomous agents.</p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[40px] shadow-sm">
                    <Loader2 className="animate-spin text-[#8b5cf6] mb-4" size={48} />
                    <p className="text-gray-500 font-bold animate-pulse">Synchronizing Agent Data...</p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <AppListTable apps={apps} onAppCreated={handleAppCreated} />
                </motion.div>
            )}
        </div>
    );
};

export default VendorApps;
