import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import { spanAnimation } from '@/lib/animations';
import { cn } from '@/lib/utils';

type MotionSpanProps = {
  text: string;
  className: string;
  delay?: number;
  spanClassNames?: string[];
};

/**
 * @summary MotionSpan component for animating text when it enters the viewport.
 */
const MotionSpan = ({ text, className, delay = 0.03, spanClassNames = [] }: MotionSpanProps) => {
  const textArray = text.split('');
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-50px' });
  return (
    <>
      <span ref={ref} className={className} aria-hidden='true'>
        {textArray.map((char, index) => {
          const animation = spanAnimation(index, delay);
          return (
            <motion.span
              key={index}
              aria-hidden='true'
              className={cn(spanClassNames[index] ?? '')}
              initial={animation.initial}
              animate={isInView ? animation.animate : 'hidden'}
              variants={animation.variants}
            >
              {char}
            </motion.span>
          );
        })}
      </span>
      <span className='sr-only'>{text}</span>
    </>
  );
};

export default MotionSpan;
