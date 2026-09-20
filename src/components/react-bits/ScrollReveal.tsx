import React, { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  distance?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  blur?: boolean;
  threshold?: number;
  once?: boolean;
  as?: React.ElementType;
}

export default function ScrollReveal({
  id,
  children,
  className = '',
  delay = 0,
  duration = 0.7,
  distance = 20,
  direction = 'up',
  blur = true,
  threshold = 0.15,
  once = true,
  as: Component = 'div',
  ...rest
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount: threshold });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <Component id={id} className={className} {...rest}>{children}</Component>;
  }

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, x: 0 };
      case 'down':
        return { y: -distance, x: 0 };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      case 'none':
      default:
        return { x: 0, y: 0 };
    }
  };

  const initialPos = getInitialPosition();

  const MotionComponent = motion.create(Component as any);

  return (
    <MotionComponent
      ref={ref}
      id={id}
      className={className}
      {...rest}
      initial={{
        opacity: 0,
        ...initialPos,
        filter: blur ? 'blur(4px)' : 'none',
      }}
      animate={
        inView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              filter: 'blur(0px)',
            }
          : {
              opacity: 0,
              ...initialPos,
              filter: blur ? 'blur(4px)' : 'none',
            }
      }
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
    >
      {children}
    </MotionComponent>
  );
}
