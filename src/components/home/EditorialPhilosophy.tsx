import React from 'react';

export const EditorialPhilosophy: React.FC = () => {
  return (
    <section className="py-24 px-6 sm:px-8 lg:px-12 border-b border-neutral-900 bg-[#080808] relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Statement */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 text-xs font-grotesk tracking-[0.3em] text-[#E50920] uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E50920]" />
              <span>CREATIVE PHILOSOPHY</span>
            </div>
            <h2 className="font-editorial-modern text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight uppercase">
              An expression <br className="hidden sm:inline" />
              <span className="text-[#E50920]">of your identity.</span>
            </h2>
            <p className="mt-6 text-[#8A8A93] text-sm sm:text-base max-w-2xl leading-relaxed font-grotesk uppercase">
              Capturing The Art Of Confidence, One Frame At A Time! Every Look I Create Tells A Different Story — From StreetWear Energy To Classic Elegance.
            </p>
          </div>

          {/* Quick Metrics / Distinctive Traits */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            <div className="p-5 border border-neutral-900 bg-neutral-950/60">
              <span className="block font-editorial-modern text-2xl sm:text-3xl font-extrabold text-white">
                100%
              </span>
              <span className="text-[10px] font-grotesk tracking-widest text-[#E50920] uppercase mt-1 block font-bold">
                Virtual Identity
              </span>
            </div>
            <div className="p-5 border border-neutral-900 bg-neutral-950/60">
              <span className="block font-editorial-modern text-2xl sm:text-3xl font-extrabold text-white">
                4K+
              </span>
              <span className="text-[10px] font-grotesk tracking-widest text-neutral-400 uppercase mt-1 block">
                Digital Fidelity
              </span>
            </div>
            <div className="p-5 border border-neutral-900 bg-neutral-950/60">
              <span className="block font-editorial-modern text-2xl sm:text-3xl font-extrabold text-white">
                3
              </span>
              <span className="text-[10px] font-grotesk tracking-widest text-[#E50920] uppercase mt-1 block font-bold">
                Core Dimensions
              </span>
            </div>
            <div className="p-5 border border-neutral-900 bg-neutral-950/60">
              <span className="block font-editorial-modern text-2xl sm:text-3xl font-extrabold text-white">
                0
              </span>
              <span className="text-[10px] font-grotesk tracking-widest text-neutral-400 uppercase mt-1 block">
                Physical Limits
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
