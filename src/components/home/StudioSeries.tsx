import React from 'react';
import { Expand, Camera } from 'lucide-react';
import { GalleryItem } from '../../types';

interface StudioSeriesProps {
  onSelectLook: (item: GalleryItem) => void;
}

export const StudioSeries: React.FC<StudioSeriesProps> = ({ onSelectLook }) => {
  const seriesItems = [
    {
      id: 'studio-no-01',
      tag: 'NO. 01',
      title: 'Studio Series No. 01',
      subtitle: 'Style that speaks without trying. Raw attitude, tailored minimalism.',
      imageUrl: '/images/model/MAG4HSPewnY.png',
    },
    {
      id: 'studio-no-02',
      tag: 'NO. 02',
      title: 'Studio Series No. 02',
      subtitle: 'Sculpted lighting and deep contrast in quiet contemplative focus.',
      imageUrl: '/images/model/MAG4HfGCyb8.jpg',
    },
    {
      id: 'studio-no-03',
      tag: 'NO. 03',
      title: 'Studio Series No. 03',
      subtitle: 'Architectural streetwear shapes meeting high-definition digital presence.',
      imageUrl: '/images/model/MAG4HWV5JEs.png',
    },
  ];

  return (
    <section id="series" className="py-28 px-6 sm:px-8 lg:px-12 bg-[#080808] border-b border-neutral-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-neutral-900 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-grotesk tracking-[0.3em] text-[#E50920] uppercase mb-2">
              <Camera className="w-3.5 h-3.5 text-[#E50920]" />
              <span>STUDIO ARCHIVE</span>
            </div>
            <h2 className="font-editorial-modern text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
              Style That Speaks Without Trying!
            </h2>
          </div>
          <p className="text-xs font-grotesk tracking-wider text-[#8A8A93] max-w-sm uppercase">
            Square-format studio captures focusing on digital couture tailoring and uncompromising attitude.
          </p>
        </div>

        {/* 3 Square Studio Frames */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {seriesItems.map((item) => {
            const galleryItem: GalleryItem = {
              id: item.id,
              title: item.title,
              subtitle: item.subtitle,
              imageUrl: item.imageUrl,
              category: 'studio',
              series: item.title,
              order: 0,
              isPublished: true,
            };

            return (
              <div
                key={item.id}
                onClick={() => onSelectLook(galleryItem)}
                className="group cursor-pointer flex flex-col justify-between border border-neutral-900 bg-neutral-950/60 p-4 hover:border-[#E50920]/60 transition-all duration-500 shadow-xl"
              >
                {/* Photo Frame */}
                <div className="relative w-full aspect-square overflow-hidden bg-black border border-neutral-900">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-3 bg-[#E50920] text-white shadow-xl shadow-[#E50920]/40">
                      <Expand className="w-4 h-4" />
                    </span>
                  </div>

                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 backdrop-blur-md border border-neutral-800 text-[10px] font-grotesk tracking-widest text-[#E50920] uppercase font-bold">
                    {item.tag}
                  </div>
                </div>

                {/* Caption below */}
                <div className="mt-5 text-left w-full">
                  <h3 className="font-editorial-modern text-base font-bold text-white group-hover:text-[#E50920] transition-colors uppercase">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#8A8A93] font-grotesk leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
