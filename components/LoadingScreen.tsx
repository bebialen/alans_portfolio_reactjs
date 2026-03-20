import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreen: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            if (onComplete) onComplete();
          }, 500);
          return 100;
        }
        const diff = Math.random() * 15;
        return Math.min(oldProgress + diff, 100);
      });
    }, 150);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[999] bg-[#050505] flex flex-col items-center justify-center p-6"
        >
          {/* Minimalist Logo/Brand */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12"
          >
            <div className="text-4xl font-black tracking-tighter uppercase font-display text-white">
              ALAN <span className="text-blue-500">DEV.</span>
            </div>
          </motion.div>

          {/* Progress Container */}
          <div className="w-full max-w-[240px] h-[2px] bg-white/5 rounded-full overflow-hidden relative">
            {/* Glow Effect */}
            <motion.div 
              className="absolute inset-0 bg-blue-500/20 blur-sm"
              style={{ width: `${progress}%` }}
            />
            {/* Actual Progress Bar */}
            <motion.div
              className="h-full bg-blue-500 relative z-10"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
          </div>

          {/* Status Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            className="mt-6 flex items-center gap-3"
          >
            <span className="text-[10px] font-mono text-white uppercase tracking-[0.3em]">
              Initializing Systems
            </span>
            <span className="text-[10px] font-mono text-blue-500 w-8">
              {Math.round(progress)}%
            </span>
          </motion.div>

          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
