import React, { useEffect, useState } from 'react';
import HeartAnimation from './HeartAnimation';

const Preloader = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const [dotCount, setDotCount] = useState(1);

  // Animate dots in 'Loading...'
  useEffect(() => {
    const dotTimer = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1);
    }, 500);
    return () => clearInterval(dotTimer);
  }, []);

  // Fade out before unmount
  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 4700); // Start fade out before 5s
    return () => clearTimeout(fadeTimer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-primary-100 via-white to-secondary-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-800 transition-opacity duration-500 ${fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="w-40 h-40 flex items-center justify-center mb-8 drop-shadow-2xl">
        <HeartAnimation />
      </div>
      <div className="text-4xl md:text-5xl font-extrabold text-center text-white mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] tracking-wide" style={{textShadow: '2px 2px 8px #000, 0 0 2px #000'}}>
        स्वास्थ्य रक्षक
      </div>
      <div className="text-6xl font-extrabold text-primary-500 dark:text-primary-300 flex items-center justify-center mt-2">
        {'.'.repeat(dotCount)}
      </div>
    </div>
  );
};

export default Preloader; 