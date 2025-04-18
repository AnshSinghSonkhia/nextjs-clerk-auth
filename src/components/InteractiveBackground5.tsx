'use client';
import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const blobCount = 4;
const blobSize = 700;

const colorPalettes = [
    ['#7B2FF7', '#F107A3'], // bright purple-pink
    ['#4A00E0', '#8E2DE2'], // bright blue-purple
    ['#6A00FF', '#C400FF'], // bright purple
];

function createBlob() {
    return {
      x: 0,
      y: 0,
      dx: (Math.random() - 0.5) * 1.5,
      dy: (Math.random() - 0.5) * 1.5,
      scale: 1,
      scaleDirection: Math.random() > 0.5 ? 1 : -1,
    };
  }
  

const InteractiveBackground5: React.FC = () => {
  const [blobs, setBlobs] = useState(() =>
    Array.from({ length: blobCount }, createBlob)
  );

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 25 });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - blobSize / 2);
      mouseY.set(e.clientY - blobSize / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Safe to access window here
//   useEffect(() => {
//     const initialized = blobs.map(blob => ({
//       ...blob,
//       x: Math.random() * window.innerWidth,
//       y: Math.random() * window.innerHeight,
//     }));
//     setBlobs(initialized);
//   }, []);
  useEffect(() => {
    const initialized = blobs.map(blob => ({
      ...blob,
      x: Math.random() * (window.innerWidth - blobSize),
      y: Math.random() * (window.innerHeight - blobSize),
    }));
    setBlobs(initialized);
  }, []);
  

  useEffect(() => {
    const interval = setInterval(() => {
      setBlobs(prev =>
        prev.map(b => {
          let newX = b.x + b.dx * 2;
          let newY = b.y + b.dy * 2;
  
          // Bounce off walls
          if (newX < 0 || newX > window.innerWidth - blobSize) b.dx *= -1;
          if (newY < 0 || newY > window.innerHeight - blobSize) b.dy *= -1;
  
          // Oscillate scale between 0.8 and 1.2
          let newScale = b.scale + b.scaleDirection * 0.01;
          if (newScale > 1.2 || newScale < 0.8) {
            b.scaleDirection *= -1;
            newScale = Math.max(0.8, Math.min(1.2, newScale));
          }
  
          return { ...b, x: newX, y: newY, scale: newScale };
        })
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);
  

  const baseBlobStyle = {
    position: 'absolute' as const,
    width: blobSize,
    height: blobSize,
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.7,
    mixBlendMode: 'screen' as const,
    transition: 'all 0.3s ease',
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        overflow: 'hidden',
        backgroundColor: '#0f0f0f',
      }}
    >
      {/* Mouse-following blob */}
      <motion.div
        style={{
          ...baseBlobStyle,
          x: smoothX,
          y: smoothY,
          background: 'radial-gradient(circle at 30% 30%, #7B2FF7, #F107A3)',
        }}
      />

      {/* Floating blobs */}
      {blobs.map((b, i) => {
        const [startColor, endColor] = colorPalettes[i % colorPalettes.length];
        return (
            <motion.div
            key={i}
            style={{
              ...baseBlobStyle,
              left: b.x,
              top: b.y,
              background: `radial-gradient(circle at 30% 30%, ${startColor}, ${endColor})`,
              transform: `scale(${b.scale})`,
              border: '2px solid red',  
            }}
          />
          
        );
      })}
    </div>
  );
};

export default InteractiveBackground5;
