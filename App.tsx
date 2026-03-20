
/// <reference types="three" />
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import PhoneModel from './components/PhoneModel';
import { Github, Linkedin, Twitter, Download, ChevronRight, LayoutGrid, History, Trophy, Mail, Menu, X } from 'lucide-react';
import { PROJECTS_DATA, EXPERIENCE_DATA, ACHIEVEMENTS_DATA } from './constants';
import HeroVisual from './components/HeroVisual';
import ScrollReveal from './components/ScrollReveal';
import LoadingScreen from './components/LoadingScreen';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'home', label: 'Home', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'projects', label: 'Works', icon: <ChevronRight className="w-4 h-4" /> },
    { id: 'experience', label: 'Resume', icon: <History className="w-4 h-4" /> },
    { id: 'achievements', label: 'Impact', icon: <Trophy className="w-4 h-4" /> }
  ];

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const sections = ['home', 'projects', 'experience', 'achievements'];
      const viewportCenter = window.innerHeight / 2;

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
            setActiveSection(section);
          }
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <div className="w-full h-screen bg-[#050505] flex flex-col lg:flex-row relative overflow-hidden text-white">
      <LoadingScreen onComplete={() => setIsLoading(false)} />

      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="w-full h-full flex flex-col lg:flex-row"
          >
            {/* Desktop Navigation */}
            <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900/40 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full hidden lg:flex items-center gap-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={`flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] transition-all ${activeSection === item.id ? 'text-blue-400' : 'text-zinc-500 hover:text-white'
              }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-[100] p-6 flex justify-between items-center bg-gradient-to-b from-[#050505] to-transparent">
        <div className="text-xl font-black tracking-tighter uppercase font-display">ALAN <span className="text-blue-500">DEV.</span></div>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-white/10"
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`lg:hidden fixed inset-0 z-[90] bg-black/95 backdrop-blur-2xl transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="h-full flex flex-col justify-center items-center gap-8 p-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`flex items-center gap-4 text-4xl font-black uppercase tracking-tighter font-display ${activeSection === item.id ? 'text-blue-500' : 'text-zinc-500'}`}
            >
              {item.label}
            </button>
          ))}
          <div className="flex gap-8 mt-12">
            <Github className="w-6 h-6 text-zinc-500" />
            <Linkedin className="w-6 h-6 text-zinc-500" />
            <Twitter className="w-6 h-6 text-zinc-500" />
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div
        ref={scrollRef}
        className="flex-1 h-full overflow-y-auto no-scrollbar relative z-10"
      >
        {/* Section 1: Home/Hero */}
        <section id="home" className="min-h-screen flex flex-col justify-center p-6 sm:p-12 lg:p-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-6 inline-flex items-center gap-3 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-[9px] font-black tracking-widest uppercase border border-blue-500/20 w-fit">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Mobile App Developer
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-[10rem] font-black text-white mb-6 leading-[0.85] tracking-tighter font-display uppercase">
              ALAN <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">DEV.</span>
            </h1>
            <p className="text-zinc-400 text-lg sm:text-xl mb-10 max-w-lg leading-relaxed font-medium">
              Architecting elite mobile ecosystems with native precision and cross-platform scale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/Alanbebido_MobileAppDev_Resume.pdf"
                download="Alan_Resume.pdf"
                className="bg-white text-black px-8 py-4 sm:py-5 rounded-full font-extrabold text-xs tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                DOWNLOAD CV <Download className="w-4 h-4" />
              </a>
              <button 
                onClick={() => scrollTo('projects')}
                className="border border-white/10 bg-white/5 text-white px-8 py-4 sm:py-5 rounded-full font-extrabold text-xs tracking-widest hover:bg-white/10 transition-all"
              >
                VIEW WORKS
              </button>
            </div>
          </motion.div>
          
          <div className="absolute bottom-10 left-12 sm:left-24 animate-bounce hidden sm:block">
            <div className="w-px h-12 bg-gradient-to-b from-blue-500 to-transparent"></div>
          </div>
        </section>

        {/* Section 2: Projects */}
        <section id="projects" className="min-h-screen p-6 sm:p-12 lg:p-24 bg-zinc-950/30">
          <ScrollReveal>
            <div className="mb-12 sm:mb-20">
              <p className="text-blue-500 font-black text-[10px] tracking-[0.4em] uppercase mb-4">Selected Portfolio</p>
              <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white leading-none tracking-tighter font-display uppercase">FEATURED WORKS</h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 sm:gap-16">
            {PROJECTS_DATA.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 0.1}>
                <div className="group relative bg-zinc-900/40 rounded-[2rem] sm:rounded-[3rem] border border-white/5 p-6 sm:p-10 lg:p-14 transition-all hover:bg-zinc-900/60 overflow-hidden">
                  <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-center">
                    <div className="flex-1 w-full">
                      <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                        {project.tech.map(t => (
                          <span key={t} className="text-[8px] sm:text-[9px] font-black bg-zinc-800 text-zinc-500 px-3 sm:px-4 py-1.5 rounded-full border border-white/5 uppercase tracking-wider">{t}</span>
                        ))}
                      </div>
                      <h3 className="text-2xl sm:text-4xl font-black text-white mb-4 sm:mb-6 uppercase tracking-tight font-display">{project.title}</h3>
                      <p className="text-zinc-400 leading-relaxed mb-8 sm:mb-10 text-base sm:text-lg">{project.description}</p>
                      <button className="flex items-center gap-3 text-white font-extrabold text-xs group-hover:text-blue-400 transition-colors uppercase tracking-[0.2em]">
                        Explore Case Study <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="w-full lg:w-1/2 aspect-video rounded-2xl sm:rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl order-first lg:order-last">
                      <img src={project.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* Section 3: Experience */}
        <section id="experience" className="min-h-screen p-6 sm:p-12 lg:p-24">
          <ScrollReveal>
            <p className="text-purple-500 font-black text-[10px] tracking-[0.4em] uppercase mb-4">Career Journey</p>
            <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white leading-none tracking-tighter font-display uppercase mb-12 sm:mb-20">PROFESSIONAL ARC</h2>
          </ScrollReveal>

          <div className="relative">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-zinc-800/50"></div>
            <div className="space-y-16 sm:space-y-32">
              {EXPERIENCE_DATA.map((exp, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className={`flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-0 ${i % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                    <div className="flex-1 pl-12 sm:pl-0 lg:px-20 w-full">
                      <div className={`flex flex-col ${i % 2 === 0 ? 'lg:items-start text-left' : 'lg:items-end lg:text-right'}`}>
                        <span className="text-zinc-600 font-black text-[10px] sm:text-xs mb-2 tracking-widest">{exp.period}</span>
                        <h4 className="text-xl sm:text-3xl font-black text-white mb-2 uppercase tracking-tight font-display">{exp.role}</h4>
                        <h5 className="text-purple-400 font-extrabold mb-4 uppercase tracking-[0.3em] text-[9px] sm:text-[10px]">{exp.company}</h5>
                        <p className="text-zinc-400 text-sm max-w-md leading-relaxed">{exp.description}</p>
                      </div>
                    </div>
                    <div className="absolute left-0 sm:static sm:flex items-center justify-center z-10 w-8 sm:w-auto">
                      <div className="w-8 h-8 sm:w-6 sm:h-6 bg-black border-2 border-purple-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1 hidden lg:block"></div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Achievements */}
        <section id="achievements" className="min-h-screen p-6 sm:p-12 lg:p-24 flex flex-col justify-center bg-zinc-950/30">
          <ScrollReveal>
            <p className="text-green-500 font-black text-[10px] tracking-[0.4em] uppercase mb-4">Metric Driven</p>
            <h2 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white leading-none tracking-tighter font-display uppercase mb-12 sm:mb-24">PROVEN IMPACT</h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {ACHIEVEMENTS_DATA.map((ach, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="bg-zinc-900/50 p-8 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center group hover:bg-zinc-900 transition-all h-full">
                  <div className="mb-6 sm:mb-8 bg-white/5 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                    {ach.icon}
                  </div>
                  <h4 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tighter font-display">{ach.value}</h4>
                  <p className="text-zinc-500 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em]">{ach.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal>
            <div className="mt-20 sm:mt-32 p-8 sm:p-14 bg-gradient-to-br from-zinc-900 to-black rounded-[2.5rem] sm:rounded-[4rem] border border-white/10 flex flex-col lg:flex-row items-center gap-10 lg:gap-12 relative overflow-hidden group">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 blur-[100px] group-hover:bg-blue-500/20 transition-all"></div>
              <div className="flex-1 relative z-10 text-center lg:text-left w-full">
                <h3 className="text-2xl sm:text-4xl font-black text-white mb-4 sm:mb-6 tracking-tight font-display uppercase">READY TO START A PROJECT?</h3>
                <p className="text-zinc-500 mb-8 sm:mb-10 text-base sm:text-lg">Let's build something that millions will love using.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 sm:gap-8">
                  <button className="w-full sm:w-auto bg-white text-black px-10 py-4 sm:py-5 rounded-full font-black text-xs tracking-widest flex items-center justify-center gap-3">
                    CONTACT ME <Mail className="w-5 h-5" />
                  </button>
                  <div className="flex items-center gap-6">
                    <Github className="w-6 h-6 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
                    <Linkedin className="w-6 h-6 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
                    <Twitter className="w-6 h-6 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        <footer className="p-8 text-center text-[10px] text-zinc-600 font-black uppercase tracking-[0.5em]">
          © 2026 ALAN DEV. ALL RIGHTS RESERVED.
        </footer>
      </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
