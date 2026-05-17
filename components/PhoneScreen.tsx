
import React, { useState, useEffect, useRef } from 'react';
import { AppType } from '../types';
import { APPS, PROJECTS_DATA, SKILLS_DATA, EXPERIENCE_DATA, ACHIEVEMENTS_DATA } from '../constants';
import { Home, ArrowLeft, Send, Sparkles, Loader2, MessageSquare, Play, RefreshCw, Trophy, Gamepad2, Lock, Unlock, Zap, Star, Mail, Linkedin, Github } from 'lucide-react';
import { askGeminiAboutDev } from '../services/geminiService';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LineChart, Line } from 'recharts';

interface PhoneScreenProps {
  activeSection?: string;
}

const IRunner: React.FC<{ onGameOver: (score: number) => void }> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('irunner-high') || '0'));
  
  const gameRef = useRef({
    player: { x: 150, y: 600, w: 40, h: 40 },
    obstacles: [] as { x: number, y: number, w: number, h: number, speed: number }[],
    frame: 0,
    gameOver: false
  });

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const update = () => {
      if (gameRef.current.gameOver) return;

      gameRef.current.frame++;
      
      // Add obstacles
      if (gameRef.current.frame % 60 === 0) {
        gameRef.current.obstacles.push({
          x: Math.random() * (canvas.width - 40),
          y: -50,
          w: 40,
          h: 40,
          speed: 4 + (score / 5)
        });
      }

      // Move obstacles
      gameRef.current.obstacles = gameRef.current.obstacles.filter(obs => {
        obs.y += obs.speed;
        
        // Collision
        if (
          gameRef.current.player.x < obs.x + obs.w &&
          gameRef.current.player.x + gameRef.current.player.w > obs.x &&
          gameRef.current.player.y < obs.y + obs.h &&
          gameRef.current.player.y + gameRef.current.player.h > obs.y
        ) {
          gameRef.current.gameOver = true;
          setIsPlaying(false);
          onGameOver(score);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('irunner-high', score.toString());
          }
        }

        if (obs.y > canvas.height) {
          setScore(s => s + 1);
          return false;
        }
        return true;
      });

      // Draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Grid effect
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      // Player
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.roundRect(gameRef.current.player.x, gameRef.current.player.y, gameRef.current.player.w, gameRef.current.player.h, 10);
      ctx.fill();

      // Obstacles
      ctx.fillStyle = '#ef4444';
      gameRef.current.obstacles.forEach(obs => {
        ctx.beginPath();
        ctx.roundRect(obs.x, obs.y, obs.w, obs.h, 8);
        ctx.fill();
      });

      animationId = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animationId);
  }, [isPlaying, score, highScore, onGameOver]);

  const handleTouch = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isPlaying) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const relativeX = x - rect.left;
    gameRef.current.player.x = Math.max(0, Math.min(canvas.width - 40, relativeX - 20));
  };

  const start = () => {
    gameRef.current = {
      player: { x: 150, y: 600, w: 40, h: 40 },
      obstacles: [],
      frame: 0,
      gameOver: false
    };
    setScore(0);
    setIsPlaying(true);
  };

  return (
    <div className="h-full bg-black flex flex-col items-center pt-20">
      <div className="flex justify-between w-full px-8 mb-4">
        <div className="text-white">
          <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">Live Score</p>
          <p className="text-3xl font-black font-display tracking-tighter">{score}</p>
        </div>
        <div className="text-right text-white">
          <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.2em]">Personal Best</p>
          <p className="text-3xl font-black font-display text-yellow-500 tracking-tighter">{highScore}</p>
        </div>
      </div>

      <div className="relative w-[280px] h-[480px] border border-white/10 rounded-[2.5rem] overflow-hidden bg-zinc-950">
        <canvas
          ref={canvasRef}
          width={300}
          height={500}
          onTouchMove={handleTouch}
          onMouseMove={handleTouch}
          className="w-full h-full"
        />
        
        {!isPlaying && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-8 text-center">
            {gameRef.current.gameOver ? (
              <>
                <Trophy className="w-12 h-12 text-yellow-500 mb-6" />
                <h3 className="text-3xl font-black text-white mb-2 font-display uppercase tracking-tight">Game Over</h3>
                <p className="text-zinc-500 text-xs mb-8 uppercase tracking-widest font-black">Final Score: {score}</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-blue-500 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/30 ring-1 ring-white/20">
                   <Gamepad2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-4xl font-black text-white mb-2 font-display uppercase tracking-tighter">iRUNNER</h3>
                <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-10">Dodge obstacles & evolve</p>
              </>
            )}
            <button
              onClick={start}
              className="w-full bg-white text-black font-black text-[10px] tracking-widest py-5 rounded-full flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl uppercase"
            >
              {gameRef.current.gameOver ? <RefreshCw className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              {gameRef.current.gameOver ? 'Retry Entry' : 'Start Simulation'}
            </button>
          </div>
        )}
      </div>
      <p className="mt-8 text-zinc-800 text-[9px] font-black tracking-[0.4em] uppercase">Tactile Slide Control</p>
    </div>
  );
};

