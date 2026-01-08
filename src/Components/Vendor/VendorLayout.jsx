import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router';

const VendorLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Dynamic Vendor Data
    const [vendorData, setVendorData] = useState({
        name: 'Vendor',
        type: 'Premium Partner' // Default
    });

    React.useEffect(() => {
        const updateVendorData = () => {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            setVendorData({
                name: user.companyName || user.name || 'Vendor',
                type: user.companyType || 'Premium Partner',
                avatar: user.avatar || null
            });
        };

        // Initial load
        updateVendorData();

        // Listen for updates
        window.addEventListener('vendorProfileUpdate', updateVendorData);

        return () => {
            window.removeEventListener('vendorProfileUpdate', updateVendorData);
        };
    }, []);

    const appHealth = "All Good";

    return (
        <div className="min-h-screen bg-transparent flex font-sans relative overflow-hidden">
            {/* Background Layers */}
            <div className="fixed inset-0 bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] -z-20" />
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#8b5cf6]/5 rounded-full blur-[120px] animate-orb-float-1" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#d946ef]/5 rounded-full blur-[120px] animate-orb-float-2" />
            </div>

            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

            <div className="flex-1 flex flex-col min-w-0 relative z-10 h-[100dvh] overflow-hidden">
                <Topbar
                    toggleSidebar={toggleSidebar}
                    vendorName={vendorData.name}
                    vendorType={vendorData.type}
                    vendorAvatar={vendorData.avatar}
                    appHealth={appHealth}
                />

                <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto no-scrollbar pb-20 md:pb-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default VendorLayout;
