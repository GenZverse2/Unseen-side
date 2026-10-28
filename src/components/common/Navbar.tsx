import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';

interface NavbarProps {
  onNavigateToAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigateToAdmin }) => {
  const { user, isAdmin, logout } = useAuth();
  const { content } = useContent();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['hero', 'looks', 'series', 'about', 'threesides', 'portfolio', 'contact'];
      const scrollPos = window.scrollY + 220;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'EDITORIAL', href: '#looks', id: 'looks' },
    { label: 'STUDIO SERIES', href: '#series', id: 'series' },
    { label: '3 SIDES', href: '#threesides', id: 'threesides' },
    { label: 'IDENTITY', href: '#about', id: 'about' },
    { label: 'VISUALS', href: '#portfolio', id: 'portfolio' },
    { label: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateToAdmin) {
      onNavigateToAdmin();
    } else {
      window.location.hash = '/admin';
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'py-3.5 bg-[#080808]/90 backdrop-blur-md border-b border-white/10 shadow-2xl'
            : 'py-5 bg-gradient-to-b from-black/90 via-[#080808]/60 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-6">
            <a
              href="#hero"
              className="group flex items-center gap-3 focus:outline-none"
              aria-label="UNSEEN SIDE"
            >
              <div className="w-8 h-8 bg-neutral-900 border border-white/20 flex items-center justify-center group-hover:border-[#E50920] transition-colors duration-300">
                <span className="font-monolith text-sm text-white group-hover:text-[#E50920] transition-colors tracking-widest">
                  US
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-editorial-modern font-black tracking-[0.2em] text-white text-base sm:text-lg uppercase leading-none">
                  {content.brandName || 'UNSEEN SIDE'}
                </span>
                <span className="font-grotesk text-[10px] tracking-[0.3em] text-[#8A8A93] uppercase mt-1">
                  {content.modelName || 'KRISH-KARTIK'}
                </span>
              </div>
            </a>

            {/* Creative Status / Availability Indicator (Black & Red Aesthetic) */}
            <div className="hidden xl:flex items-center gap-2 pl-6 border-l border-white/10 py-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E50920] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E50920]" />
              </span>
              <span className="text-[10px] font-grotesk tracking-[0.25em] uppercase text-neutral-400">
                {content.availabilityStatus || 'AVAILABLE FOR S/S 2027 CAMPAIGNS'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-grotesk tracking-[0.22em] uppercase text-neutral-400">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`relative py-1 transition-colors duration-300 hover:text-white ${
                    isActive ? 'text-white font-semibold' : 'text-neutral-400'
                  }`}
                >
                  <span className={isActive ? 'text-[#E50920] mr-1 font-bold' : 'opacity-0 mr-0'}>
                    /
                  </span>
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E50920]" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right Action Items: Inquire CTA + Hidden / Subtle Admin trigger */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="px-5 py-2.5 bg-[#E50920] hover:bg-[#FF1A2E] text-white text-[11px] font-grotesk tracking-[0.22em] font-semibold transition-all duration-300 flex items-center gap-1.5 uppercase shadow-lg shadow-[#E50920]/20"
            >
              <span>INQUIRE</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Discrete Admin Link */}
            <button
              onClick={handleAdminClick}
              className={`p-2 transition-colors border ${
                isAdmin
                  ? 'border-[#E50920]/60 text-[#E50920] bg-[#E50920]/10 hover:bg-[#E50920]/20'
                  : 'border-white/10 text-neutral-500 hover:text-white hover:border-white/30'
              }`}
              title="Private Administrator Console (/admin)"
              aria-label="Admin Console"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white/80 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#E50920]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-[#080808] flex flex-col justify-between pt-24 pb-12 px-8 animate-fadeIn border-l border-neutral-800">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 pb-4 border-b border-white/10">
              <span className="w-2 h-2 rounded-full bg-[#E50920]" />
              <span className="text-[10px] font-grotesk tracking-[0.25em] text-[#8A8A93] uppercase">
                {content.availabilityStatus || 'AVAILABLE FOR S/S 2027 CAMPAIGNS'}
              </span>
            </div>

            <div className="flex flex-col gap-4 text-2xl font-editorial-modern">
              {navLinks.map((link, idx) => (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-neutral-300 hover:text-white hover:translate-x-2 transition-all flex items-center justify-between border-b border-white/5 pb-3 uppercase tracking-wider"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xs text-[#E50920] font-grotesk">0{idx + 1}</span>
                    <span>{link.label}</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-neutral-600" />
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
            <button
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleAdminClick(e);
              }}
              className="w-full py-3.5 border border-neutral-800 hover:border-[#E50920] text-neutral-300 hover:text-white text-xs font-grotesk tracking-[0.25em] uppercase flex items-center justify-center gap-2 transition-colors"
            >
              <Shield className="w-4 h-4 text-[#E50920]" />
              <span>{isAdmin ? 'ADMIN DASHBOARD' : 'ADMIN LOGIN (/admin)'}</span>
            </button>

            <div className="text-center text-xs text-neutral-500 font-grotesk tracking-wider">
              {content.contactEmail || 'Krishkartik604@gmail.com'}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
