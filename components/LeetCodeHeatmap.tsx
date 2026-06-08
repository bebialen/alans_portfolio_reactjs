import React, { useMemo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Target, Code2, Loader2 } from 'lucide-react';
import { fetchLeetCodeStats, LeetCodeStats } from '../services/leetcodeService';

interface HeatmapData {
  date: string;
  count: number;
}

const LeetCodeHeatmap: React.FC = () => {
  const [stats, setStats] = useState<LeetCodeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const username = "alan444"; // Defaulting to the name found in resume

  useEffect(() => {
    const getStats = async () => {
      setLoading(true);
      const data = await fetchLeetCodeStats(username);
      if (data) {
        setStats(data);
      }
      setLoading(false);
    };
    getStats();
  }, [username]);

  // Convert LeetCode calendar data to our heatmap format
  const heatmapData = useMemo(() => {
    if (!stats) return [];
    
    const data: HeatmapData[] = [];
    const today = new Date();
    
    // Create a map for quick lookup
    const submissionMap = stats.submissionCalendar;

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // LeetCode timestamps are in seconds, so we need to match carefully
      // or convert our date to a start-of-day timestamp
      const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 1000;
      
      // LeetCode's calendar might not align perfectly with start-of-day
      // It's safer to check a range or find the nearest timestamp
      // But usually, they are floored to the day.
      const count = submissionMap[Math.floor(startOfDay).toString()] || 0;
      
      data.push({
        date: dateString,
        count
      });
    }
    return data;
  }, [stats]);

  const displayStats = useMemo(() => {
    if (!stats) return [
      { label: 'Total Solved', value: '---', icon: <Trophy className="w-4 h-4 text-yellow-500" /> },
      { label: 'Ranking', value: '---', icon: <Flame className="w-4 h-4 text-orange-500" /> },
      { label: 'Reputation', value: '---', icon: <Target className="w-4 h-4 text-blue-500" /> },
      { label: 'Contrib. Points', value: '---', icon: <Code2 className="w-4 h-4 text-purple-500" /> },
    ];

    return [
      { label: 'Total Solved', value: stats.totalSolved.toString(), icon: <Trophy className="w-4 h-4 text-yellow-500" /> },
      { label: 'Ranking', value: stats.ranking > 100000 ? `${(stats.ranking / 1000).toFixed(1)}k` : stats.ranking.toString(), icon: <Flame className="w-4 h-4 text-orange-500" /> },
      { label: 'Reputation', value: stats.reputation.toString(), icon: <Target className="w-4 h-4 text-blue-500" /> },
      { label: 'Contrib. Points', value: stats.contributionPoints.toString(), icon: <Code2 className="w-4 h-4 text-purple-500" /> },
    ];
  }, [stats]);

  const getColor = (count: number) => {
    if (count === 0) return 'bg-zinc-900/50';
    if (count <= 2) return 'bg-blue-900/40';
    if (count <= 5) return 'bg-blue-700/60';
    if (count <= 10) return 'bg-blue-500/80 shadow-[0_0_8px_rgba(59,130,246,0.3)]';
    return 'bg-blue-400 shadow-[0_0_12px_rgba(96,165,250,0.5)]';
  };

  if (loading) {
    return (
      <div className="w-full h-64 bg-zinc-900/40 rounded-[2.5rem] border border-white/5 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-900/40 rounded-[2.5rem] border border-white/5 p-8 sm:p-12 overflow-hidden shadow-2xl backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left: Stats & Info */}
        <div className="w-full lg:w-1/3">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-orange-500/20 mb-4">
              LeetCode Activity
            </div>
            <h3 className="text-3xl font-black text-white mb-4 tracking-tight font-display uppercase">PROBLEM SOLVING</h3>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
              Consistently sharpening algorithmic thinking and technical proficiency through daily challenges and competitive programming.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {displayStats.map((stat, i) => (
              <div key={i} className="bg-zinc-800/30 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  {stat.icon}
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{stat.label}</span>
                </div>
                <div className="text-xl font-black text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Heatmap */}
        <div className="w-full lg:w-2/3">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-2">
              <span>Activity Calendar</span>
              <div className="flex items-center gap-2">
                <span>Less</span>
                <div className="flex gap-1">
                  {[0, 2, 5, 10, 15].map((v) => (
                    <div key={v} className={`w-3 h-3 rounded-sm ${getColor(v)}`} />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[700px]">
                {heatmapData.map((day, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.0005 }}
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm ${getColor(day.count)} transition-colors hover:ring-2 hover:ring-white/20 relative group`}
                  >
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-white text-[8px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-white/10">
                      {day.count} submissions on {day.date}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="mt-4 flex justify-between text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeHeatmap;
