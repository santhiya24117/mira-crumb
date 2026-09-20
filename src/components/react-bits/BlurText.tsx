import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  threshold?: number;
  rootMargin?: string;
  onAnimationComplete?: () => void;
  as?: React.ElementType;
}

export default function BlurText({
  text,
  delay = 120,
  className = '',
  animateBy = 'words',
  direction = 'bottom',
  threshold = 0.1,
  rootMargin = '-50px',
  onAnimationComplete,
  as: Component = 'span',
}: BlurTextProps) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: threshold, margin: rootMargin as any });
  const shouldReduceMotion = useReducedMotion();

  // If reduced motion is requested, render static text with full accessibility
  if (shouldReduceMotion) {
    return (
      <Component className={`inline-block ${className}`}>
        {text}
      </Component>
    );
  }

  const yOffset = direction === 'top' ? -12 : 12;

  return (
    <Component
      ref={ref}
      className={`inline-block ${className}`}
      aria-label={text}
    >
      {elements.map((segment, index) => (
        <span
          key={index}
          className="inline-block whitespace-nowrap"
          aria-hidden="true"
        >
          <motion.span
            initial={{ filter: 'blur(8px)', opacity: 0, y: yOffset }}
            animate={
              inView
                ? { filter: 'blur(0px)', opacity: 1, y: 0 }
                : { filter: 'blur(8px)', opacity: 0, y: yOffset }
            }
            transition={{
              duration: 0.65,
              delay: (index * delay) / 1000,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            onAnimationComplete={
              index === elements.length - 1 ? onAnimationComplete : undefined
            }
            className="inline-block"
          >
            {segment}
          </motion.span>
          {animateBy === 'words' && index < elements.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </Component>
  );
}
