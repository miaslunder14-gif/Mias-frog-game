import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, Trophy, Bug, User, Menu, Zap } from 'lucide-react';
import { Track, DUMMY_PLAYLIST } from '../types';
import FrogGame from './FrogGame';

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentTrack = DUMMY_PLAYLIST[currentTrackIndex];

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            handleForward();
            return 0;
          }
          return p + 1;
        });
      }, currentTrack.duration * 10);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrackIndex]);

  const handleBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_PLAYLIST.length) % DUMMY_PLAYLIST.length);
    setProgress(0);
  };

  const handleForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_PLAYLIST.length);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 grid grid-cols-12 min-h-0 overflow-hidden">
        
        {/* Left Sidebar: Playlist (Col-3) */}
        <aside className="col-span-12 lg:col-span-3 border-r border-[#39FF14] flex flex-col bg-[#0D0D0D] min-h-0">
          <div className="p-4 border-b border-[#39FF14] bg-[#161616] text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
            <Menu className="w-3 h-3" />
            Up Next / Queue [Channel 0]
          </div>
          <div className="flex-1 overflow-y-auto">
            {DUMMY_PLAYLIST.map((track, idx) => (
              <button
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(idx);
                  setProgress(0);
                  setIsPlaying(true);
                }}
                className={`w-full p-4 border-b border-[#39FF14]/20 flex items-center gap-3 transition-colors text-left ${
                  currentTrackIndex === idx ? 'bg-[#39FF14]/10 text-[#39FF14]' : 'hover:bg-[#39FF14]/5 text-zinc-500'
                }`}
              >
                <div className="text-[10px] font-mono opacity-50">{(idx + 1).toString().padStart(2, '0')}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-bold uppercase truncate">{track.title}</div>
                  <div className="text-[9px] opacity-70 italic truncate">{track.artist}</div>
                </div>
                {currentTrackIndex === idx && isPlaying && (
                  <motion.div 
                    animate={{ opacity: [0.3, 1, 0.3] }} 
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-1.5 h-1.5 bg-[#39FF14] rounded-full"
                  />
                )}
                <div className="text-[9px] font-mono">{formatTime(track.duration)}</div>
              </button>
            ))}
          </div>
          <div className="p-4 border-t border-[#39FF14] bg-[#121212]">
            <div className="text-[9px] uppercase opacity-50 mb-2 font-black tracking-widest text-[#39FF14]">Spectrogram</div>
            <div className="flex items-end gap-[2px] h-12">
              {[0.3, 0.6, 0.9, 0.4, 0.7, 0.5, 1.0, 0.4, 0.8, 0.6, 0.3, 0.9].map((h, i) => (
                <motion.div
                  key={i}
                  animate={isPlaying ? { height: [`${h * 20}%`, `${h * 100}%`, `${h * 40}%`] } : { height: `${h * 30}%` }}
                  transition={{ repeat: Infinity, duration: 0.5 + Math.random(), ease: "easeInOut" }}
                  className="flex-1 bg-[#39FF14] min-w-[2px]"
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Center: The Frog Game Arena (Col-6) */}
        <main className="col-span-12 lg:col-span-6 p-4 flex flex-col bg-[#050505] relative min-h-0">
          <div className="relative z-10 h-full">
            <FrogGame isMusicPlaying={isPlaying} />
          </div>
        </main>

        {/* Right Sidebar: Now Playing Info (Col-3) */}
        <aside className="col-span-12 lg:col-span-3 border-l border-[#39FF14] flex flex-col bg-[#0D0D0D] min-h-0">
          <div className="p-6 flex-1 overflow-y-auto">
            <div className="mb-8 border-2 border-[#39FF14] p-4 bg-[#0A0A0A] shadow-[4px_4px_0px_#39FF14]">
              <div className="text-[10px] uppercase opacity-50 mb-1 font-black">Now Playing</div>
              <div className="text-sm font-bold text-white truncate mb-1 uppercase tracking-tighter">{currentTrack.title}</div>
              <div className="text-[10px] opacity-70 mb-6 italic">Artist: {currentTrack.artist}</div>
              
              <div className="w-full aspect-square bg-[#050505] border border-[#39FF14] flex items-center justify-center relative overflow-hidden group">
                 <div className="absolute inset-0 opacity-10 bg-[repeating-radial-gradient(circle_at_center,_#39FF14_0,_#39FF14_1px,_transparent_0,_transparent_10px)] group-hover:scale-150 transition-transform duration-[2s]"></div>
                 <AnimatePresence mode="wait">
                    <motion.img 
                      key={currentTrack.id}
                      src={currentTrack.cover} 
                      initial={{ opacity: 0, filter: 'grayscale(1) contrast(2)' }}
                      animate={{ opacity: 1, filter: isPlaying ? 'grayscale(0) contrast(1.2)' : 'grayscale(1) contrast(2)' }}
                      className="w-full h-full object-cover relative z-10"
                      referrerPolicy="no-referrer"
                    />
                 </AnimatePresence>
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <div className="w-full h-px bg-[#39FF14]/30 animate-pulse" />
                    <div className="h-full w-px bg-[#39FF14]/30 animate-pulse" />
                 </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] mb-2 font-black">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> SWAMP DRIVE</span>
                  <span>{isPlaying ? '84%' : '0%'}</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 border border-[#39FF14]/20">
                  <motion.div 
                    animate={isPlaying ? { width: '84%' } : { width: '0%' }}
                    className="h-full bg-[#39FF14] shadow-[0_0_10px_#39FF14]" 
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] mb-2 font-black">
                  <span>NEURAL SYNC</span>
                  <span>{isPlaying ? 'ACTIVE' : 'IDLE'}</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-900 border border-[#39FF14]/20">
                  <motion.div 
                    animate={isPlaying ? { width: '45%' } : { width: '10%' }}
                    className="h-full bg-[#39FF14] shadow-[0_0_10px_#39FF14]" 
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-[#39FF14] text-[9px] leading-relaxed text-[#39FF14]/60 bg-[#0A0A0A]">
            TERMINAL_LOG: [{new Date().toLocaleTimeString()}] Stream buffered. Patch 2.1.0 active. Grid response: 14ms. Ready for input...
          </div>
        </aside>
      </div>

      {/* Footer: Playback Controls */}
      <footer className="h-24 md:h-20 border-t-2 border-[#39FF14] bg-[#121212] flex flex-col md:flex-row items-center px-6 md:px-10 gap-4 md:gap-10 py-2 shrink-0">
        <div className="flex items-center gap-6">
          <button onClick={handleBackward} className="text-xl text-[#39FF14] transition-all hover:scale-125 hover:text-white">
             <SkipBack className="w-5 h-5 fill-current" />
          </button>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-12 h-12 border-2 border-[#39FF14] rounded-full flex items-center justify-center text-black bg-[#39FF14] shadow-[0_0_15px_#39FF14] hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black translate-x-0.5" />}
          </button>
          <button onClick={handleForward} className="text-xl text-[#39FF14] transition-all hover:scale-125 hover:text-white">
             <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-1 w-full max-w-2xl">
          <div className="flex justify-between text-[11px] font-black uppercase tracking-tighter">
            <span>{formatTime((progress / 100) * currentTrack.duration)}</span>
            <span className="opacity-50 truncate hidden sm:inline px-4">{currentTrack.title} — STREEM_VR_DATA</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
          <div className="h-3 w-full bg-zinc-900 border border-[#39FF14]/30 relative cursor-pointer group overflow-hidden">
            <motion.div 
              className="absolute h-full bg-[#39FF14] shadow-[0_0_15px_#39FF14]"
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
            {/* The handle mark from the design */}
            <motion.div 
               animate={{ left: `${progress}%` }}
               transition={{ ease: 'linear' }}
               className="absolute top-1/2 -translate-y-1/2 w-4 h-5 bg-[#39FF14] border border-black z-10 -ml-2" 
            />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 min-w-[150px]">
          <Volume2 className="w-4 h-4" />
          <div className="flex-1 h-1.5 bg-zinc-900 border border-[#39FF14]/20 flex">
            <div className="h-full bg-[#39FF14] w-[70%]" />
          </div>
        </div>
      </footer>
    </div>
  );
}
