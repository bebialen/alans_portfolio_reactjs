import React, { useRef, useEffect, useState } from 'react';

const fragments = [
  { label: 'View.onScroll', x: 80, y: 20, size: 'w-32 h-12' },
  { label: '08:42', x: 90, y: 10, size: 'w-16 h-8' }, // Status bar feel
  { label: 'Connect', x: 75, y: 60, size: 'w-24 h-24', rounded: 'rounded-full' }, // Floating Action Button
  { label: '', x: 85, y: 40, size: 'w-40 h-56' }, // App Card
];

const HeroVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const mouseRef = useRef({ x: 0, y: 0, radius: 150 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; originX: number; originY: number; vx: number; vy: number }[] = [];

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const spacing = 40;
      for (let x = canvas.width * 0.4; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          particles.push({
            x, y, originX: x, originY: y, vx: 0, vy: 0
          });
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const mouse = mouseRef.current;
      const gradient = ctx.createRadialGradient(
        mouse.x, mouse.y, 0, 
        mouse.x, mouse.y, mouse.radius * 1.5
      );
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.lineWidth = 0.5;

      particles.forEach((p, i) => {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          p.vx -= dx * force * 0.03;
          p.vy -= dy * force * 0.03;
        }

        p.vx += (p.originX - p.x) * 0.05;
        p.vy += (p.originY - p.y) * 0.05;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.x += p.vx;
        p.y += p.vy;

        if (i % 15 === 0) {
          const opacity = dist < mouse.radius ? 0.4 : 0.1;
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          ctx.lineTo(p.x, p.y);
        }
      });
      
      ctx.stroke();

      particles.forEach((p, i) => {
        if (i % 6 === 0) {
          const dist = Math.sqrt((mouse.x - p.x) ** 2 + (mouse.y - p.y) ** 2);
          
          if (dist < mouse.radius) {
            ctx.fillStyle = '#60a5fa';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
            ctx.fill();
          } else if (i % 18 === 0) {
            ctx.fillStyle = '#27272a';
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', handleMouseMove);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 right-0 w-full h-full opacity-60"
        style={{ maskImage: 'linear-gradient(to left, black 40%, transparent 100%)' }}
      />
      
      {fragments.map((frag, i) => (
        <div
          key={i}
          className={`absolute hidden lg:flex items-center justify-center 
                     bg-white/5 border border-white/10 backdrop-blur-md 
                     text-[8px] font-mono text-blue-400/50 uppercase tracking-widest
                     transition-transform duration-1000 ease-out ${frag.size} ${frag.rounded || 'rounded-2xl'}`}
          style={{
            top: `${frag.y}%`,
            left: `${frag.x}%`,
            transform: `translate3d(${mousePos.x * (0.02 * (i + 1))}px, ${mousePos.y * (0.01 * (i + 1))}px, 0)`,
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
          }}
        >
          {frag.label}
        </div>
      ))}
    </div>
  );
};

export default HeroVisual;
