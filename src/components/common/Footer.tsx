import React from 'react';
import { ArrowUp, Instagram, Facebook, Twitter, Shield } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { useAuth } from '../../context/AuthContext';

interface FooterProps {
  onNavigateToAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToAdmin }) => {
  const { content } = useContent();
  const { isAdmin } = useAuth();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigateToAdmin) {
      onNavigateToAdmin();
    } else {
      window.location.hash = '/admin';
    }
  };

  return (
    <footer className="relative bg-[#050505] border-t border-neutral-900 py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-neutral-900">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-monolith text-xl text-[#E50920] tracking-widest">US</span>
              <span className="font-editorial-modern text-xl font-black text-white uppercase tracking-[0.2em]">
                {content.brandName || 'UNSEEN SIDE'}
              </span>
            </div>
            <p className="mt-2 text-xs font-grotesk text-[#8A8A93] uppercase tracking-wider">
              Virtual Model Portfolio & Digital Couture • Model: {content.modelName || 'KRISH-KARTIK'}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={content.instagramUrl || 'https://instagram.com'}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 border border-neutral-800 bg-neutral-950 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#E50920] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href={content.facebookUrl || 'https://facebook.com'}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 border border-neutral-800 bg-neutral-950 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#E50920] transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href={content.twitterUrl || 'https://x.com'}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 border border-neutral-800 bg-neutral-950 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#E50920] transition-colors"
              aria-label="Twitter / X"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-grotesk text-neutral-500 uppercase tracking-widest">
          <div>
            {content.footerText || `© ${new Date().getFullYear()} UNSEEN SIDE. All rights reserved.`}
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={handleAdminClick}
              className="flex items-center gap-1.5 text-neutral-600 hover:text-[#E50920] transition-colors"
              title="Private Dashboard"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'ADMIN ACTIVE' : 'ADMIN'}</span>
            </button>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
            >
              <span>TOP</span>
              <ArrowUp className="w-3.5 h-3.5 text-[#E50920]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
