// Inspired by https://ui.aceternity.com/components/tracing-beam
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';

import { cn } from '@/lib/utils';

// A component that creates a scroll-based motion effect with a gradient line
const MotionScroll = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 90px', 'end start'],
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const [svgHeight, setSvgHeight] = useState(0);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => {
      setSvgHeight(element.offsetHeight);
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const y1 = useSpring(useTransform(scrollYProgress, [0, 0.8], [90, svgHeight + 100]), {
    stiffness: 500,
    damping: 90,
  });
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [90, svgHeight]), {
    stiffness: 500,
    damping: 90,
  });

  return (
    <motion.div ref={ref} className={cn('relative mx-auto h-full w-full max-w-4xl', className)}>
      <div className='absolute top-3 -left-4 lg:-left-20'>
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width='20'
          height={svgHeight} // Set the SVG height
          className='ml-4 block'
          aria-hidden='true'
        >
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill='none'
            stroke='#9091A0'
            strokeOpacity='0.16'
            transition={{
              duration: 10,
            }}
          ></motion.path>
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill='none'
            stroke='url(#gradient)'
            strokeWidth='1.25'
            className='motion-reduce:hidden'
            transition={{
              duration: 10,
            }}
          ></motion.path>
          <defs>
            <motion.linearGradient
              id='gradient'
              gradientUnits='userSpaceOnUse'
              x1='0'
              x2='0'
              y1={y1} // set y1 for gradient
              y2={y2} // set y2 for gradient
            >
              <stop stopColor='#18CCFC' stopOpacity='0'></stop>
              <stop stopColor='#18CCFC'></stop>
              <stop offset='0.325' stopColor='#6344F5'></stop>
              <stop offset='1' stopColor='#AE48FF' stopOpacity='0'></stop>
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </motion.div>
  );
};
export default MotionScroll;
