import React, { useState } from 'react';
import Header from '../Components/Landing/Header';
import Hero from '../Components/Landing/Hero';
import Stats from '../Components/Landing/Stats';
import FeaturedVendors from '../Components/Landing/FeaturedVendors';
import HowItWorks from '../Components/Landing/HowItWorks';
import Testimonials from '../Components/Landing/Testimonials';
import CTA from '../Components/Landing/CTA';
import Footer from '../Components/Landing/Footer';
import SecurityModal from '../Components/LiveDemo/SecurityModal';

const Landing = () => {
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#fce7f3] font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900 overflow-hidden relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-200/30 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/30 blur-[120px]"></div>
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] rounded-full bg-pink-200/20 blur-[100px]"></div>
      </div>

      <Header />
      <Hero />
      {/* <Stats /> */}
      <FeaturedVendors />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />

      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </div>
  );
};

export default Landing;
