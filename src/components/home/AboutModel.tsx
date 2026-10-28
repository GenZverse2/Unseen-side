import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { GalleryItem } from '../../types';

interface AboutModelProps {
  onSelectLook: (item: GalleryItem) => void;
}

export const AboutModel: React.FC<AboutModelProps> = ({ onSelectLook }) => {
  const { content } = useContent();

  const handleOpenImage = (id: string, title: string, imageUrl: string) => {
    onSelectLook({
      id,
      title,
      imageUrl,
      category: 'editorial',
      order: 0,
      isPublished: true,
    });
  };

  const dressingPillars = [
    'Fashion that feels personal.',
    'Elevating everyday moments.',
    'Designed for the modern you.',
    'Style, simplified!',
  ];

  return (
    <section id="about" className="py-28 px-6 sm:px-8 lg:px-12 bg-[#080808] border-b border-neutral-900">
      <div className="max-w-7xl mx-auto space-y-24">
        {/* Story 1: Unfold Your Bold Side (Preserving MAG4TnGu_Jk.jpg) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Original Model Photograph */}
          <div className="lg:col-span-6 relative">
            <div
              onClick={() =>
                handleOpenImage(
                  'bold-side-portrait',
                  'Unfold Your Bold Side',
                  '/images/model/MAG4TnGu_Jk.jpg'
                )
              }
              className="group cursor-pointer relative aspect-[16/10] border border-neutral-900 bg-neutral-950 shadow-2xl overflow-hidden hover:border-[#E50920]/60 transition-all duration-500"
            >
              <img
                src="/images/model/MAG4TnGu_Jk.jpg"
                alt="Krish-Kartik commanding the frame"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-50" />
              <div className="absolute bottom-4 left-4 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-neutral-800 text-[10px] font-grotesk tracking-widest text-[#E50920] uppercase font-bold">
                [ EDITORIAL MASTER FRAME ]
              </div>
            </div>
          </div>

          {/* Right: Editorial Copy */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-grotesk tracking-[0.3em] text-[#E50920] uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50920]" />
              <span>THE MANIFESTO</span>
            </div>
            <h2 className="font-editorial-modern text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase leading-tight">
              {content.aboutHeading || 'Unfold Your bold side'}
            </h2>

            <div className="mt-8 space-y-6 text-sm sm:text-base text-[#8A8A93] font-grotesk leading-relaxed">
              <p className="border-l-2 border-[#E50920] pl-4 text-neutral-200">
                {content.aboutParagraph1 ||
                  'Not posing — commanding the frame. Every glance, every pose — a statement of power.'}
              </p>
              <p className="font-editorial-modern text-xl sm:text-2xl text-white font-bold tracking-wide uppercase">
                Born to stand out. <br />
                <span className="text-[#E50920]">Fearless. Fierce. Flawless.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Story 2: The Art Of Effortless Dressing! (Preserving MAG4HQvAr1w.jpg) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center pt-16 border-t border-neutral-900">
          {/* Left: Copy & Pillars */}
          <div className="lg:col-span-6 order-2 lg:order-1 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-xs font-grotesk tracking-[0.3em] text-[#E50920] uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50920]" />
              <span>STYLING PHILOSOPHY</span>
            </div>
            <h2 className="font-editorial-modern text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase leading-tight">
              The Art Of <br />
              <span className="text-[#E50920]">Effortless Dressing!</span>
            </h2>

            <p className="mt-6 text-sm sm:text-base text-[#8A8A93] font-grotesk leading-relaxed">
              {content.aboutParagraph2 ||
                'Fashion that feels personal. Elevating everyday moments. Designed for the modern you. Style, simplified!'}
            </p>

            {/* The 4 Exact Pillars */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dressingPillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3.5 border border-neutral-900 bg-neutral-950/60"
                >
                  <div className="w-4 h-4 bg-[#E50920]/20 border border-[#E50920]/50 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#E50920]" />
                  </div>
                  <span className="text-xs font-grotesk tracking-wider text-neutral-300 uppercase">
                    {pillar}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Original Square Model Photograph */}
          <div className="lg:col-span-6 order-1 lg:order-2 relative">
            <div
              onClick={() =>
                handleOpenImage(
                  'effortless-dressing',
                  'The Art Of Effortless Dressing',
                  '/images/model/MAG4HQvAr1w.jpg'
                )
              }
              className="group cursor-pointer relative aspect-square max-w-md mx-auto border border-neutral-900 bg-neutral-950 shadow-2xl overflow-hidden hover:border-[#E50920]/60 transition-all duration-500"
            >
              <img
                src="/images/model/MAG4HQvAr1w.jpg"
                alt="Krish-Kartik effortless dressing portrait"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
              <div className="absolute bottom-4 right-4 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-neutral-800 text-[10px] font-grotesk tracking-widest text-[#E50920] uppercase font-bold">
                [ 2048 × 2048 NATIVE ]
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
