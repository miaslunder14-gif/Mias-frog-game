import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Bug, RefreshCw, Zap, Crosshair, Terminal } from 'lucide-react';

interface GameState {
  score: number;
  highScore: number;
  isPlaying: boolean;
  timeLeft: number;
}

interface Fly {
  id: number;
  x: number;
  y: number;
}

interface FrogGameProps {
  isMusicPlaying?: boolean;
}

export default function FrogGame({ isMusicPlaying = false }: FrogGameProps) {
  const [state, setState] = useState<GameState>({
    score: 0,
    highScore: 0,
    isPlaying: false,
    timeLeft: 30,
  });

  const [frogPos, setFrogPos] = useState({ x: 50, y: 50 });
  const [flies, setFlies] = useState<Fly[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextFlyId = useRef(0);

  const spawnFly = useCallback(() => {
    const newFly = {
      id: nextFlyId.current++,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
    };
    setFlies((prev) => [...prev, newFly]);
  }, []);

  const startGame = () => {
    setState({ ...state, isPlaying: true, score: 0, timeLeft: 30 });
    setFlies([]);
    setFrogPos({ x: 50, y: 50 });
    spawnFly();
  };

  useEffect(() => {
    if (state.isPlaying && state.timeLeft > 0) {
      const timer = setInterval(() => {
        setState((s) => ({ ...s, timeLeft: s.timeLeft - 1 }));
      }, 1000);
      return () => clearInterval(timer);
    } else if (state.timeLeft === 0 && state.isPlaying) {
      setState((s) => ({
        ...s,
        isPlaying: false,
        highScore: Math.max(s.highScore, s.score),
      }));
    }
  }, [state.isPlaying, state.timeLeft]);

  useEffect(() => {
    if (state.isPlaying && flies.length < 3) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) spawnFly();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [state.isPlaying, flies, spawnFly]);

  const handleAreaClick = (e: React.MouseEvent) => {
    if (!state.isPlaying) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setFrogPos({ x, y });

    const catchRadius = 8;
    const caughtFlies = flies.filter((fly) => {
      const dist = Math.sqrt(Math.pow(fly.x - x, 2) + Math.pow(fly.y - y, 2));
      return dist < catchRadius;
    });

    if (caughtFlies.length > 0) {
      setState((s) => ({ ...s, score: s.score + caughtFlies.length }));
      setFlies((prev) => prev.filter((f) => !caughtFlies.includes(f)));
      spawnFly();
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#050505] relative border-2 border-[#39FF14] overflow-hidden">
      {/* Game Field Environment */}
      <div 
        ref={containerRef}
        onClick={handleAreaClick}
        className="flex-1 relative cursor-crosshair bg-[radial-gradient(circle_at_center,_#1a331a_0%,_#050505_80%)]"
      >
        {/* Grid Simulation Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(#39FF14_1px,transparent_1px),linear-gradient(90deg,#39FF14_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* --- DANCING BACKGROUND VISUALS --- */}
        <div className="absolute inset-x-0 bottom-0 top-0 pointer-events-none overflow-hidden opacity-20 z-0">
          {/* Scrolling Music Notes (Frogs jump over these) */}
          {isMusicPlaying && [0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={`note-${i}`}
              initial={{ x: '110%', y: `${40 + i * 12}%` }}
              animate={{ x: '-20%' }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                delay: i * 1.2,
                ease: "linear"
              }}
              className="absolute text-[#39FF14] text-5xl opacity-40 font-serif"
            >
              ♫
            </motion.div>
          ))}

          {/* Large Jumping Frogs in the background */}
          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-32">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`bg-dancer-${i}`}
                animate={isMusicPlaying ? { 
                  y: [0, -80, 0],
                  scaleY: [1, 0.7, 1.3, 1],
                  rotate: [0, 5, -5, 0]
                } : { y: 0 }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 0.7, 
                  delay: i * 0.2,
                  ease: "easeInOut" 
                }}
                className="flex flex-col items-center origin-bottom"
              >
                <div className="w-16 h-12 bg-[#39FF14] rounded-t-full shadow-[0_0_30px_#39FF14] flex justify-center pt-2 gap-2 border border-white/20">
                  <div className="w-2 h-2 bg-black rounded-full" />
                  <div className="w-2 h-2 bg-black rounded-full" />
                </div>
                <div className="flex gap-6 mt-[-4px]">
                  <motion.div 
                    animate={isMusicPlaying ? { rotate: [-20, 20, -20] } : {}}
                    transition={{ repeat: Infinity, duration: 0.7 }}
                    className="w-4 h-8 bg-[#39FF14]/80 rounded-full" 
                  />
                  <motion.div 
                    animate={isMusicPlaying ? { rotate: [20, -20, 20] } : {}}
                    transition={{ repeat: Infinity, duration: 0.7 }}
                    className="w-4 h-8 bg-[#39FF14]/80 rounded-full" 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        {/* ------------------------------- */}

        {/* HUD Sub-Overlay */}
        <div className="absolute top-4 left-4 z-40 bg-black/80 p-3 border border-[#39FF14]/30 pointer-events-none">
          <div className="text-[10px] font-black uppercase space-y-1">
             <div className="flex justify-between gap-4"><span>SYSTEM_READY:</span><span className="text-white">TRUE</span></div>
             <div className="flex justify-between gap-4"><span>CORE_TEMP:</span><span className="text-white">32°C</span></div>
             <div className="flex justify-between gap-4"><span>SCAN_MODE:</span><span className="text-white">ACTIVE</span></div>
          </div>
        </div>

        {/* Stats HUD (Top Right) */}
        <div className="absolute top-4 right-4 z-40 flex flex-col items-end gap-2 pointer-events-none">
          <div className="bg-[#39FF14] text-black px-4 py-1 font-black text-sm shadow-[4px_4px_0px_white]">
             DATA_POINTS: {state.score.toString().padStart(5, '0')}
          </div>
          <div className="bg-black border border-[#39FF14]/50 px-3 py-1 text-[10px] font-bold text-white tracking-widest">
             T_REMAINING: {state.timeLeft}s
          </div>
        </div>

        {/* Game Elements */}
        <AnimatePresence>
          {flies.map((fly) => (
            <motion.div
              key={fly.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              className="absolute w-8 h-8 z-10 flex items-center justify-center"
              style={{ left: `${fly.x}%`, top: `${fly.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <Bug className="w-5 h-5 text-[#39ff14] shadow-[0_0_10px_#39ff14]" />
              <div className="absolute inset-0 bg-[#39ff14]/10 rounded-full animate-ping" />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* The Frog - Retained functional core but stylized to High Density */}
        <motion.div
          animate={{ x: `${frogPos.x}%`, y: `${frogPos.y}%` }}
          transition={{ type: 'spring', damping: 15, stiffness: 300, mass: 0.5 }}
          className="absolute w-12 h-12 flex items-center justify-center z-20 pointer-events-none"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <div className="relative">
            <div className={`w-8 h-8 bg-[#39FF14] border-2 border-white shadow-[0_0_20px_#39FF14] flex flex-col items-center justify-center font-black text-black text-xs`}>
               {/* Minimal "Frog" appearance: just eyes/symbols */}
               <div className="flex gap-1.5 mb-0.5">
                  <div className="w-1.5 h-1.5 bg-black" />
                  <div className="w-1.5 h-1.5 bg-black" />
               </div>
               <div className="w-4 h-0.5 bg-black/40 rounded-full" />
            </div>
            
            {/* Visual targeting ring */}
            <div className="absolute -inset-2 border border-[#39FF14]/40 rounded-full animate-spin [animation-duration:3s]" />
          </div>
        </motion.div>

        {/* Hazard Decorations from Design */}
        <div className="absolute top-1/4 left-[10%] p-2 border border-[#39FF14]/20 text-[8px] opacity-30 pointer-events-none">NODE_SECTOR_A1</div>
        <div className="absolute bottom-1/4 right-[10%] p-2 border border-[#39FF14]/20 text-[8px] opacity-30 pointer-events-none">DATA_BUFFER_F1</div>

        {/* Start/GameOver Overlay */}
        {!state.isPlaying && (
          <div className="absolute inset-0 bg-[#050505]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center p-8 text-center border-4 border-double border-[#39FF14]">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mb-12"
            >
              <Terminal className="w-16 h-16 text-[#39FF14] mx-auto mb-6" />
              <h2 className="text-5xl font-black text-white italic tracking-tighter mb-4 shadow-[4px_4px_0px_#39FF14]">
                {state.timeLeft === 0 ? "FAILURE_REPORT" : "NEURAL_LINK"}
              </h2>
              {state.timeLeft === 0 && (
                <div className="bg-[#121212] border-2 border-[#39FF14] p-6 mb-8 text-left max-w-sm mx-auto">
                   <div className="text-[10px] text-[#39FF14]/60 uppercase mb-2">Metrics Summary</div>
                   <div className="flex justify-between items-end border-b border-[#39FF14]/20 pb-2 mb-2">
                      <span className="text-xs">POINTS_COLLECTED:</span>
                      <span className="text-2xl font-black">{state.score}</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <span className="text-xs text-[#39FF14]/60 italic font-mono uppercase">Master_Record_v2: {state.highScore}</span>
                   </div>
                </div>
              )}
              <p className="text-[#39FF14] font-bold text-xs uppercase tracking-[0.3em]">
                {state.timeLeft === 0 ? "SYSTEM REBOOT REQUIRED" : "WAITING FOR OPERATOR UPLINK"}
              </p>
            </motion.div>

            <button
              onClick={startGame}
              className="px-12 py-4 bg-[#39FF14] text-black font-black uppercase text-lg hover:bg-white hover:shadow-[0_0_40px_#39FF14] transition-all transform hover:-translate-y-1 active:translate-y-0"
            >
              {state.timeLeft === 0 ? "EXECUTE RECOVERY" : "INITIALIZE SESSION"}
            </button>
            
            <div className="absolute bottom-8 left-8 right-8 flex justify-between text-[10px] opacity-40 font-mono">
               <span>[CMD]: CLICK TO SNACK</span>
               <span>[VERSION]: 2.1.0-STABLE</span>
               <span>[TARGET]: 5tcji5cxk3bjv4qcoh3tch</span>
            </div>
          </div>
        )}
      </div>

      {/* Game Footer Label */}
      <div className="h-8 bg-[#121212] border-t border-[#39FF14] flex items-center px-4 justify-between shrink-0">
        <div className="text-[9px] opacity-40 uppercase tracking-widest flex items-center gap-2">
          <Crosshair className="w-3 h-3" /> Hardware Acceleration: Enabled
        </div>
        <div className="text-[9px] font-bold text-[#39FF14]">
          SESSION_PORT: 3000
        </div>
      </div>
    </div>
  );
}
