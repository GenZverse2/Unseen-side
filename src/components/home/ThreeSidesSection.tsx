import React from 'react';
import { ArrowUpRight, Expand } from 'lucide-react';
import { GalleryItem } from '../../types';

interface ThreeSidesSectionProps {
  onSelectLook: (item: GalleryItem) => void;
}

export const ThreeSidesSection: React.FC<ThreeSidesSectionProps> = ({ onSelectLook }) => {
  const sides = [
    {
      id: 'sides-the-bold',
      num: '01',
      name: 'The Bold',
      tagline: 'Fearless expression & commanding presence',
      quote: 'Unfiltered posture, assertive structure, commanding the frame with unwavering intensity.',
      imageUrl: '/images/model/MAG4TkFm208.jpg',
    },
    {
      id: 'sides-the-elegant',
      num: '02',
      name: 'The Elegant',
      tagline: 'Fluid tailoring & understated poise',
      quote: 'Subtle poise, draped fabrics, timeless lines reflecting inner composure and refined grace.',
      imageUrl: '/images/model/MAG4TkcgeSk.jpg',
    },
    {
      id: 'sides-the-wild',
      num: '03',
      name: 'The Wild',
      tagline: 'Untamed energy & boundary-breaking textures',
      quote: 'Defying classical codes, raw organic textures, boundless creative freedom in modern digital art.',
      imageUrl: '/images/model/MAG4TmjoRGk.jpg',
    },
  ];

  return (
    <section id="threesides" className="py-28 px-6 sm:px-8 lg:px-12 bg-[#080808] border-b border-neutral-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-neutral-900 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-grotesk tracking-[0.3em] text-[#E50920] uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50920]" />
              <span>VERSATILITY MATRIX</span>
            </div>
            <h2 className="font-editorial-modern text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
              3 Sides Of Me
            </h2>
          </div>
          <p className="text-xs font-grotesk tracking-wider text-[#8A8A93] max-w-sm uppercase">
            A spectrum traversing power, grace, and edge. Click each persona to view full-resolution frames.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {sides.map((side) => {
            const galleryItem: GalleryItem = {
              id: side.id,
              title: side.name,
              subtitle: side.tagline,
              imageUrl: side.imageUrl,
              category: 'concept',
              series: '3 Sides Of Me',
              order: 0,
              isPublished: true,
            };

            return (
              <div
                key={side.id}
                onClick={() => onSelectLook(galleryItem)}
                className="group cursor-pointer flex flex-col justify-between border border-neutral-900 bg-neutral-950/60 p-4 hover:border-[#E50920]/60 transition-all duration-500 shadow-xl overflow-hidden"
              >
                {/* Image Frame */}
                <div className="relative aspect-[3/4] overflow-hidden bg-black border border-neutral-900">
                  <img
                    src={side.imageUrl}
                    alt={side.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                  {/* Red Bracket Corner Index */}
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 backdrop-blur-md border border-neutral-800 text-[10px] font-grotesk tracking-widest text-[#E50920] uppercase font-bold">
                    [ {side.num} ]
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <span className="text-[10px] font-grotesk tracking-[0.25em] text-[#8A8A93] uppercase block">
                      DIMENSION {side.num}
                    </span>
                    <h3 className="font-editorial-modern text-2xl font-bold text-white uppercase tracking-wide group-hover:text-[#E50920] transition-colors">
                      {side.name}
                    </h3>
                  </div>
                </div>

                {/* Subtitle & Quote */}
                <div className="pt-5 pb-2 px-2 flex flex-col justify-between flex-1">
                  <p className="text-xs font-grotesk tracking-wider text-neutral-300 uppercase font-semibold">
                    {side.tagline}
                  </p>
                  <p className="mt-2 text-xs text-[#8A8A93] font-grotesk leading-relaxed italic">
                    “{side.quote}”
                  </p>

                  <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between text-[11px] font-grotesk tracking-widest text-neutral-500 group-hover:text-white transition-colors uppercase">
                    <span className="group-hover:text-[#E50920] transition-colors">EXPLORE LOOK</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#E50920] transition-all" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
