'use client';

import React from 'react';

export function LenovoLaptopHero() {
  return (
    <div className="relative w-full max-w-[340px] sm:max-w-none mx-auto select-none">
      <div className="relative w-full flex flex-col items-center justify-center filter drop-shadow-md">
        {/* Laptop Display (Top Shell) */}
        <div className="relative w-[90%] aspect-[16/10] bg-[#1a1c23] rounded-t-lg p-[5px] sm:p-[6px] border border-[#2d313d] shadow-xl flex flex-col">
          {/* Webcam Notch */}
          <div className="absolute top-[2px] left-1/2 -translate-x-1/2 flex items-center gap-1 z-20">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0f] border border-gray-700 flex items-center justify-center">
              <div className="w-0.5 h-0.5 rounded-full bg-blue-400" />
            </div>
          </div>

          {/* Screen Content */}
          <div className="relative flex-1 w-full h-full rounded-xs overflow-hidden bg-[#070b19] flex flex-col justify-between p-2 sm:p-2.5">
            {/* Wallpaper Background: Nebula & Mountain Peaks */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b1026] via-[#1a1438] to-[#25103a]">
              {/* Neon Aurora Glows */}
              <div className="absolute -top-6 left-1/4 w-32 h-32 bg-blue-500/30 rounded-full blur-xl" />
              <div className="absolute top-1/4 right-1/4 w-28 h-28 bg-purple-500/35 rounded-full blur-xl" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-cyan-400/25 rounded-full blur-lg" />

              {/* Mountain Silhouettes */}
              <svg viewBox="0 0 400 200" className="absolute bottom-0 w-full h-full opacity-65 preserve-3d">
                <polygon points="0,200 80,120 160,170 240,90 320,160 400,110 400,200" fill="#0d122b" />
                <polygon points="40,200 130,140 210,185 290,115 370,180 400,160 400,200" fill="#141938" />
                <polygon points="90,200 180,155 260,195 330,135 400,185 400,200" fill="#1c224a" />
              </svg>
            </div>

            {/* Top Left: Red Lenovo Tag */}
            <div className="relative z-10 flex items-center">
              <span className="bg-[#E2231A] text-white font-bold text-[7px] sm:text-[8px] tracking-wider px-1.5 py-0.5 rounded-xs shadow-xs">
                Lenovo
              </span>
            </div>

            {/* Center: Glowing LOQ Logo */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto">
              <div className="text-white font-black text-xl sm:text-2xl tracking-[0.25em] drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
                L O Q
              </div>
            </div>

            {/* Bottom Screen Badges */}
            <div className="relative z-10 flex items-center justify-between text-[7px] sm:text-[8px] font-bold">
              <span className="bg-black/70 backdrop-blur-xs text-white px-1.5 py-0.5 rounded border border-white/20">
                RTX 4060
              </span>
              <div className="text-right text-white/90">
                <span className="text-[9px] sm:text-[10px] font-black">15.6&quot;</span>
                <span className="text-[6px] sm:text-[7px] text-gray-300 block leading-tight">FHD 144Hz</span>
              </div>
            </div>
          </div>

          {/* Display Bottom Chin with Subtle Lenovo text */}
          <div className="h-2 flex items-center justify-center bg-[#181a22]">
            <span className="text-[6px] tracking-widest text-gray-500 font-semibold uppercase">Lenovo</span>
          </div>
        </div>

        {/* Laptop Base (Keyboard Deck & Chassis) */}
        <div className="relative w-full h-[44px] sm:h-[48px] bg-gradient-to-b from-[#232732] to-[#15171e] rounded-b-lg border-t border-[#383e4d] shadow-xl flex flex-col items-center justify-between px-3 py-1">
          {/* Power Button */}
          <div className="w-full flex items-center justify-center relative">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_#22d3ee]" />
          </div>

          {/* 4-Zone RGB Backlit Keyboard Simulation */}
          <div className="w-[88%] h-5 bg-[#0c0d12] rounded p-0.5 border border-gray-700/60 flex flex-col justify-between">
            {/* Row 1 */}
            <div className="flex gap-[1.5px] h-[4px]">
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={`k1-${i}`}
                  className="flex-1 rounded-[1px] bg-gradient-to-r from-blue-500/70 via-purple-500/70 to-pink-500/70 shadow-[0_0_2px_rgba(59,130,246,0.6)]"
                />
              ))}
            </div>
            {/* Row 2 */}
            <div className="flex gap-[1.5px] h-[4px]">
              {Array.from({ length: 13 }).map((_, i) => (
                <div
                  key={`k2-${i}`}
                  className="flex-1 rounded-[1px] bg-gradient-to-r from-cyan-400/70 via-blue-500/70 to-indigo-500/70 shadow-[0_0_2px_rgba(34,211,238,0.6)]"
                />
              ))}
            </div>
            {/* Row 3 Spacebar */}
            <div className="flex gap-[1.5px] h-[4px]">
              <div className="w-3 rounded-[1px] bg-blue-500/60" />
              <div className="flex-1 rounded-[1px] bg-gradient-to-r from-blue-500/70 via-cyan-400/80 to-blue-600/70 shadow-[0_0_3px_rgba(34,211,238,0.8)]" />
              <div className="w-3 rounded-[1px] bg-indigo-500/60" />
            </div>
          </div>

          {/* Precision Trackpad */}
          <div className="w-12 h-1.5 bg-[#1a1d26] rounded-xs border border-gray-700/50" />
        </div>

        {/* Chassis Lip */}
        <div className="w-[96%] h-1 bg-[#0b0c10] rounded-b-sm shadow mx-auto" />
      </div>
    </div>
  );
}
