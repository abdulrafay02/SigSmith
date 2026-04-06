import React, { useState } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'motion/react';
import { cn } from '@/lib/utils';

interface SpotlightWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  borderGlowColor?: string;
  radius?: number;
}

export const SpotlightWrapper = React.forwardRef<HTMLDivElement, SpotlightWrapperProps>(
  ({ children, className, glowColor = 'rgba(244,63,94,0.08)', borderGlowColor = 'rgba(244,63,94,0.3)', radius = 600, ...props }, ref) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
      props.onMouseMove?.(e);
    };

    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseEnter={(e) => { setIsHovering(true); props.onMouseEnter?.(e); }}
        onMouseLeave={(e) => { setIsHovering(false); props.onMouseLeave?.(e); }}
        className={cn("group relative overflow-hidden", className)}
        {...props}
      >
        <motion.div
          className="pointer-events-none absolute -inset-px z-0 rounded-[inherit]"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering ? 1 : 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            background: useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, ${glowColor}, transparent 80%)`
          }}
        />
        <motion.div
          className="pointer-events-none absolute -inset-px z-10 rounded-[inherit]"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovering ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            background: useMotionTemplate`radial-gradient(${radius * 0.6}px circle at ${mouseX}px ${mouseY}px, ${borderGlowColor}, transparent 80%)`,
            WebkitMaskImage: `linear-gradient(black, black)`,
            WebkitMaskClip: 'content-box',
            maskClip: 'content-box',
            padding: '1px'
          }}
        />
        <div className="relative z-20 h-full w-full">
          {children}
        </div>
      </div>
    );
  }
);
SpotlightWrapper.displayName = 'SpotlightWrapper';
