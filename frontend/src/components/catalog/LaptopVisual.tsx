'use client';

import React from 'react';

export type LaptopModelType =
  | 'lenovo-loq'
  | 'macbook-pro'
  | 'hp-victus'
  | 'asus-rog'
  | 'dell-g15'
  | 'lenovo-legion';

interface LaptopVisualProps {
  model: LaptopModelType;
}

export function LaptopVisual({ model }: LaptopVisualProps) {
  switch (model) {
    case 'lenovo-loq':
      return (
        <div className="relative w-full aspect-[16/11] flex flex-col items-center justify-center filter drop-shadow-md select-none">
          {/* Display */}
          <div className="relative w-[88%] aspect-[16/10] bg-[#1a1c23] rounded-t-lg p-[4px] border border-[#2d313d] shadow-lg flex flex-col">
            <div className="relative flex-1 w-full h-full rounded-xs overflow-hidden bg-[#070b19] flex flex-col justify-between p-1.5">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0b1026] via-[#1a1438] to-[#25103a]">
                <div className="absolute top-0 right-1/4 w-20 h-20 bg-purple-500/30 rounded-full blur-md" />
                <div className="absolute bottom-0 left-1/4 w-24 h-12 bg-cyan-400/25 rounded-full blur-md" />
                <svg viewBox="0 0 200 100" className="absolute bottom-0 w-full h-full opacity-60">
                  <polygon points="0,100 40,60 80,85 120,45 160,80 200,55 200,100" fill="#0d122b" />
                  <polygon points="20,100 70,70 110,90 150,55 190,85 200,80 200,100" fill="#141938" />
                </svg>
              </div>
              <div className="relative z-10">
                <span className="bg-[#E2231A] text-white font-bold text-[6px] px-1 py-0.2 rounded-xs">Lenovo</span>
              </div>
              <div className="relative z-10 text-center my-auto">
                <span className="text-white font-black text-sm tracking-[0.2em] drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]">L O Q</span>
              </div>
              <div className="relative z-10 flex justify-between text-[6px] font-bold text-white/90">
                <span className="bg-black/60 px-1 py-0.2 rounded">RTX 4060</span>
                <span>15.6&quot; 144Hz</span>
              </div>
            </div>
            <div className="h-1.5 flex items-center justify-center bg-[#181a22]">
              <span className="text-[5px] tracking-widest text-gray-500 uppercase font-bold">Lenovo</span>
            </div>
          </div>
          {/* Base */}
          <div className="relative w-full h-[32px] bg-gradient-to-b from-[#232732] to-[#15171e] rounded-b-lg border-t border-[#383e4d] shadow-lg flex flex-col items-center justify-between px-2 py-1">
            <div className="w-1 h-1 rounded-full bg-cyan-400" />
            <div className="w-[88%] h-3.5 bg-[#0c0d12] rounded p-0.5 border border-gray-700/60 flex flex-col justify-between">
              <div className="flex gap-[1px] h-[2.5px]">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex-1 rounded-[0.5px] bg-gradient-to-r from-blue-500/70 via-purple-500/70 to-pink-500/70" />
                ))}
              </div>
              <div className="flex gap-[1px] h-[2.5px]">
                <div className="w-2 rounded-[0.5px] bg-blue-500/60" />
                <div className="flex-1 rounded-[0.5px] bg-cyan-400/80" />
                <div className="w-2 rounded-[0.5px] bg-indigo-500/60" />
              </div>
            </div>
            <div className="w-8 h-1 bg-[#1a1d26] rounded-xs" />
          </div>
        </div>
      );

    case 'macbook-pro':
      return (
        <div className="relative w-full aspect-[16/11] flex flex-col items-center justify-center filter drop-shadow-md select-none">
          {/* Display */}
          <div className="relative w-[88%] aspect-[16/10] bg-[#1e2024] rounded-t-lg p-[4px] border border-[#2d3036] shadow-lg flex flex-col">
            <div className="relative flex-1 w-full h-full rounded-xs overflow-hidden bg-[#050508] flex flex-col justify-between p-1.5">
              <div className="absolute inset-0 bg-gradient-to-br from-[#120826] via-[#240c42] to-[#0d071e]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/40 via-violet-600/20 to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-tr from-purple-400 to-indigo-300 rounded-full blur-md opacity-80" />
              </div>
              <div className="relative z-10 flex justify-center">
                <div className="w-3 h-0.5 bg-black rounded-b-xs" />
              </div>
              <div className="relative z-10 text-center my-auto">
                <span className="text-white/95 font-medium text-[11px] tracking-tight drop-shadow-md"></span>
              </div>
              <div className="relative z-10 flex justify-between text-[6px] font-semibold text-white/80">
                <span>M3 Pro</span>
                <span>Liquid Retina XDR</span>
              </div>
            </div>
            <div className="h-1 bg-[#1e2024]" />
          </div>
          {/* Base */}
          <div className="relative w-full h-[28px] bg-gradient-to-b from-[#24272e] to-[#17191d] rounded-b-lg border-t border-[#3a3e47] shadow-lg flex flex-col items-center justify-between px-2 py-1">
            <div className="w-[85%] h-3 bg-[#0d0e11] rounded-xs p-0.5 flex flex-col justify-between border border-gray-700/50">
              <div className="flex gap-[1px] h-[2px]">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex-1 rounded-[0.5px] bg-white/20" />
                ))}
              </div>
              <div className="w-6 h-[2px] bg-white/25 mx-auto rounded-[0.5px]" />
            </div>
            <div className="w-10 h-1.5 bg-[#1b1d22] rounded-xs border border-gray-700/40" />
          </div>
        </div>
      );

    case 'hp-victus':
      return (
        <div className="relative w-full aspect-[16/11] flex flex-col items-center justify-center filter drop-shadow-md select-none">
          {/* Display */}
          <div className="relative w-[88%] aspect-[16/10] bg-[#16181d] rounded-t-lg p-[4px] border border-[#2b2e37] shadow-lg flex flex-col">
            <div className="relative flex-1 w-full h-full rounded-xs overflow-hidden bg-[#07090e] flex flex-col justify-between p-1.5">
              <div className="absolute inset-0 bg-gradient-to-br from-[#081220] via-[#0d2238] to-[#071322]">
                <div className="absolute inset-0 flex items-center justify-center opacity-85">
                  <svg viewBox="0 0 100 100" className="w-12 h-12">
                    <polygon points="50,15 90,85 70,85 50,45 30,85 10,85" fill="#0284c7" />
                    <polygon points="50,30 80,85 68,85 50,55 32,85 20,85" fill="#38bdf8" opacity="0.6" />
                  </svg>
                </div>
              </div>
              <div className="relative z-10 flex justify-between text-[6px] font-bold text-white/90">
                <span className="bg-sky-950/80 text-sky-300 px-1 py-0.2 rounded border border-sky-600/30">RTX 3050</span>
              </div>
              <div className="relative z-10 text-center my-auto">
                <span className="text-white font-black text-xs tracking-widest drop-shadow-[0_0_6px_#38bdf8]">VICTUS</span>
              </div>
              <div className="relative z-10 text-right text-[6px] font-bold text-white/90">
                <span>144Hz FHD</span>
              </div>
            </div>
            <div className="h-1.5 flex items-center justify-center bg-[#15171d]">
              <span className="text-[5px] text-gray-500 font-bold tracking-widest">VICTUS</span>
            </div>
          </div>
          {/* Base */}
          <div className="relative w-full h-[32px] bg-gradient-to-b from-[#22252c] to-[#14161b] rounded-b-lg border-t border-[#353943] shadow-lg flex flex-col items-center justify-between px-2 py-1">
            <div className="w-1 h-1 rounded-full bg-sky-400" />
            <div className="w-[88%] h-3.5 bg-[#0b0c0f] rounded p-0.5 border border-gray-700/60 flex flex-col justify-between">
              <div className="flex gap-[1px] h-[2.5px]">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex-1 rounded-[0.5px] bg-sky-400/50" />
                ))}
              </div>
              <div className="flex gap-[1px] h-[2.5px]">
                <div className="w-3 bg-sky-400/40 rounded-[0.5px]" />
                <div className="flex-1 bg-sky-400/70 rounded-[0.5px]" />
                <div className="w-3 bg-sky-400/40 rounded-[0.5px]" />
              </div>
            </div>
            <div className="w-8 h-1 bg-[#1a1c22] rounded-xs" />
          </div>
        </div>
      );

    case 'asus-rog':
      return (
        <div className="relative w-full aspect-[16/11] flex flex-col items-center justify-center filter drop-shadow-md select-none">
          {/* Display */}
          <div className="relative w-[88%] aspect-[16/10] bg-[#14151a] rounded-t-lg p-[4px] border border-[#292b34] shadow-lg flex flex-col">
            <div className="relative flex-1 w-full h-full rounded-xs overflow-hidden bg-[#050608] flex flex-col justify-between p-1.5">
              <div className="absolute inset-0 bg-gradient-to-br from-[#12051f] via-[#1f0b35] to-[#0d0416]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-fuchsia-500 to-transparent rotate-[-25deg] shadow-[0_0_8px_#d946ef]" />
                  <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rotate-[-25deg] translate-y-3 shadow-[0_0_8px_#22d3ee]" />
                </div>
              </div>
              <div className="relative z-10 flex justify-between text-[6px] font-bold text-white/90">
                <span className="bg-fuchsia-950/80 text-fuchsia-300 px-1 py-0.2 rounded border border-fuchsia-500/30">RTX 4070</span>
              </div>
              <div className="relative z-10 text-center my-auto">
                <div className="text-white font-black text-xs tracking-wider drop-shadow-[0_0_8px_#e879f9]">ROG</div>
                <div className="text-[6px] text-fuchsia-300 font-bold tracking-widest -mt-0.5">ZEPHYRUS</div>
              </div>
              <div className="relative z-10 text-right text-[6px] font-bold text-white/90">
                <span>16&quot; 240Hz 2.5K</span>
              </div>
            </div>
            <div className="h-1.5 flex items-center justify-center bg-[#15171d]">
              <span className="text-[5px] text-gray-500 font-bold tracking-widest">ROG</span>
            </div>
          </div>
          {/* Base */}
          <div className="relative w-full h-[32px] bg-gradient-to-b from-[#21232a] to-[#131418] rounded-b-lg border-t border-[#343742] shadow-lg flex flex-col items-center justify-between px-2 py-1">
            <div className="w-1 h-1 rounded-full bg-fuchsia-400" />
            <div className="w-[88%] h-3.5 bg-[#0a0b0d] rounded p-0.5 border border-gray-700/60 flex flex-col justify-between">
              <div className="flex gap-[1px] h-[2.5px]">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex-1 rounded-[0.5px] bg-gradient-to-r from-fuchsia-500/70 to-cyan-400/70" />
                ))}
              </div>
              <div className="flex gap-[1px] h-[2.5px]">
                <div className="flex-1 bg-gradient-to-r from-fuchsia-500/80 via-purple-500 to-cyan-400/80 rounded-[0.5px]" />
              </div>
            </div>
            <div className="w-8 h-1 bg-[#181a20] rounded-xs" />
          </div>
        </div>
      );

    case 'dell-g15':
      return (
        <div className="relative w-full aspect-[16/11] flex flex-col items-center justify-center filter drop-shadow-md select-none">
          {/* Display */}
          <div className="relative w-[88%] aspect-[16/10] bg-[#18191f] rounded-t-lg p-[4px] border border-[#2b2d37] shadow-lg flex flex-col">
            <div className="relative flex-1 w-full h-full rounded-xs overflow-hidden bg-[#07080c] flex flex-col justify-between p-1.5">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0c182b] via-[#122846] to-[#081220]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/40 via-cyan-600/20 to-transparent" />
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-amber-500/30 to-transparent rounded-full blur-sm" />
              </div>
              <div className="relative z-10 flex justify-between text-[6px] font-bold text-white/90">
                <span className="bg-blue-950/80 text-blue-300 px-1 py-0.2 rounded border border-blue-500/30">RTX 4050</span>
              </div>
              <div className="relative z-10 text-center my-auto">
                <span className="text-white font-black text-xs tracking-widest border border-white/40 px-2 py-0.5 rounded-full drop-shadow-[0_0_6px_#60a5fa]">
                  DELL
                </span>
              </div>
              <div className="relative z-10 text-right text-[6px] font-bold text-white/90">
                <span>15.6&quot; 165Hz</span>
              </div>
            </div>
            <div className="h-1.5 flex items-center justify-center bg-[#18191f]">
              <span className="text-[5px] text-gray-500 font-bold tracking-widest">DELL</span>
            </div>
          </div>
          {/* Base */}
          <div className="relative w-full h-[32px] bg-gradient-to-b from-[#24262e] to-[#15171c] rounded-b-lg border-t border-[#373a45] shadow-lg flex flex-col items-center justify-between px-2 py-1">
            <div className="w-1 h-1 rounded-full bg-blue-400" />
            <div className="w-[88%] h-3.5 bg-[#0c0d10] rounded p-0.5 border border-gray-700/60 flex flex-col justify-between">
              <div className="flex gap-[1px] h-[2.5px]">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex-1 rounded-[0.5px] bg-gradient-to-r from-blue-400/60 to-cyan-400/60" />
                ))}
              </div>
              <div className="flex gap-[1px] h-[2.5px]">
                <div className="flex-1 bg-gradient-to-r from-blue-400/70 to-amber-400/70 rounded-[0.5px]" />
              </div>
            </div>
            <div className="w-8 h-1 bg-[#1a1c22] rounded-xs" />
          </div>
        </div>
      );

    case 'lenovo-legion':
      return (
        <div className="relative w-full aspect-[16/11] flex flex-col items-center justify-center filter drop-shadow-md select-none">
          {/* Display */}
          <div className="relative w-[88%] aspect-[16/10] bg-[#1a1c23] rounded-t-lg p-[4px] border border-[#2d303b] shadow-lg flex flex-col">
            <div className="relative flex-1 w-full h-full rounded-xs overflow-hidden bg-[#070b16] flex flex-col justify-between p-1.5">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0c142e] via-[#182852] to-[#0d1633]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/35 via-indigo-600/20 to-transparent" />
                <svg viewBox="0 0 200 100" className="absolute bottom-0 w-full h-full opacity-60">
                  <polygon points="0,100 50,55 90,80 130,40 170,75 200,50 200,100" fill="#0e1736" />
                </svg>
              </div>
              <div className="relative z-10 flex justify-between text-[6px] font-bold text-white/90">
                <span className="bg-[#E2231A] text-white px-1 py-0.2 rounded-xs font-bold">Lenovo</span>
                <span className="bg-black/60 px-1 py-0.2 rounded">RTX 4060 (140W)</span>
              </div>
              <div className="relative z-10 text-center my-auto">
                <div className="text-white font-black text-xs tracking-[0.2em] drop-shadow-[0_0_8px_#38bdf8]">
                  LEGION
                </div>
              </div>
              <div className="relative z-10 text-right text-[6px] font-bold text-white/90">
                <span>16&quot; WQXGA 240Hz</span>
              </div>
            </div>
            <div className="h-1.5 flex items-center justify-center bg-[#171920]">
              <span className="text-[5px] text-gray-500 font-bold tracking-widest uppercase">Legion</span>
            </div>
          </div>
          {/* Base */}
          <div className="relative w-full h-[32px] bg-gradient-to-b from-[#232630] to-[#14161d] rounded-b-lg border-t border-[#373a46] shadow-lg flex flex-col items-center justify-between px-2 py-1">
            <div className="w-1 h-1 rounded-full bg-cyan-400" />
            <div className="w-[88%] h-3.5 bg-[#0b0c10] rounded p-0.5 border border-gray-700/60 flex flex-col justify-between">
              <div className="flex gap-[1px] h-[2.5px]">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="flex-1 rounded-[0.5px] bg-gradient-to-r from-blue-400/70 via-indigo-400/70 to-cyan-400/70" />
                ))}
              </div>
              <div className="flex gap-[1px] h-[2.5px]">
                <div className="flex-1 bg-gradient-to-r from-blue-500/80 to-cyan-400/80 rounded-[0.5px]" />
              </div>
            </div>
            <div className="w-8 h-1 bg-[#1a1c22] rounded-xs" />
          </div>
        </div>
      );

    default:
      return null;
  }
}
