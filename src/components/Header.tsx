
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full flex flex-col items-center text-base justify-center px-4 py-6 max-md:px-2">
      <div className="w-full max-w-[1200px]">
        <div className="flex w-full items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 text-[28px] text-white font-medium whitespace-nowrap text-center tracking-[-1.88px] leading-[1.1] max-md:text-[24px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/9de6021644f9415b8e6ba1d1ef4607ce/e4bfb5a3f9037dab7d49b7c2771e5de52593d8aa?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-10 shrink-0"
              alt="FlowApp Logo"
            />
            <div className="text-white">
              Promptix
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="font-normal leading-[1.7] max-md:hidden">
            <div className="flex gap-[38px]">
              <Link 
                to="/" 
                className={`text-white hover:text-gray-300 transition-colors ${location.pathname === '/' ? 'font-medium' : ''}`}
              >
                Home
              </Link>
              <Link 
                to="/features" 
                className={`text-white hover:text-gray-300 transition-colors ${location.pathname === '/features' ? 'font-medium' : ''}`}
              >
                Features
              </Link>
              <Link 
                to="/pricing" 
                className={`text-white hover:text-gray-300 transition-colors ${location.pathname === '/pricing' ? 'font-medium' : ''}`}
              >
                Pricing
              </Link>
              <Link 
                to="/about" 
                className={`text-white hover:text-gray-300 transition-colors ${location.pathname === '/about' ? 'font-medium' : ''}`}
              >
                About Us
              </Link>
            </div>
          </nav>

          {/* Desktop Buttons */}
          <div className="font-bold max-md:hidden">
            <div className="flex items-center gap-[17px]">
              <Link to="/employee/login" className="text-white gap-1 py-2.5 px-3 rounded-[10px] hover:bg-white/10 transition-colors">
                Employee Portal
              </Link>
              <button className="text-white border-[color:var(--Linear,#FF5552)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)] backdrop-blur-[6px] bg-[rgba(33,33,43,0.60)] gap-3 overflow-hidden px-6 py-3 rounded-[100px] border-[1.5px] border-solid hover:bg-[rgba(33,33,43,0.80)] transition-colors">
                Get Started
              </button>
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-[rgba(33,33,43,0.95)] backdrop-blur-md rounded-lg p-4 border border-white/10">
            <nav className="flex flex-col gap-4 mb-4">
              <Link
                to="/"
                className={`text-white hover:text-gray-300 transition-colors py-2 ${location.pathname === '/' ? 'font-medium' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/features"
                className={`text-white hover:text-gray-300 transition-colors py-2 ${location.pathname === '/features' ? 'font-medium' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className={`text-white hover:text-gray-300 transition-colors py-2 ${location.pathname === '/pricing' ? 'font-medium' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className={`text-white hover:text-gray-300 transition-colors py-2 ${location.pathname === '/about' ? 'font-medium' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
            </nav>
            <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
              <button className="text-white gap-1 py-2.5 px-3 rounded-[10px] hover:bg-white/10 transition-colors text-center">
                Log in
              </button>
              <button className="text-white border-[color:var(--Linear,#FF5552)] shadow-[0px_0px_8px_0px_rgba(248,248,248,0.25)_inset,0px_32px_24px_-16px_rgba(0,0,0,0.40)] backdrop-blur-[6px] bg-[rgba(33,33,43,0.60)] gap-3 overflow-hidden px-6 py-3 rounded-[100px] border-[1.5px] border-solid hover:bg-[rgba(33,33,43,0.80)] transition-colors text-center">
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
