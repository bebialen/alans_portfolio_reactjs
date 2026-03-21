import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { EXPERIENCE_DATA } from '../constants';

const CommitNode = ({ exp, index, isLast }: { exp: typeof EXPERIENCE_DATA[0], index: number, isLast: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isCurrent = index === 0;

  // Split description by sentences for the "git log" prompt effect
  const achievements = exp.description.split('. ').filter(s => s.trim().length > 0);

  return (
    <div className="relative pl-12 sm:pl-32 pb-24 last:pb-0">
      {/* Commit Node (Circle) */}
      <div className="absolute left-[-9px] sm:left-[calc(50%-9px)] top-0 z-20">
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ scale: 1.2 }}
          className={`w-[18px] h-[18px] rounded-full border-4 bg-[#050505] relative transition-colors duration-500
            ${isCurrent ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-zinc-700 hover:border-emerald-400'}
          `}
        >
          {isCurrent && (
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-[-4px] rounded-full bg-emerald-500/30"
            />
          )}
        </motion.button>
      </div>

      {/* Commit Info (Idle State) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className={`flex flex-col cursor-pointer group w-full ${index % 2 === 0 ? 'sm:items-start sm:text-left sm:pr-[50%]' : 'sm:items-end sm:text-right sm:pl-[50%]'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3 mb-2 font-mono text-[10px] tracking-tight">
          <span className="text-emerald-500 opacity-60">feat: {exp.role.toLowerCase().replace(/ /g, '-')}</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-500">{exp.period}</span>
        </div>
        
        <h4 className="text-2xl font-black text-white uppercase tracking-tighter font-display group-hover:text-emerald-400 transition-colors">
          {exp.company}
        </h4>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1">
          {exp.role}
        </p>

        {/* Terminal Box (Expanded State) */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden w-full max-w-xl"
            >
              <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-xl p-6 font-mono shadow-2xl">
                <div className="flex items-center gap-1.5 mb-4 border-b border-white/5 pb-3">
                  <div className="w-2 h-2 rounded-full bg-zinc-700" />
                  <div className="w-2 h-2 rounded-full bg-zinc-700" />
                  <div className="w-2 h-2 rounded-full bg-zinc-700" />
                  <span className="ml-2 text-[9px] text-zinc-500 uppercase tracking-widest">git log --stat</span>
                </div>
                
                <div className="space-y-3">
                  {achievements.map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-3 text-xs leading-relaxed"
                    >
                      <span className="text-emerald-500 shrink-0 font-bold">{'>'}</span>
                      <span className="text-zinc-400">{item.trim()}{!item.endsWith('.') && '.'}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-2 text-[9px] text-emerald-500/40">
                  <div className="w-1.5 h-3 bg-emerald-500/40 animate-pulse" />
                  <span>END OF LOG</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export const CareerBranch = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={containerRef} className="relative py-20 px-4 sm:px-0">
      {/* The Main Branch Line */}
      <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-zinc-800/30 transform -translate-x-1/2">
        <svg className="w-full h-full absolute top-0 overflow-visible">
          <motion.line
            x1="50%"
            y1="0"
            x2="50%"
            y2="100%"
            stroke="#10b981"
            strokeWidth="2"
            style={{ pathLength }}
            className="hidden sm:block"
          />
          {/* Mobile version line */}
          <motion.line
            x1="16"
            y1="0"
            x2="16"
            y2="100%"
            stroke="#10b981"
            strokeWidth="2"
            style={{ pathLength }}
            className="sm:hidden"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto">
        {EXPERIENCE_DATA.map((exp, i) => (
          <CommitNode 
            key={i} 
            exp={exp} 
            index={i} 
            isLast={i === EXPERIENCE_DATA.length - 1} 
          />
        ))}
      </div>
    </div>
  );
};

export default CareerBranch;
