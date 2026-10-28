import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Tag, Sparkles } from 'lucide-react';
import { GalleryItem } from '../../types';

interface LightboxModalProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  onClose: () => void;
  onSelect: (item: GalleryItem) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  items,
  onClose,
  onSelect,
}) => {
  const currentIndex = item ? items.findIndex((i) => i.id === item.id) : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelect(items[currentIndex - 1]);
    } else if (items.length > 0) {
      onSelect(items[items.length - 1]);
    }
  }, [currentIndex, items, onSelect]);

  const handleNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      onSelect(items[currentIndex + 1]);
    } else if (items.length > 0) {
      onSelect(items[0]);
    }
  }, [currentIndex, items, onSelect]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, handlePrev, handleNext]);

  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [item]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/95 backdrop-blur-xl transition-all duration-300"
      onClick={onClose}
    >
      {/* Top Controls Bar */}
      <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex items-center gap-3 pointer-events-auto">
          <span className="font-grotesk text-xs tracking-[0.25em] text-[#E50920] uppercase font-bold">
            [ FRAME {String(currentIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')} ]
          </span>
          {item.series && (
            <span className="px-2.5 py-0.5 text-[9px] font-grotesk tracking-widest bg-neutral-900 text-neutral-300 border border-neutral-800 uppercase">
              {item.series}
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          className="pointer-events-auto p-2 bg-neutral-900 hover:bg-[#E50920] text-white transition-colors border border-neutral-800"
          aria-label="Close Lightbox"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-neutral-900/80 hover:bg-[#E50920] text-white transition-all z-20 focus:outline-none border border-neutral-800 shadow-2xl"
        aria-label="Previous Image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 sm:p-4 bg-neutral-900/80 hover:bg-[#E50920] text-white transition-all z-20 focus:outline-none border border-neutral-800 shadow-2xl"
        aria-label="Next Image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Image Frame */}
      <div
        className="relative max-w-5xl max-h-[85vh] w-full mx-auto px-4 flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative group max-h-[72vh] flex items-center justify-center overflow-hidden shadow-2xl border border-neutral-800 bg-black">
          <img
            src={item.imageUrl}
            alt={item.altText || item.title}
            className="max-h-[72vh] w-auto object-contain transition-transform duration-700 select-none"
            loading="eager"
          />
        </div>

        {/* Look Caption & Info */}
        <div className="mt-4 text-center max-w-xl">
          <h3 className="font-editorial-modern text-xl sm:text-2xl text-white uppercase tracking-wide">
            {item.title}
          </h3>
          {item.subtitle && (
            <p className="mt-1 text-xs sm:text-sm text-[#8A8A93] font-grotesk tracking-wide">
              {item.subtitle}
            </p>
          )}
          <div className="mt-2.5 flex items-center justify-center gap-4 text-[10px] font-grotesk text-neutral-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-[#E50920]">
              <Tag className="w-3 h-3" />
              {item.category}
            </span>
            <span>•</span>
            <span>ORIGINAL MODEL RENDER</span>
          </div>
        </div>
      </div>
    </div>
  );
};
