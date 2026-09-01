import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';

export default function AnimatedMetricValue({ value }: { value: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const reduceMotion = useReducedMotion();
  const match = value.match(/\d+/);
  const [display, setDisplay] = useState(reduceMotion || !match ? value : value.replace(/\d+/, '0'));

  useEffect(() => {
    if (!inView || !match || reduceMotion) return;
    const target = Number(match[0]);
    const start = performance.now();
    const duration = 850;
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(value.replace(/\d+/, String(Math.round(target * eased))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, match, reduceMotion, value]);

  return <h4 ref={ref} className="metric-value text-xl sm:text-2xl font-black text-white mb-2 tracking-tighter font-display">{display}</h4>;
}
