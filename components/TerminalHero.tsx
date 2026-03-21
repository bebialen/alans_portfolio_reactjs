import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TerminalLine {
  text: string;
  color?: string;
  delay?: number;
  isCommand?: boolean;
}

interface TerminalHeroProps {
  lines?: TerminalLine[];
  typingSpeed?: number;
}

const DEFAULT_LINES: TerminalLine[] = [
  { text: "npm install @alan/core", color: "text-blue-400", isCommand: true },
  { text: "✔ Success: dependencies resolved in 420ms", color: "text-emerald-400" },
  { text: "alan --version", color: "text-blue-400", isCommand: true },
  { text: "v2.0.26 - 'Sleek & Scalable'", color: "text-zinc-500" },
  { text: "alan init portfolio --template elite", color: "text-blue-400", isCommand: true },
  { text: "🚀 Booting production ecosystem...", color: "text-purple-400" },
];

export const TerminalHero: React.FC<TerminalHeroProps> = ({ 
  lines = DEFAULT_LINES, 
  typingSpeed = 40 
}) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [currentText, setCurrentText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (visibleLines >= lines.length) {
      setIsTyping(false);
      return;
    }

    const line = lines[visibleLines];
    if (!line.isCommand) {
      const timeout = setTimeout(() => {
        setVisibleLines(prev => prev + 1);
      }, 600);
      return () => clearTimeout(timeout);
    }

    // Typing effect for commands
    let i = 0;
    const interval = setInterval(() => {
      setCurrentText(line.text.slice(0, i + 1));
      i++;
      if (i >= line.text.length) {
        clearInterval(interval);
        setTimeout(() => {
          setVisibleLines(prev => prev + 1);
          setCurrentText("");
        }, 500);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [visibleLines, lines, typingSpeed]);

  return (
    <div className="relative w-full max-w-2xl mx-auto group perspective-1000">
      {/* 1. Glassmorphic Backdrop (The "Landing Pad") */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute inset-0 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] transform -rotate-2 scale-105"
      />

      {/* 2. Secondary Underlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

      {/* 3. Foreground Terminal Window (Obsidian/Midnight) */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 5 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        whileHover={{ y: -10, rotateX: -2, rotateY: 2 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.8 
        }}
        className="relative overflow-hidden bg-zinc-950/90 backdrop-blur-md border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col h-[340px] z-10"
      >
        {/* macOS Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-zinc-900/50 border-b border-white/5">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]" />
          </div>
          <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] font-bold">alan — zsh</div>
          <div className="w-12" /> {/* Spacer */}
        </div>

        {/* Terminal Content */}
        <div className="p-8 font-mono text-sm sm:text-base overflow-y-auto no-scrollbar flex-1">
          <div className="space-y-3">
            {lines.slice(0, visibleLines).map((line, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`${line.color || 'text-zinc-300'} flex gap-3`}
              >
                {line.isCommand && <span className="text-blue-500 font-bold">~</span>}
                <span className="leading-relaxed">{line.text}</span>
              </motion.div>
            ))}
            
            {/* Current Typing Line */}
            {visibleLines < lines.length && lines[visibleLines].isCommand && (
              <div className="flex gap-3 text-zinc-300">
                <span className="text-blue-500 font-bold">~</span>
                <span className="leading-relaxed">{currentText}</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-2 h-5 bg-blue-500/80 mt-0.5"
                />
              </div>
            )}

            {/* Final Active Cursor */}
            {!isTyping && (
              <div className="flex gap-3 text-zinc-300">
                <span className="text-blue-500 font-bold">~</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-2 h-5 bg-zinc-500/50 mt-0.5"
                />
              </div>
            )}
          </div>
        </div>

        {/* Subtle Bottom Glow */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
      </motion.div>

      {/* Floating Elements for extra depth */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-6 -right-6 w-12 h-12 bg-blue-500/20 rounded-xl blur-xl"
      />
      <motion.div
        animate={{ 
          y: [0, 10, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -bottom-6 -left-6 w-16 h-16 bg-purple-500/20 rounded-full blur-xl"
      />
    </div>
  );
};

export default TerminalHero;
