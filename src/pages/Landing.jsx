import React, { useState } from 'react';
import Header from '../Components/Landing/Header';
import Hero from '../Components/Landing/Hero';
import Stats from '../Components/Landing/Stats';

import HowItWorks from '../Components/Landing/HowItWorks';
import Testimonials from '../Components/Landing/Testimonials';

import Footer from '../Components/Landing/Footer';
import SecurityModal from '../Components/LiveDemo/SecurityModal';
const Landing = () => {
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans text-gray-900 selection:bg-purple-100 selection:text-purple-900 overflow-hidden relative">
      <div className="fixed inset-0 -z-10">
        <img
          src="/landing_bg.jpg"
          alt="Background"
          className="w-full h-full object-cover opacity-60"
        />
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
      </div>

      <Header />
      <Hero />
      {/* <Stats /> */}

      <HowItWorks />
      <Testimonials />

      <Footer />

      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </div>
  );
};

export default Landing;
