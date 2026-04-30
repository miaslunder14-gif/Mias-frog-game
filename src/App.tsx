import React from 'react';
import MusicPlayer from './components/MusicPlayer';
import FrogGame from './components/FrogGame';

export default function App() {
  return (
    <div className="h-screen w-full bg-[#0A0A0A] text-[#39FF14] font-mono flex flex-col border-4 border-[#39FF14] overflow-hidden selection:bg-[#39FF14] selection:text-black">
      {/* Header: App Status Bar */}
      <header className="h-12 border-b border-[#39FF14] flex items-center justify-between px-6 bg-[#121212] shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-[#39FF14] animate-pulse"></div>
          <h1 className="text-lg font-bold tracking-tighter uppercase">Ribbit & Rhythm v2.1.0</h1>
        </div>
        <div className="hidden md:flex gap-8 text-sm">
          <div className="flex gap-2"><span className="opacity-50">STATUS:</span><span className="font-black">NOMINAL</span></div>
          <div className="flex gap-2"><span className="opacity-50">SYNC:</span><span className="font-black">ACTIVE</span></div>
          <div className="flex gap-2"><span className="opacity-50">UPLINK:</span><span className="font-black">ESTABLISHED</span></div>
        </div>
      </header>

      {/* Main Interface Split */}
      <div className="flex-1 grid grid-cols-12 min-h-0 overflow-hidden">
        {/* We use the High Density 3-6-3 column layout by composing components into this view */}
        {/* Note: I'll restructure MusicPlayer to act as the sidebars and FrogGame as the center */}
        <MusicPlayer />
      </div>

      {/* Global Scanline Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        <div className="w-full h-[2px] bg-white opacity-[0.03] animate-scanline shadow-[0_0_10px_#39FF14]" />
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-5px); }
          100% { transform: translateY(100vh); }
        }
        .animate-scanline {
          animation: scanline 4s linear infinite;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0A0A0A;
        }
        ::-webkit-scrollbar-thumb {
          background: #39FF1444;
          border: 1px solid #39FF14;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #39FF14;
        }
      `}</style>
    </div>
  );
}
