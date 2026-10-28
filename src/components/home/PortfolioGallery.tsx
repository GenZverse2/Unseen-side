import React, { useState, useMemo } from 'react';
import { Expand, ArrowUpRight } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { GalleryItem } from '../../types';

interface PortfolioGalleryProps {
  onSelectLook: (item: GalleryItem) => void;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ onSelectLook }) => {
  const { gallery } = useContent();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'ALL VISUALS' },
    { id: 'editorial', label: 'EDITORIAL' },
    { id: 'studio', label: 'STUDIO SERIES' },
    { id: 'concept', label: '3 SIDES' },
    { id: 'runway', label: 'RUNWAY' },
    { id: 'archive', label: 'ARCHIVE' },
  ];

  const filteredItems = useMemo(() => {
    // Only published items appear on the public website!
    const published = gallery.filter((item) => item.isPublished);
    if (selectedFilter === 'all') return published;
    return published.filter((item) => item.category === selectedFilter);
  }, [gallery, selectedFilter]);

  return (
    <section id="portfolio" className="py-28 px-6 sm:px-8 lg:px-12 bg-[#080808] border-b border-neutral-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 border-b border-neutral-900 pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-grotesk tracking-[0.3em] text-[#E50920] uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50920]" />
              <span>PHOTOGRAPHIC ARCHIVE</span>
            </div>
            <h2 className="font-editorial-modern text-3xl sm:text-5xl font-extrabold text-white uppercase tracking-tight">
              Selected Model Visuals
            </h2>
            <p className="mt-3 text-xs font-grotesk tracking-wider text-[#8A8A93] max-w-xl uppercase">
              Exclusive high-fashion digital renders featuring virtual model Krish-Kartik. Preserving original facial identity, poses, and garment textures.
            </p>
          </div>

          {/* Filter Pills with Red Styling */}
          <div className="flex flex-wrap items-center gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-4 py-2 text-xs font-grotesk tracking-widest uppercase transition-all duration-300 border ${
                  selectedFilter === tab.id
                    ? 'bg-[#E50920] text-white border-[#E50920] font-bold shadow-lg shadow-[#E50920]/25'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-900 hover:border-neutral-700 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column / 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => onSelectLook(item)}
              className="group cursor-pointer relative border border-neutral-900 bg-neutral-950/60 overflow-hidden flex flex-col justify-between hover:border-[#E50920]/60 transition-all duration-500 shadow-xl"
            >
              {/* Image Frame */}
              <div className="relative aspect-[3/4] overflow-hidden bg-black">
                <img
                  src={item.imageUrl}
                  alt={item.altText || item.title}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />

                {/* Series & Index Tag */}
                <div className="absolute top-3 left-3 px-2 py-0.5 bg-black/80 backdrop-blur-md border border-neutral-800 text-[10px] font-grotesk tracking-widest text-[#E50920] uppercase font-bold">
                  [ {String(idx + 1).padStart(2, '0')} ]
                </div>

                <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/80 backdrop-blur-md border border-neutral-800 text-[9px] font-grotesk tracking-widest text-neutral-400 uppercase">
                  {item.series || item.category}
                </div>

                {/* Hover Eye Trigger */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-3 bg-[#E50920] text-white shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                    <Expand className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Bottom Info Plate */}
              <div className="p-5 bg-[#0b0b0d] border-t border-neutral-900 flex flex-col justify-between">
                <div>
                  <h3 className="font-editorial-modern text-base sm:text-lg font-bold text-white group-hover:text-[#E50920] transition-colors uppercase line-clamp-1">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="mt-1 text-xs text-[#8A8A93] font-grotesk line-clamp-2 leading-relaxed">
                      {item.subtitle}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-900/60 flex items-center justify-between text-[10px] font-grotesk tracking-widest uppercase text-neutral-500 group-hover:text-white transition-colors">
                  <span className="group-hover:text-[#E50920] transition-colors">FULL RESOLUTION</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#E50920] transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-24 text-center border border-neutral-900 bg-neutral-950/40">
            <p className="font-grotesk text-xs text-neutral-500 tracking-widest uppercase">
              No published visuals available in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
