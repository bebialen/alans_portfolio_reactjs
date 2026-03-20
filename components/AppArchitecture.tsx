import { motion } from 'framer-motion';
import { Code2, Cpu, Globe, Layout } from 'lucide-react';

const AppArchitecture = () => {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      {/* Central Phone Glow */}
      <div className="absolute w-64 h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />

      {/* Floating UI Layers */}
      <div className="relative w-full h-full">
        {/* Layer 1: The Logic (Code) */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 right-10 p-4 bg-zinc-900/80 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl z-30"
        >
          <Code2 className="text-blue-400 w-6 h-6 mb-2" />
          <div className="space-y-1">
            <div className="w-12 h-1 bg-zinc-700 rounded" />
            <div className="w-20 h-1 bg-zinc-700 rounded" />
          </div>
        </motion.div>

        {/* Layer 2: The Interface (Glass Card) */}
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-40 right-32 w-48 h-64 bg-white/5 border border-white/20 backdrop-blur-md rounded-[2rem] shadow-2xl z-20 flex flex-col p-6"
        >
          <Layout className="text-white/20 w-8 h-8 self-end" />
          <div className="mt-auto space-y-3">
            <div className="w-full h-8 bg-blue-500/20 rounded-xl" />
            <div className="w-2/3 h-8 bg-white/10 rounded-xl" />
          </div>
        </motion.div>

        {/* Layer 3: Performance (The Core) */}
        <motion.div 
          animate={{ x: [0, 15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-20 p-5 bg-blue-600/10 border border-blue-500/20 backdrop-blur-sm rounded-3xl z-10"
        >
          <Cpu className="text-blue-500 w-10 h-10 animate-pulse" />
        </motion.div>
      </div>
    </div>
  );
};

export default AppArchitecture;