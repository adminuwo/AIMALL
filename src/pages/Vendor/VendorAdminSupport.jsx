import React, { useEffect } from 'react';
import VendorSupportChat from './components/VendorSupportChat';
import { motion } from 'framer-motion';

const VendorAdminSupport = () => {
    useEffect(() => {
        console.log("VENDOR ADMIN SUPPORT RENDERED - CLEAN VERSION");
    }, []);

    return (
        <div className="h-full w-full p-4 md:p-6">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
            >
                <VendorSupportChat />
            </motion.div>
        </div>
    );
};

export default VendorAdminSupport;
