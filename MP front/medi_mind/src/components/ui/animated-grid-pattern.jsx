import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

export function AnimatedGridPattern({
  numSquares = 30,
  maxOpacity = 0.1,
  duration = 3,
  repeatDelay = 1,
  className,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const squares = [];
    const colors = [
      'var(--primary)',
      'var(--secondary)',
      'var(--accent)',
    ];

    for (let i = 0; i < numSquares; i++) {
      const square = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      square.style.cssText = `
        position: absolute;
        background: ${color};
        opacity: 0;
        width: 40px;
        height: 40px;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: fade ${duration}s ease-in-out ${Math.random() * duration}s infinite;
      `;

      squares.push(square);
      container.appendChild(square);
    }

    const keyframes = `
      @keyframes fade {
        0% { opacity: 0; transform: scale(0.5) rotate(0deg); }
        25% { opacity: ${maxOpacity}; transform: scale(1) rotate(90deg); }
        50% { opacity: ${maxOpacity}; transform: scale(1.2) rotate(180deg); }
        75% { opacity: ${maxOpacity}; transform: scale(1) rotate(270deg); }
        100% { opacity: 0; transform: scale(0.5) rotate(360deg); }
      }
    `;

    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);

    return () => {
      squares.forEach(square => square.remove());
      style.remove();
    };
  }, [numSquares, maxOpacity, duration, repeatDelay]);

  return (
    <div
      ref={containerRef}
      className={cn('absolute inset-0 overflow-hidden', className)}
    />
  );
}