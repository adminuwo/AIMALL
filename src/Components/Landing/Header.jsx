import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router';
import { AppRoute } from '../../types';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="py-6 relative z-50">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate(AppRoute.HOME)}>
          <div className="w-[30px] h-[30px] rounded-[10px_4px_10px_4px] bg-gradient-to-br from-[#06b6d4] to-[#8b5cf6] flex items-center justify-center shadow-lg">
          </div>
          <span className="font-bold text-xl text-[#1A1A1A] tracking-tighter uppercase">AI MALL</span>
        </div>

        <nav className="hidden md:flex items-center gap-10">
          <button onClick={() => navigate(AppRoute.MARKETPLACE)} className="text-[#1A1A1A] text-[0.95rem] font-bold hover:text-[#3B82F6] transition-colors cursor-pointer">Marketplace</button>
          <a href="#" className="text-[#666] text-[0.95rem] font-medium hover:text-[#3B82F6] transition-colors">Documentation</a>
          <a href="#" className="text-[#666] text-[0.95rem] font-medium hover:text-[#3B82F6] transition-colors">Reviews</a>
        </nav>

        <div className="flex items-center gap-6">
          <button className="bg-transparent p-2 cursor-pointer transition-transform hover:scale-110">
            <ShoppingBag size={22} color="#1A1A1A" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
