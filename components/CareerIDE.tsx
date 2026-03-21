import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronDown, FileCode, Folder, FolderOpen, Terminal } from 'lucide-react';
import { EXPERIENCE_DATA } from '../constants';

const CareerIDE = () => {
  const [activeFileId, setActiveFileId] = useState(0);
  const [expandedFolders, setExpandedFolders] = useState<string[]>(['history']);

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => 
      prev.includes(folder) ? prev.filter(f => f !== folder) : [...prev, folder]
    );
  };

  const activeJob = EXPERIENCE_DATA[activeFileId];

  // Helper to highlight tech keywords in the description
  const highlightTech = (text: string) => {
    const techKeywords = ['Flutter', 'React', 'Node.js', 'Kotlin', 'Firebase', 'AWS', 'Swift', 'TypeScript', 'Docker', 'GraphQL'];
    let highlighted = text;
    
    // Split by achievements (sentences starting with TODO or bullet points)
    const sentences = text.split('. ').filter(s => s.trim().length > 0);
    
    return (
      <div className="space-y-4 font-mono text-sm leading-relaxed">
        <div className="text-zinc-500 italic">/**
 * @description {activeJob.role} at {activeJob.company}
 * @period {activeJob.period}
 */</div>

        <div>
          <span className="text-purple-400">const</span> <span className="text-blue-400">responsibilities</span> = {'['}
          <div className="pl-6 border-l border-zinc-800 ml-2 mt-2 space-y-2">
            {sentences.map((s, i) => (
              <div key={i}>
                <span className="text-zinc-500">// TODO: </span>
                <span className="text-emerald-400">"{s.trim()}{!s.endsWith('.') && '.'}"</span>{i < sentences.length - 1 ? ',' : ''}
              </div>
            ))}
          </div>
          <span className="mt-2 block">{' ]'}</span>
        </div>

        <div className="mt-6">
          <span className="text-purple-400">export function</span> <span className="text-yellow-400">getStack</span>() {'{'}
          <div className="pl-6 border-l border-zinc-800 ml-2 mt-2">
            <span className="text-purple-400">return</span> <span className="text-blue-400">stack</span>.filter(tech ={'>'} tech.impact === <span className="text-orange-300">'maximum'</span>);
          </div>
          <span className="mt-2 block">{'}'}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto h-[600px] bg-[#0d1117]/80 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden flex shadow-2xl">
      {/* Sidebar / File Tree */}
      <div className="w-64 border-right border-white/5 bg-[#0d1117]/50 flex flex-col shrink-0">
        <div className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5">Explorer</div>
        
        <div className="flex-1 overflow-y-auto py-2 px-2 no-scrollbar">
          {/* Main Career Folder */}
          <div 
            className="flex items-center gap-2 py-1.5 px-2 hover:bg-white/5 rounded-md cursor-pointer text-zinc-400 transition-colors"
            onClick={() => toggleFolder('history')}
          >
            {expandedFolders.includes('history') ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            {expandedFolders.includes('history') ? <FolderOpen className="w-4 h-4 text-blue-400" /> : <Folder className="w-4 h-4 text-blue-400" />}
            <span className="text-xs font-medium">career_history</span>
          </div>

          <AnimatePresence>
            {expandedFolders.includes('history') && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="pl-4 space-y-1 mt-1"
              >
                {EXPERIENCE_DATA.map((exp, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 py-1.5 px-3 rounded-md cursor-pointer transition-all
                      ${activeFileId === idx ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'}
                    `}
                    onClick={() => setActiveFileId(idx)}
                  >
                    <FileCode className={`w-4 h-4 ${activeFileId === idx ? 'text-blue-400' : 'text-zinc-500'}`} />
                    <span className="text-[11px] font-mono truncate">{exp.company.toLowerCase().replace(/ /g, '_')}.ts</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-4 bg-black/20 mt-auto border-t border-white/5">
            <div className="flex items-center gap-2 text-zinc-600">
                <Terminal className="w-3 h-3" />
                <span className="text-[10px] font-mono tracking-tighter">branch: main*</span>
            </div>
        </div>
      </div>

      {/* Main Editor Panel */}
      <div className="flex-1 flex flex-col bg-black/20 relative">
        {/* Tabs Bar */}
        <div className="flex bg-[#0d1117]/80 border-b border-white/5">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#0d1117] border-t-2 border-blue-500 text-blue-400 text-xs font-mono border-r border-white/5">
            <FileCode className="w-3.5 h-3.5" />
            {activeJob.company.toLowerCase().replace(/ /g, '_')}.ts
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar relative">
          <div className="absolute top-8 left-4 text-zinc-800 font-mono text-xs select-none pointer-events-none hidden sm:block">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          
          <motion.div
            key={activeFileId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:pl-8"
          >
            {highlightTech(activeJob.description)}
          </motion.div>
        </div>

        {/* Status Bar */}
        <div className="h-6 bg-blue-600 flex items-center justify-between px-3 text-[10px] text-white font-medium select-none">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 hover:bg-white/10 px-2 h-full cursor-pointer">
              <span className="font-bold tracking-tighter">-- NORMAL --</span>
            </div>
            <span className="opacity-80">TypeScript</span>
          </div>
          <div className="flex items-center gap-4 opacity-80 uppercase tracking-widest text-[9px]">
            <span>Ln {activeFileId + 12}, Col 42</span>
            <span>UTF-8</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerIDE;
