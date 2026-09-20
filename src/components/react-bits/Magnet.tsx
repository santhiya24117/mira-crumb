import React, { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface MagnetProps {
  children: React.ReactNode;
  className?: string;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: { type: string; damping?: number; stiffness?: number; mass?: number };
  inactiveTransition?: { type: string; damping?: number; stiffness?: number; mass?: number };
}

export default function Magnet({
  children,
  className = '',
  padding = 60,
  disabled = false,
  magnetStrength = 3,
  activeTransition = { type: 'spring', damping: 15, stiffness: 150, mass: 0.1 },
  inactiveTransition = { type: 'spring', damping: 12, stiffness: 120, mass: 0.2 },
}: MagnetProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const magnetRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Detect touch / coarse pointer devices where magnetic hover is irrelevant
    if (typeof window !== 'undefined') {
      const isCoarse = window.matchMedia('(pointer: coarse)').matches;
      setIsTouchDevice(isCoarse);
    }
  }, []);

  const isDisabled = disabled || isTouchDevice || shouldReduceMotion;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDisabled || !magnetRef.current) return;

    const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distX = Math.abs(centerX - e.clientX);
    const distY = Math.abs(centerY - e.clientY);

    // Only engage magnetic pull within target radius
    if (distX < width / 2 + padding && distY < height / 2 + padding) {
      setIsHovered(true);
      const offsetX = (e.clientX - centerX) / magnetStrength;
      const offsetY = (e.clientY - centerY) / magnetStrength;
      setPosition({ x: offsetX, y: offsetY });
    } else {
      setIsHovered(false);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  if (isDisabled) {
    return <div className={`inline-block ${className}`}>{children}</div>;
  }

  return (
    <div
      ref={magnetRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`inline-block ${className}`}
    >
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={isHovered ? activeTransition : inactiveTransition}
      >
        {children}
      </motion.div>
    </div>
  );
}
