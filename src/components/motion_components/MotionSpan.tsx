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
 * @description
 * The motion span component animates each character of the text
 * with a fade-in and blur effect. It is useful for creating dynamic text.
 * @param text - The text to animate.
 * @param className - The CSS class to apply to the span.
 * @param delay - The delay between character.
 * @param spanClassNames - the CSS classes to apply to characters.
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
