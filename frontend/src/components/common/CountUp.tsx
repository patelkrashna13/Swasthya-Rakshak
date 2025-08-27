import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

interface CountUpProps {
  end: number;
  duration?: number;
  decimals?: number;
}

const CountUp: React.FC<CountUpProps> = ({ end, duration = 2, decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const frameRate = 1000 / 60; // 60fps
  const totalFrames = Math.round(duration * 60);
  
  useEffect(() => {
    if (isInView) {
      let frame = 0;
      const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentCount = easeOutQuad(progress) * end;
        
        if (frame === totalFrames) {
          setCount(end);
          clearInterval(counter);
        } else {
          setCount(currentCount);
        }
      }, frameRate);
      
      return () => clearInterval(counter);
    }
  }, [isInView, end, duration, totalFrames, frameRate]);
  
  // Easing function for smoother animation
  const easeOutQuad = (x: number): number => {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  };
  
  return <span ref={ref}>{count.toFixed(decimals)}</span>;
};

export default CountUp;