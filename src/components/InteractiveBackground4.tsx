'use client';
// eslint-disable-next-line react-hooks/exhaustive-deps

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from './InteractiveBackground4.module.css';

const blobCount = 5;
const blobSize = 700;

const colorPalettes = [
  ['#7B2FF7', '#F107A3'], // bright purple-pink
  ['#4A00E0', '#8E2DE2'], // bright blue-purple
  ['#6A00FF', '#C400FF'], // bright purple
  ['#FF6347', '#FF4500'], // bright orange-red
  ['#00FFFF', '#008B8B'], // cyan-blue
];

// Function to create blobs with random positions and speed
function createBlob() {
  // Ensure that the code only runs in the browser
  if (typeof window === 'undefined') return { x: 0, y: 0, dx: 0, dy: 0, scale: 1, scaleDirection: 1 };

  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    dx: (Math.random() - 0.5) * 3, // Increased speed here
    dy: (Math.random() - 0.5) * 3, // Increased speed here
    scale: 1,
    scaleDirection: Math.random() > 0.5 ? 1 : -1,
  };
}

const InteractiveBackground4: React.FC = () => {
  const [blobs, setBlobs] = useState(() =>
    Array.from({ length: blobCount }, createBlob)
  );

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - blobSize / 2);
      mouseY.set(e.clientY - blobSize / 2);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlobs((prev) =>
        prev.map((b) => {
          const newX = b.x + b.dx * 3; // Increased speed here
          const newY = b.y + b.dy * 3; // Increased speed here

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
    <div className={styles.gradientBg}>
      <svg className={styles.svgFilter}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 20 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className={styles.gradientsContainer}>
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
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveBackground4;
