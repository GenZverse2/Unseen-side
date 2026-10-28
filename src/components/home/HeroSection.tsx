import React from 'react';
import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

interface HeroSectionProps {
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreClick }) => {
  const { content } = useContent();

  const heroImage = content.heroImageUrl || '/images/model/MAG4HVhB6wU.png';

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] lg:min-h-screen flex flex-col justify-between pt-24 pb-12 px-6 sm:px-8 lg:px-12 bg-[#080808] overflow-hidden border-b border-neutral-900"
    >
      {/* Subtle Red Atmosphere Glow */}
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-[#E50920]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-neutral-900/60 rounded-full blur-[100px] pointer-events-none" />

      {/* Massive Monumental Backdrop Typography: "UNSEEN" */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="font-monolith text-[22vw] uppercase tracking-tighter text-neutral-900/40 leading-none whitespace-nowrap transform -translate-y-4">
          {content.heroBackdropText || 'UNSEEN'}
        </span>
      </div>

      {/* Hero Top Bar Metadata: Editorial Coordinates */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-b border-neutral-900 pb-4 text-xs font-grotesk tracking-[0.25em] text-[#8A8A93] uppercase">
        <div className="flex items-center gap-3">
          <span className="text-[#E50920] font-bold">[ 01 ]</span>
          <span>{content.heroPretitle || 'VIRTUAL MODEL & DIGITAL COUTURE'}</span>
        </div>
        <div className="flex items-center gap-6">
          <span>IDENTITY: <strong className="text-white font-medium">{content.modelName || 'KRISH-KARTIK'}</strong></span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">EDITION: S/S ARCHIVE</span>
        </div>
      </div>

      {/* Hero Editorial Composition (Asymmetric Layout with Large Foreground Image) */}
      <div className="relative z-10 max-w-7xl mx-auto w-full my-auto py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Asymmetric Editorial Headlines & Copy */}
        <div className="lg:col-span-6 flex flex-col items-start justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-900 border border-neutral-800 text-[10px] font-grotesk tracking-[0.3em] uppercase text-[#E50920] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E50920]" />
            <span>ORIGINAL DIGITAL HUMAN ARCHIVE</span>
          </div>

          <h1 className="font-editorial-modern text-4xl sm:text-6xl xl:text-7xl font-extrabold text-white tracking-tight leading-[1.05] uppercase">
            {content.heroTitle || '“Effortless Style, Timeless Confidence.”'}
          </h1>

          <div className="mt-6 flex items-start gap-4 max-w-lg">
            <div className="w-8 h-[2px] bg-[#E50920] mt-3 shrink-0" />
            <p className="font-grotesk text-sm sm:text-base text-[#8A8A93] leading-relaxed">
              {content.heroSubtitle ||
                'Every Look I Create Tells A Different Story — From StreetWear Energy To Classic Elegance.'}
            </p>
          </div>

          {/* Statement Quote */}
          <div className="mt-6 pl-4 border-l-2 border-neutral-800 text-neutral-300 italic font-editorial-italic text-base sm:text-lg">
            “{content.heroStatement || 'Capturing The Art Of Confidence, One Frame At A Time!'}”
          </div>

          {/* Actions */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={onExploreClick}
              className="px-8 py-4 bg-[#E50920] hover:bg-[#FF1A2E] text-white font-grotesk text-xs tracking-[0.25em] font-bold uppercase transition-all duration-300 flex items-center gap-2 group shadow-xl shadow-[#E50920]/25"
            >
              <span>EXPLORE VISUALS</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>

            <a
              href="#contact"
              className="px-8 py-4 border border-neutral-800 hover:border-neutral-500 bg-neutral-950/60 text-white font-grotesk text-xs tracking-[0.25em] uppercase transition-all duration-300"
            >
              BOOK COLLABORATION
            </a>
          </div>
        </div>

        {/* Right Column: Dominant Virtual Model Photograph Foreground */}
        <div className="lg:col-span-6 relative flex items-center justify-center">
          {/* Main Photo Frame */}
          <div className="relative w-full max-w-lg aspect-[3/4] bg-neutral-950 border border-neutral-800 p-2 shadow-2xl group">
            {/* Red Accent Corner Brackets */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#E50920] z-20" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#E50920] z-20" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#E50920] z-20" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#E50920] z-20" />

            <div className="relative w-full h-full overflow-hidden bg-black">
              <img
                src={heroImage}
                alt={content.modelName || 'Virtual Model Krish-Kartik'}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

              {/* Inset Plate */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] font-grotesk tracking-[0.25em] text-white/80 uppercase">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E50920]" />
                  PORTRAIT FRAME 01
                </span>
                <span>ORIGINAL MODEL 4K</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Bottom Bar */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between pt-6 border-t border-neutral-900 text-xs font-grotesk tracking-[0.25em] text-[#8A8A93]">
        <span className="uppercase text-neutral-500">DIGITAL FASHION & CGI REALISM</span>
        <button
          onClick={onExploreClick}
          className="flex items-center gap-2 hover:text-[#E50920] transition-colors uppercase tracking-[0.3em] text-[11px]"
        >
          <span>SCROLL TO DISCOVER</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#E50920]" />
        </button>
      </div>
    </section>
  );
};
