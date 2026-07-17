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
    
    const data: (HeatmapData | null)[] = [];
    const today = new Date();
    
    // Get the current date in UTC, set to midnight UTC
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    
    // Calculate oldest date (1st of the current month of this year)
    const oldestDate = new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), 1));
    
    // Day of week for oldest date (0 = Sunday, 1 = Monday, etc.)
    const oldestDayOfWeek = oldestDate.getUTCDay();
    
    // Pad the beginning to start on Sunday
    for (let i = 0; i < oldestDayOfWeek; i++) {
      data.push(null);
    }
    
    // Create a map of YYYY-MM-DD -> count using UTC date strings
    const submissionMap: Record<string, number> = {};
    Object.entries(stats.submissionCalendar).forEach(([timestampStr, count]) => {
      const timestamp = parseInt(timestampStr, 10);
      if (!isNaN(timestamp)) {
        const date = new Date(timestamp * 1000);
        const dateString = date.toISOString().split('T')[0];
        submissionMap[dateString] = (submissionMap[dateString] || 0) + count;
      }
    });

    const timeDiff = todayUTC.getTime() - oldestDate.getTime();
    const totalDays = Math.round(timeDiff / (1000 * 60 * 60 * 24));

    for (let i = totalDays; i >= 0; i--) {
      const date = new Date(todayUTC);
      date.setUTCDate(todayUTC.getUTCDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const count = submissionMap[dateString] || 0;
      
      data.push({
        date: dateString,
        count
      });
    }
    
    // Pad the end to end on Saturday
    const todayDayOfWeek = todayUTC.getUTCDay();
    const padEnd = 6 - todayDayOfWeek;
    for (let i = 0; i < padEnd; i++) {
      data.push(null);
    }
    
    return data;
  }, [stats]);

  const monthLabels = useMemo(() => {
    if (heatmapData.length === 0) return [];
    
    // Find the oldest date of the calendar (the Sunday of the first week)
    const today = new Date();
    const todayUTC = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
    const oldestDate = new Date(Date.UTC(todayUTC.getUTCFullYear(), todayUTC.getUTCMonth(), 1));
    const oldestDayOfWeek = oldestDate.getUTCDay();
    const startSunday = new Date(oldestDate);
    startSunday.setUTCDate(oldestDate.getUTCDate() - oldestDayOfWeek);
    
    const labels: { colIndex: number; label: string }[] = [];
    let lastMonth = '';
    
    // Total weeks is heatmapData.length / 7. Let's iterate over each week/column.
    const totalWeeks = Math.ceil(heatmapData.length / 7);
    for (let col = 0; col < totalWeeks; col++) {
      // Find the date of the Wednesday in this week to determine the month
      const middleOfWeek = new Date(startSunday);
      middleOfWeek.setUTCDate(startSunday.getUTCDate() + col * 7 + 3);
      const month = middleOfWeek.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
      
      if (month !== lastMonth) {
        labels.push({ colIndex: col, label: month });
        lastMonth = month;
      }
    }
    
    return labels;
  }, [heatmapData]);

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

  const totalWeeks = Math.ceil(heatmapData.length / 7);

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

            {/* Heatmap Grid & Weekdays */}
            <div className="flex gap-2 select-none">
              {/* Day Labels on the Left */}
              <div className="grid grid-rows-7 gap-1.5 text-[8px] font-black text-zinc-600 uppercase pt-[1.5px] pr-1 select-none">
                <div className="h-3 sm:h-3.5" />
                <div className="flex items-center h-3 sm:h-3.5">Mon</div>
                <div className="h-3 sm:h-3.5" />
                <div className="flex items-center h-3 sm:h-3.5">Wed</div>
                <div className="h-3 sm:h-3.5" />
                <div className="flex items-center h-3 sm:h-3.5">Fri</div>
                <div className="h-3 sm:h-3.5" />
              </div>

              {/* Heatmap & Month Labels */}
              <div className="flex-1 overflow-x-auto no-scrollbar">
                <div className="w-fit">
                  {/* Month Labels at the top (Mobile) */}
                  <div 
                    className="grid gap-1.5 text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 sm:hidden w-fit"
                    style={{ 
                      gridTemplateColumns: `repeat(${totalWeeks}, 12px)`,
                    }}
                  >
                    {monthLabels.map((ml, idx) => (
                      <div
                        key={idx}
                        className="w-0 overflow-visible whitespace-nowrap"
                        style={{ gridColumnStart: ml.colIndex + 1 }}
                      >
                        {ml.label}
                      </div>
                    ))}
                  </div>

                  {/* Month Labels at the top (Desktop) */}
                  <div 
                    className="hidden sm:grid gap-1.5 text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 w-fit"
                    style={{ 
                      gridTemplateColumns: `repeat(${totalWeeks}, 14px)`,
                    }}
                  >
                    {monthLabels.map((ml, idx) => (
                      <div
                        key={idx}
                        className="w-0 overflow-visible whitespace-nowrap"
                        style={{ gridColumnStart: ml.colIndex + 1 }}
                      >
                        {ml.label}
                      </div>
                    ))}
                  </div>

                  {/* Heatmap Grid */}
                  <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-fit">
                    {heatmapData.map((day, i) => {
                      if (!day) {
                        return (
                          <div key={`empty-${i}`} className="w-3 h-3 sm:w-3.5 sm:h-3.5 bg-transparent" />
                        );
                      }
                      return (
                        <motion.div
                          key={day.date}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.0005 }}
                          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-sm ${getColor(day.count)} transition-colors hover:ring-2 hover:ring-white/20 relative group`}
                        >
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-white text-[8px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-white/10 shadow-xl">
                            {day.count} submissions on {day.date}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeetCodeHeatmap;
