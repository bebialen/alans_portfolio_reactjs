
/// <reference types="three" />
import React, { Suspense, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, ContactShadows } from '@react-three/drei';
import PhoneModel from './components/PhoneModel';
import { Github, Linkedin, Twitter, Download, ChevronRight, LayoutGrid, History, Trophy, Mail, Rotate3d,Maximize2 } from 'lucide-react';
import { PROJECTS_DATA, EXPERIENCE_DATA, ACHIEVEMENTS_DATA } from './constants';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('locked');
  const [canRotate, setCanRotate] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastTap = useRef<number>(0);
  const [isExpanded, setIsExpanded] = useState(false);



  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPos = container.scrollTop;
      const sections = ['home', 'projects', 'experience', 'achievements'];

      if (scrollPos < 50) {
        setActiveSection('locked');
        return;
      }

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          const viewportCenter = window.innerHeight / 2;
          // Check if section is currently occupying the center of the viewport
          if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
            setActiveSection(section);
          }
        }
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      setCanRotate(!canRotate);
    }
    lastTap.current = now;
  };

  return (
    <div className="w-screen h-screen bg-[#050505] flex flex-col lg:flex-row relative overflow-hidden">

      {/* Fixed Navigation Dock */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-zinc-900/40 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full hidden lg:flex items-center gap-8">
        {[
          { id: 'home', label: 'Home', icon: <LayoutGrid className="w-4 h-4" /> },
          { id: 'projects', label: 'Works', icon: <ChevronRight className="w-4 h-4" /> },
          { id: 'experience', label: 'Resume', icon: <History className="w-4 h-4" /> },
          { id: 'achievements', label: 'Impact', icon: <Trophy className="w-4 h-4" /> }
        ].map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.2em] transition-all ${activeSection === item.id ? 'text-blue-400' : 'text-zinc-500 hover:text-white'
              }`}
          >
            {item.icon} {item.label}
          </a>
        ))}
      </nav>

      {/* Left: Content Area (Scrollable) */}
      <div
        ref={scrollRef}
        className="flex-1 h-full overflow-y-auto no-scrollbar scroll-smooth"
      >

        {/* Section 1: Home/Hero */}
        <section id="home" className="min-h-screen flex flex-col justify-center p-8 lg:p-24 relative">
          <div className="mb-6 inline-flex items-center gap-3 bg-blue-500/10 text-blue-400 px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase border border-blue-500/20">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Mobile App Developer
          </div>
          <h1 className="text-7xl lg:text-[10rem] font-black text-white mb-8 leading-[0.85] tracking-tighter font-display uppercase">
            ALAN <span className="text-gradient">DEV.</span>
          </h1>
          <p className="text-zinc-400 text-xl mb-12 max-w-lg leading-relaxed font-medium">
            Architecting elite mobile ecosystems with native precision and cross-platform scale.
          </p>
          <div className="flex gap-4">
            <a
              href="/Alanbebido_MobileAppDev_Resume.pdf"
              download="Alan_Resume.pdf"
              className="bg-white text-black px-8 py-5 rounded-full font-extrabold text-xs tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
            >
              DOWNLOAD CV <Download className="w-4 h-4" />
            </a>
            <a href="#projects" className="border border-white/10 bg-white/5 text-white px-8 py-5 rounded-full font-extrabold text-xs tracking-widest hover:bg-white/10 transition-all">
              VIEW WORKS
            </a>
          </div>

          <div className="absolute bottom-10 left-24 animate-bounce hidden lg:block">
            <div className="w-px h-12 bg-gradient-to-b from-blue-500 to-transparent"></div>
          </div>
        </section>

        {/* Section 2: Projects */}
        <section id="projects" className="min-h-screen p-8 lg:p-24 bg-zinc-950/30">
          <div className="flex items-end justify-between mb-20">
            <div>
              <p className="text-blue-500 font-black text-[10px] tracking-[0.4em] uppercase mb-4">Selected Portfolio</p>
              <h2 className="text-6xl lg:text-8xl font-black text-white leading-none tracking-tighter font-display uppercase">FEATURED WORKS</h2>
            </div>
          </div>

          <div className="grid gap-16">
            {PROJECTS_DATA.map((project) => (
              <div key={project.id} className="group relative bg-zinc-900/40 rounded-[3rem] border border-white/5 p-8 lg:p-14 transition-all hover:bg-zinc-900/60">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-8">
                      {project.tech.map(t => (
                        <span key={t} className="text-[9px] font-black bg-zinc-800 text-zinc-500 px-4 py-1.5 rounded-full border border-white/5 uppercase tracking-wider">{t}</span>
                      ))}
                    </div>
                    <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tight font-display">{project.title}</h3>
                    <p className="text-zinc-400 leading-relaxed mb-10 text-lg">{project.description}</p>
                    <button className="flex items-center gap-3 text-white font-extrabold text-xs group-hover:text-blue-400 transition-colors uppercase tracking-[0.2em]">
                      Explore Case Study <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="w-full lg:w-1/2 aspect-video rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl">
                    <img src={project.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Experience */}
        <section id="experience" className="min-h-screen p-8 lg:p-24">
          <p className="text-purple-500 font-black text-[10px] tracking-[0.4em] uppercase mb-4">Career Journey</p>
          <h2 className="text-6xl lg:text-8xl font-black text-white leading-none tracking-tighter font-display uppercase mb-20">PROFESSIONAL ARC</h2>

          <div className="relative">
            <div className="absolute left-0 lg:left-1/2 top-0 bottom-0 w-px bg-zinc-800/50 hidden lg:block"></div>
            <div className="space-y-32">
              {EXPERIENCE_DATA.map((exp, i) => (
                <div key={i} className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-0 ${i % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                  <div className="flex-1 lg:px-20">
                    <div className={`flex flex-col ${i % 2 === 0 ? 'lg:items-start text-left' : 'lg:items-end text-right'}`}>
                      <span className="text-zinc-600 font-black text-xs mb-3 tracking-widest">{exp.period}</span>
                      <h4 className="text-3xl font-black text-white mb-3 uppercase tracking-tight font-display">{exp.role}</h4>
                      <h5 className="text-purple-400 font-extrabold mb-6 uppercase tracking-[0.3em] text-[10px]">{exp.company}</h5>
                      <p className="text-zinc-400 text-sm max-w-md leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-center z-10">
                    <div className="w-6 h-6 bg-black border-2 border-purple-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex-1 hidden lg:block"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Achievements */}
        <section id="achievements" className="min-h-screen p-8 lg:p-24 flex flex-col justify-center bg-zinc-950/30">
          <p className="text-green-500 font-black text-[10px] tracking-[0.4em] uppercase mb-4">Metric Driven</p>
          <h2 className="text-6xl lg:text-8xl font-black text-white leading-none tracking-tighter font-display uppercase mb-24">PROVEN IMPACT</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ACHIEVEMENTS_DATA.map((ach, i) => (
              <div key={i} className="bg-zinc-900/50 p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center group hover:bg-zinc-900 transition-all">
                <div className="mb-8 bg-white/5 w-20 h-20 rounded-3xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                  {ach.icon}
                </div>
                <h4 className="text-2xl font-black text-white mb-3 tracking-tighter font-display">{ach.value}</h4>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em]">{ach.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-32 p-14 bg-gradient-to-br from-zinc-900 to-black rounded-[4rem] border border-white/10 flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 blur-[100px] group-hover:bg-blue-500/20 transition-all"></div>
            <div className="flex-1 relative z-10">
              <h3 className="text-4xl font-black text-white mb-6 tracking-tight font-display uppercase">READY TO START A PROJECT?</h3>
              <p className="text-zinc-500 mb-10 text-lg">Let's build something that millions will love using.</p>
              <div className="flex flex-wrap gap-6">
                <button className="bg-white text-black px-10 py-5 rounded-full font-black text-xs tracking-widest flex items-center gap-3">
                  CONTACT ME <Mail className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-6 px-4">
                  <Github className="w-6 h-6 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
                  <Linkedin className="w-6 h-6 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
                  <Twitter className="w-6 h-6 text-zinc-500 hover:text-white transition-colors cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Right: 3D Scene (Fixed) */}
      <div
        className="hidden lg:block lg:w-[20%] lg:h-full relative bg-[#050505] border-l border-white/5 cursor-crosshair"
        onMouseDown={handleDoubleTap}
      >
        {/* <div className="absolute top-8 left-8 z-2 hidden lg:block">
          <div className="bg-zinc-900/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3">
            <div className={`w-2 h-2 ${activeSection === 'locked' ? 'bg-red-500' : 'bg-green-500'} rounded-full animate-pulse`}></div>
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
              {activeSection === 'locked' ? 'Locked' : `Sync: ${activeSection.toUpperCase()}`}
            </span>
          </div>
        </div> */}
        <button
  onClick={() => setIsExpanded(true)}
  className="absolute top-6 right-6 
             bg-white/10 backdrop-blur 
             p-1 rounded-xl text-white 
             hover:bg-white/20 
             transition-all duration-300"
>
  <Maximize2 className="w-2 h-2" />
</button>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none"></div>


        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
          {/* @ts-ignore */}
          <ambientLight intensity={0.4} />
          {/* @ts-ignore */}
          <spotLight position={[10, 15, 10]} angle={0.2} penumbra={1} intensity={1.5} castShadow />
          {/* @ts-ignore */}
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Environment preset="night" />

          <Suspense fallback={null}>
            <PhoneModel onAppChange={() => { }} activeSection={activeSection} />
          </Suspense>

          <ContactShadows
            position={[0, -4.5, 0]}
            opacity={0.3}
            scale={15}
            blur={2.5}
            far={10}
          />

          <OrbitControls
            enabled={canRotate}
            enablePan={false}
            enableZoom={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
        

        <div className="absolute bottom-5 left-10 right-10 flex flex-col items-center pointer-events-none">
          <div className={`flex flex-col items-center gap-2 transition-opacity duration-500 ${canRotate ? 'opacity-30' : 'opacity-100'}`}>
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
              <Rotate3d className="w-4 h-4 text-blue-400 animate-spin-slow" />
              <p className="text-[5px] font-black text-white uppercase tracking-[0.2em]">Double tap to rotate iphone frame</p>
            </div>
            {canRotate && (
              <p className="text-zinc-500 text-[6px] font-black uppercase tracking-widest">Rotation Unlocked • Double tap to lock</p>
            )}
          </div>
        </div>
      </div>
      {/* {isExpanded && (
  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
    <div className="w-[80vw] h-[80vh] bg-[#050505] relative rounded-2xl">
      
      <button
        onClick={() => setIsExpanded(false)}
        className="absolute top-4 right-4 text-white"
      >
        ✕
      </button>

      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <PhoneModel canRotate={true} ... />
        <OrbitControls enablePan enableZoom />
      </Canvas>

    </div>
  </div>
)} */}


    </div>
  );
};

export default App;
