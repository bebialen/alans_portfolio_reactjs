import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, ArrowRight, CheckCircle2, Target, Lightbulb } from 'lucide-react';
import { EXPERIENCE_DATA } from '../constants';

const ChapterModal = ({ exp, isOpen, onClose }: { exp: typeof EXPERIENCE_DATA[0], isOpen: boolean, onClose: () => void }) => {
  // Parsing the description into Case Study format (Challenge, Solution, Result)
  const sentences = exp.description.split('. ').filter(s => s.trim().length > 0);
  const challenge = sentences[0] || "Driving innovation in mobile ecosystems.";
  const solution = sentences.slice(1, -1).join('. ') || "Implemented scalable architectures and optimized performance.";
  const result = sentences[sentences.length - 1] || "Achieved significant user growth and technical stability.";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-3xl bg-zinc-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl"
          >
            {/* Modal Header */}
            <div className="p-8 sm:p-12 border-b border-white/5 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/20">
                    Chapter Case Study
                  </span>
                  <span className="text-zinc-500 font-mono text-[10px]">{exp.period}</span>
                </div>
                <h3 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tighter font-display leading-none">
                  {exp.company}
                </h3>
                <p className="text-zinc-400 font-medium mt-2 text-lg">{exp.role}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content - Case Study Format */}
            <div className="p-8 sm:p-12 space-y-10 overflow-y-auto max-h-[60vh] no-scrollbar">
              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <Target className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-red-400 uppercase tracking-widest mb-3">The Challenge</h4>
                  <p className="text-zinc-300 leading-relaxed text-lg">{challenge}.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Lightbulb className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-blue-400 uppercase tracking-widest mb-3">The Solution</h4>
                  <p className="text-zinc-300 leading-relaxed text-lg">{solution}.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-emerald-400 uppercase tracking-widest mb-3">The Result</h4>
                  <p className="text-zinc-300 leading-relaxed text-lg">{result}.</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-black/20 border-t border-white/5 flex items-center justify-between">
               <div className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em]">Verified Chapter Impact</span>
               </div>
               <button 
                 onClick={onClose}
                 className="text-[10px] font-black uppercase tracking-widest text-white hover:text-blue-400 transition-colors flex items-center gap-2"
               >
                 Close Story <ArrowRight className="w-3 h-3" />
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const StorybookTimeline = () => {
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  return (
    <div className="relative py-20">
      {/* Dashed Timeline Line */}
      <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-px border-l-2 border-dashed border-zinc-800 transform -translate-x-1/2" />

      <div className="max-w-5xl mx-auto px-6 relative">
        {EXPERIENCE_DATA.map((exp, idx) => (
          <div key={idx} className={`relative mb-32 last:mb-0 flex flex-col ${idx % 2 === 0 ? 'sm:items-end' : 'sm:items-start'}`}>
            {/* Timeline Dot */}
            <div className="absolute left-[-26px] sm:left-1/2 top-0 transform -translate-x-1/2 z-10">
              <div className="w-4 h-4 rounded-full bg-[#050505] border-2 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>

            {/* Chapter Card */}
            <motion.div
              whileHover={{ y: -5 }}
              onClick={() => setSelectedChapter(idx)}
              className={`w-full sm:w-[45%] cursor-pointer group text-left ${idx % 2 === 0 ? 'sm:text-right' : 'sm:text-left'}`}
            >
              <div className={`mb-4 flex items-center gap-3 ${idx % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">{exp.period}</span>
                <div className="h-px w-8 bg-zinc-800" />
                <BookOpen className="w-3 h-3 text-blue-400" />
              </div>

              <h3 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tighter font-display leading-none group-hover:text-blue-400 transition-colors">
                {exp.role}
              </h3>
              <p className="text-zinc-500 font-black text-[10px] uppercase tracking-[0.4em] mt-3">{exp.company}</p>
              
              <div className={`mt-6 flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-blue-500/50 group-hover:text-blue-400 transition-colors ${idx % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}>
                Read Chapter Case Study <ArrowRight className="w-3 h-3" />
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {selectedChapter !== null && (
        <ChapterModal 
          exp={EXPERIENCE_DATA[selectedChapter]} 
          isOpen={selectedChapter !== null} 
          onClose={() => setSelectedChapter(null)} 
        />
      )}
    </div>
  );
};

export default StorybookTimeline;
