'use client';

import { useEffect, useRef } from 'react';

const InteractiveBackground = () => {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const x = (clientX / innerWidth - 0.5) * 100;
      const y = (clientY / innerHeight - 0.5) * 100;

      if (bgRef.current) {
        bgRef.current.style.setProperty('--x', `${x}px`);
        bgRef.current.style.setProperty('--y', `${y}px`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={bgRef}
      className="fixed inset-0 -z-10 overflow-hidden"
      style={{
        background: 'radial-gradient(circle at center, #7f00ff 0%, #000000 80%)',
        filter: 'blur(120px)',
        transform: 'translate(var(--x, 0px), var(--y, 0px))',
        transition: 'transform 0.1s ease-out',
      }}
    />
  );
};

export default InteractiveBackground;
