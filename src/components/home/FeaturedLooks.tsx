import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GalleryItem } from '../../types';

interface FeaturedLooksProps {
  onSelectLook: (item: GalleryItem) => void;
}

export const FeaturedLooks: React.FC<FeaturedLooksProps> = ({ onSelectLook }) => {
  const looks: {
    id: string;
    number: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    category: 'runway' | 'editorial';
    series: string;
  }[] = [
    {
      id: 'look-01-redefine',
      number: '01',
      title: 'Redefine your style',
      subtitle: 'From runway-inspired looks to street-ready fits, wear confidence every day.',
      imageUrl: '/images/model/MAG4HcPeUYw.png',
      category: 'runway',
      series: 'RUNWAY EDIT',
    },
    {
      id: 'look-02-speaks',
      number: '02',
      title: 'Style that speaks',
      subtitle: 'Inspired by models, made for icons. Your wardrobe, your runway.',
      imageUrl: '/images/model/MAG4HVhB6wU.png',
      category: 'editorial',
      series: 'EDITORIAL STATEMENT',
    },
    {
      id: 'look-03-elevate',
      number: '03',
      title: 'Elevate every look',
      subtitle: 'Where timeless design meets modern edge — made for the spotlight.',
      imageUrl: '/images/model/MAG4HYR_A7w.jpg',
      category: 'editorial',
      series: 'MODERN EDGE',
    },
  ];

  return (
    <section id="looks" className="py-28 px-6 sm:px-8 lg:px-12 bg-[#080808] border-b border-neutral-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-neutral-900 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-grotesk tracking-[0.3em] text-[#E50920] uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50920]" />
              <span>SELECTED VISUALS</span>
            </div>
            <h2 className="font-editorial-modern text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
              Curated Editorial Edits
            </h2>
          </div>
          <p className="text-xs font-grotesk tracking-wider text-[#8A8A93] max-w-sm uppercase">
            Signature silhouettes captured with precise virtual lighting, tailored streetwear, and quiet power.
          </p>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {looks.map((look) => {
            const galleryItem: GalleryItem = {
              id: look.id,
              title: look.title,
              subtitle: look.subtitle,
              imageUrl: look.imageUrl,
              category: look.category,
              series: look.series,
              order: 0,
              isPublished: true,
            };

            return (
              <div
                key={look.id}
                onClick={() => onSelectLook(galleryItem)}
                className="group cursor-pointer flex flex-col justify-between border border-neutral-900 bg-neutral-950/60 hover:border-[#E50920]/60 transition-all duration-500 overflow-hidden"
              >
                {/* Photo Frame */}
                <div className="relative aspect-[3/4] overflow-hidden bg-black">
                  <img
                    src={look.imageUrl}
                    alt={look.title}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                  {/* Red Index Plate */}
                  <div className="absolute top-4 left-4 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-neutral-800 text-[10px] font-grotesk tracking-widest text-[#E50920] uppercase font-bold">
                    [ {look.number} ]
                  </div>

                  <div className="absolute top-4 right-4 px-2.5 py-1 bg-black/80 backdrop-blur-md border border-neutral-800 text-[9px] font-grotesk tracking-widest text-neutral-400 uppercase">
                    {look.series}
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 flex flex-col flex-1 justify-between bg-[#0b0b0d]">
                  <div>
                    <h3 className="font-editorial-modern text-lg sm:text-xl font-bold text-white group-hover:text-[#E50920] transition-colors uppercase">
                      {look.title}
                    </h3>
                    <p className="mt-2 text-xs text-[#8A8A93] font-grotesk leading-relaxed">
                      {look.subtitle}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-900 flex items-center justify-between text-[11px] font-grotesk tracking-widest uppercase text-neutral-500 group-hover:text-white transition-colors">
                    <span className="group-hover:text-[#E50920] transition-colors">EXPAND VIEW</span>
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
