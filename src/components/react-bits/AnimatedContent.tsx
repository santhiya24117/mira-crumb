import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

interface AnimatedContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  distance?: number;
  direction?: 'vertical' | 'horizontal';
  reverse?: boolean;
  duration?: number;
  delay?: number;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  className?: string;
  once?: boolean;
  key?: React.Key;
}

export default function AnimatedContent({
  children,
  distance = 20,
  direction = 'vertical',
  reverse = false,
  duration = 0.6,
  delay = 0,
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.1,
  className = '',
  once = true,
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount: threshold });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const offset = reverse ? -distance : distance;
  const initialTransform =
    direction === 'vertical'
      ? { y: offset, x: 0 }
      : { x: offset, y: 0 };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: animateOpacity ? initialOpacity : 1,
        ...initialTransform,
        scale: scale < 1 ? scale : 1,
      }}
      animate={
        inView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            }
          : {
              opacity: animateOpacity ? initialOpacity : 1,
              ...initialTransform,
              scale: scale < 1 ? scale : 1,
            }
      }
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