const PhoneScreen: React.FC<PhoneScreenProps> = ({ activeSection = 'locked' }) => {
  const [activeApp, setActiveApp] = useState<AppType>(AppType.LOCKED);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [time, setTime] = useState(new Date());
  const [aiInput, setAiInput] = useState('');
  const [aiChat, setAiChat] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeApp !== AppType.PROJECTS) {
      setSelectedProject(null);
    }
  }, [activeApp]);

  // Synchronize Phone app with desktop scroll position
  useEffect(() => {
    if (activeSection === 'locked') {
      setActiveApp(AppType.LOCKED);
    } else if (activeSection === 'home') {
      if (activeApp === AppType.LOCKED && !isUnlocking) {
        setIsUnlocking(true);
        const timer = setTimeout(() => {
          setIsUnlocking(false);
          setActiveApp(AppType.HOME);
        }, 800);
        return () => clearTimeout(timer);
      } else if (!isUnlocking) {
        setActiveApp(AppType.HOME);
      }
    } else if (activeSection === 'projects') {
      setActiveApp(AppType.PROJECTS);
    } else if (activeSection === 'experience') {
      setActiveApp(AppType.ABOUT);
    } else if (activeSection === 'achievements') {
      setActiveApp(AppType.SKILLS);
    }
  }, [activeSection, activeApp, isUnlocking]);

  const handleAiSend = async () => {
    if (!aiInput.trim()) return;
    const userMsg = aiInput;
    setAiInput('');
    setAiChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsAiTyping(true);
    
    const response = await askGeminiAboutDev(userMsg);
    setAiChat(prev => [...prev, { role: 'bot', text: response || "System overload. Please retry." }]);
    setIsAiTyping(false);
  };

  const renderLocked = () => (
    <div className="relative h-full w-full bg-gradient-to-br from-[#1a1a1a] via-black to-[#0a1a2e] flex flex-col items-center pt-32 p-8 text-white overflow-hidden transition-all duration-700">
      {/* Background Abstract */}
      <div className="absolute -top-21 -left-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-purple-500/10 blur-[120px] rounded-full"></div>
      
      <div className="flex flex-col items-center  mb-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-4">
          <Lock className={`w-3 h-3 transition-all duration-300 ${isUnlocking ? 'text-blue-400 scale-150 opacity-0' : 'text-white/40 opacity-100'}`} />
          {isUnlocking && <Unlock className="w-3 h-3 pt-1 text-blue-400 absolute inset-0 mx-auto animate-pulse" />}
        </div>
        <p className="text-[12px] font-black uppercase tracking-[0.3em] text-white/50 mb-4">Monday, Oct 24</p>
        <h1 className="text-8xl font-black font-display tracking-tighter leading-none">
          {time.getHours()}<br/>{time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes()}
        </h1>
      </div>

      {isUnlocking ? (
        <div className="mb-24 flex flex-col items-center gap-4 animate-pulse">
          <div className="w-8 h-8 rounded-full border-2 border-blue-400 border-t-transparent animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Verifying Identity...</p>
        </div>
      ) : (
        <div className="mb-24 flex flex-col items-center gap-4">
          <div className="w-16 h-1 bg-white/20 rounded-full mb-4"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 animate-pulse">Scroll down to explore</p>
        </div>
      )}

      {/* Dynamic Island Prompt */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full border border-white/5 flex items-center justify-center px-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-[4px] font-black uppercase tracking-widest text-white/40">Neural Sensor Active</span>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="p-10 h-full flex flex-col bg-[#050505] animate-in zoom-in-95 duration-500">
      <div className="mt-14 mb-12">
        <h1 className="text-5xl font-black text-white mb-1 font-display tracking-tighter uppercase">Home</h1>
        <p className="text-blue-400 text-[10px] font-black tracking-[0.3em] uppercase">ALEXOS v4.0.1</p>
      </div>
      <div className="grid grid-cols-4 gap-y-10 gap-x-6">
        {APPS.map((app) => (
          <button
            key={app.id}
            onClick={() => setActiveApp(app.id)}
            className="flex flex-col items-center gap-3 group"
          >
            <div className={`${app.color} w-16 h-16 rounded-[1.8rem] flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-active:scale-90 ring-1 ring-white/10`}>
              {app.icon}
            </div>
            <span className="text-[9px] text-zinc-500 font-black tracking-tight uppercase">{app.name}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-auto mb-10 bg-zinc-900/60 backdrop-blur-2xl rounded-[3rem] p-4 flex justify-around items-center border border-white/5 shadow-inner">
        <div className="w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center shadow-2xl transition-transform active:scale-90" onClick={() => setActiveApp(AppType.HOME)}><Home className="w-7 h-7 text-white" /></div>
        <div className="w-14 h-14 rounded-full bg-zinc-800/50 flex items-center justify-center transition-transform active:scale-90" onClick={() => setActiveApp(AppType.GEMINI)}><MessageSquare className="w-7 h-7 text-zinc-500" /></div>
        <div className="w-14 h-14 rounded-full bg-zinc-800/50 flex items-center justify-center"><div className="w-7 h-7 rounded-full bg-blue-400/10 border border-blue-400/20"></div></div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div className="h-full bg-zinc-950 text-white p-8 overflow-y-auto no-scrollbar pt-20 animate-in slide-in-from-right duration-500">
      <button onClick={() => setActiveApp(AppType.HOME)} className="mb-8 flex items-center text-zinc-600 font-black text-[10px] tracking-widest uppercase">
        <ArrowLeft className="w-4 h-4 mr-2" /> EXIT
      </button>
      <div className="relative mb-12">
        <h2 className="text-5xl font-black tracking-tighter uppercase font-display leading-none mb-2">RESUME</h2>
        <p className="text-purple-500 font-black text-[10px] tracking-[0.4em] uppercase">Experience Graph</p>
      </div>
      
      <div className="space-y-10">
        <div className="relative">
          <div className="absolute left-4 top-2 bottom-0 w-px bg-zinc-800"></div>
          <div className="space-y-12">
            {EXPERIENCE_DATA.map((exp, i) => (
              <div key={i} className="relative pl-12">
                <div className="absolute left-3 top-1 w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
                <h4 className="text-xs font-black text-white uppercase tracking-tight">{exp.role}</h4>
                <p className="text-[9px] text-zinc-600 font-black tracking-widest uppercase mb-2">{exp.company}</p>
                <p className="text-zinc-500 text-[10px] leading-relaxed line-clamp-2">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjectDetail = () => {
    if (!selectedProject) return null;
    return (
      <div className="h-full bg-zinc-950 text-white p-8 overflow-y-auto no-scrollbar pt-20 animate-in slide-in-from-right duration-500">
        <button onClick={() => setSelectedProject(null)} className="mb-8 flex items-center text-zinc-600 font-black text-[10px] tracking-widest uppercase">
          <ArrowLeft className="w-4 h-4 mr-2" /> BACK TO WORKS
        </button>
        
        <div className="relative h-64 -mx-8 -mt-20 mb-10">
          <img src={selectedProject.image} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
          <div className="absolute bottom-10 left-8 right-8">
            <h2 className="text-4xl font-black tracking-tighter uppercase font-display leading-none mb-4">{selectedProject.title}</h2>
            <div className="flex flex-wrap gap-2">
              {selectedProject.tech.map(t => (
                <span key={t} className="text-[8px] bg-white/10 backdrop-blur-md border border-white/10 text-white px-3 py-1 rounded-full font-black uppercase tracking-wider">{t}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8 pb-20">
          {selectedProject.caseStudy?.split('###').filter(Boolean).map((section, i) => {
            const lines = section.trim().split('\n');
            const title = lines[0];
            const content = lines.slice(1);
            return (
              <div key={i} className="space-y-4">
                <h3 className="text-xl font-black text-blue-400 uppercase tracking-tight">{title.trim()}</h3>
                <div className="text-zinc-400 text-[11px] leading-relaxed space-y-4">
                  {content.join('\n').split('\n').filter(Boolean).map((p, j) => {
                    if (p.trim().startsWith('- ')) {
                      return (
                        <div key={j} className="flex gap-3 items-start">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 mt-1.5 shrink-0"></div>
                          <p>{p.trim().replace('- ', '')}</p>
                        </div>
                      );
                    }
                    return <p key={j}>{p}</p>;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (selectedProject) return renderProjectDetail();
    return (
      <div className="h-full bg-[#050505] text-white p-8 overflow-y-auto no-scrollbar pt-20 animate-in slide-in-from-bottom duration-500">
        <button onClick={() => setActiveApp(AppType.HOME)} className="mb-8 flex items-center text-zinc-600 font-black text-[10px] tracking-widest uppercase">
          <ArrowLeft className="w-4 h-4 mr-2" /> BACK
        </button>
        <h2 className="text-5xl font-black mb-10 tracking-tighter uppercase font-display leading-none">WORKS</h2>
        <div className="space-y-10 pb-10">
          {PROJECTS_DATA.map(project => (
            <div 
              key={project.id} 
              onClick={() => project.caseStudy ? setSelectedProject(project) : null}
              className={`group relative bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/5 transition-all active:scale-[0.98] ${project.caseStudy ? 'cursor-pointer' : ''}`}
            >
              <div className="relative h-56">
                <img src={project.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-8">
                   <h3 className="text-2xl font-black text-white tracking-tighter uppercase font-display leading-none">{project.title}</h3>
                </div>
                {project.caseStudy && (
                  <div className="absolute top-6 right-6 bg-blue-500/20 backdrop-blur-md border border-blue-500/30 px-3 py-1 rounded-full">
                    <span className="text-[7px] font-black text-blue-400 uppercase tracking-widest">Case Study</span>
                  </div>
                )}
              </div>
              <div className="p-8">
                <p className="text-zinc-500 text-[10px] leading-relaxed mb-4 line-clamp-2">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.slice(0, 3).map(t => (
                    <span key={t} className="text-[8px] bg-white/5 border border-white/5 text-zinc-500 px-3 py-1 rounded-full font-black uppercase tracking-wider">{t}</span>
                  ))}
                  {project.tech.length > 3 && <span className="text-[8px] text-zinc-700 font-black py-1">+{project.tech.length - 3}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkills = () => (
    <div className="h-full bg-[#0a0a0a] text-white p-8 pt-20 flex flex-col animate-in fade-in duration-500">
      <button onClick={() => setActiveApp(AppType.HOME)} className="mb-8 flex items-center text-zinc-600 font-black text-[10px] tracking-widest uppercase">
        <ArrowLeft className="w-4 h-4 mr-2" /> DISMISS
      </button>
      <h2 className="text-5xl font-black mb-2 tracking-tighter uppercase font-display">IMPACT</h2>
      <p className="text-green-500 font-black text-[10px] tracking-[0.4em] uppercase mb-10">Live Analytics</p>
      
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        <div className="grid grid-cols-2 gap-4 mb-8">
          {ACHIEVEMENTS_DATA.map((ach, i) => (
            <div key={i} className="bg-zinc-900/40 p-5 rounded-[2rem] border border-white/5 flex flex-col items-center text-center">
              <div className="mb-3 opacity-50">{ach.icon}</div>
              <h4 className="text-2xl font-black text-white mb-1 tracking-tighter font-display">{ach.value}</h4>
              <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">{ach.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-zinc-900/20 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl">
           <p className="text-[9px] font-black text-zinc-600 mb-6 tracking-[0.3em] uppercase">Engagement Velocity</p>
           <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                {v: 30}, {v: 45}, {v: 35}, {v: 60}, {v: 55}, {v: 90}
              ]}>
                <Line type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="h-full bg-[#050505] text-white p-8 pt-20 animate-in slide-in-from-top duration-500">
      <button onClick={() => setActiveApp(AppType.HOME)} className="mb-8 flex items-center text-zinc-600 font-black text-[10px] tracking-widest uppercase">
        <ArrowLeft className="w-4 h-4 mr-2" /> CLOSE
      </button>
      <h2 className="text-5xl font-black mb-10 tracking-tighter uppercase font-display">CONNECT</h2>
      
      <div className="space-y-6">
        <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Email</p>
            <p className="text-sm font-bold">alex@dev.ecosystem</p>
          </div>
        </div>

        <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center">
            <Linkedin className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">LinkedIn</p>
            <p className="text-sm font-bold">/in/alex-architect</p>
          </div>
        </div>

        <div className="bg-zinc-900/40 p-6 rounded-[2rem] border border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center">
            <Github className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">GitHub</p>
            <p className="text-sm font-bold">@alex-mobile-pro</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGemini = () => (
    <div className="h-full bg-[#050505] flex flex-col pt-20 animate-in slide-in-from-right duration-500">
      <div className="px-8 mb-6 flex justify-between items-center">
        <button onClick={() => setActiveApp(AppType.HOME)} className="flex items-center text-zinc-600 font-black text-[10px] tracking-widest uppercase">
          <ArrowLeft className="w-4 h-4 mr-2" /> BACK
        </button>
        <div className="flex items-center gap-3">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-[9px] font-black text-purple-500 uppercase tracking-[0.4em]">Neural Link</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 space-y-6 no-scrollbar pb-6">
        {aiChat.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 bg-purple-600/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-purple-500/20 shadow-2xl">
              <MessageSquare className="w-10 h-10 text-purple-500" />
            </div>
            <h3 className="text-3xl font-black text-white mb-3 font-display uppercase tracking-tight">AI CORE</h3>
            <p className="text-zinc-600 text-[10px] leading-relaxed font-bold uppercase tracking-[0.2em]">Ask about technical architecture or career goals.</p>
          </div>
        )}
        {aiChat.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-5 rounded-[2rem] text-xs leading-relaxed font-medium ${
              msg.role === 'user' 
                ? 'bg-purple-600 text-white rounded-tr-none shadow-xl' 
                : 'bg-zinc-900 text-zinc-300 rounded-tl-none border border-white/5'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isAiTyping && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 p-5 rounded-[2rem] rounded-tl-none border border-white/5">
              <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
            </div>
          </div>
        )}
      </div>

      <div className="p-5 bg-zinc-900/50 border border-white/5 mb-10 mx-6 rounded-[2.5rem] flex gap-3 items-center shadow-2xl">
        <input 
          value={aiInput}
          onChange={(e) => setAiInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAiSend()}
          placeholder="Initiate Query..."
          className="flex-1 bg-transparent border-none outline-none text-[10px] font-black text-white px-3 py-1 uppercase tracking-widest"
        />
        <button 
          onClick={handleAiSend}
          disabled={!aiInput.trim() || isAiTyping}
          className="w-12 h-12 bg-purple-600 rounded-[1.2rem] flex items-center justify-center active:scale-90 transition-transform disabled:opacity-50 shadow-lg shadow-purple-500/30"
        >
          <Send className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-full bg-[#000] overflow-hidden rounded-[45px]">
      {/* Status Bar */}
      <div className="absolute top-0 left-0 w-full px-12 py-5 flex justify-between items-center text-[10px] font-black text-white z-50 pointer-events-none tracking-widest">
        <span>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <div className="w-6 h-3 bg-white/10 rounded-sm relative border border-white/20 overflow-hidden">
             <div className="h-full bg-white w-[85%]"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full h-full">
        {activeApp === AppType.LOCKED && renderLocked()}
        {activeApp === AppType.HOME && renderHome()}
        {activeApp === AppType.ABOUT && renderAbout()}
        {activeApp === AppType.PROJECTS && renderProjects()}
        {activeApp === AppType.SKILLS && renderSkills()}
        {activeApp === AppType.GEMINI && renderGemini()}
        {activeApp === AppType.CONTACT && renderContact()}
        {activeApp === AppType.GAME && (
          <div className="h-full bg-black overflow-hidden relative">
            <button onClick={() => setActiveApp(AppType.HOME)} className="absolute top-20 left-8 z-50 text-zinc-600 hover:text-white flex items-center gap-2 text-[10px] font-black tracking-widest uppercase transition-colors">
              <ArrowLeft className="w-4 h-4" /> ABANDON
            </button>
            <IRunner onGameOver={(s) => console.log('FinalScore:', s)} />
          </div>
        )}
      </div>

      {/* Home Indicator */}
      {activeApp !== AppType.LOCKED && (
        <button 
          onClick={() => setActiveApp(AppType.HOME)}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 w-40 h-1.5 bg-white/20 rounded-full z-50 hover:bg-white transition-colors"
        />
      )}
    </div>
  );
};

export default PhoneScreen;
