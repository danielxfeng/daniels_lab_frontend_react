import { motion } from 'framer-motion';

import { spanAnimation } from '@/lib/animations';
import { cn } from '@/lib/utils';

type MotionSpanProps = {
  text: string;
  className: string;
  delay?: number;
  spanClassNames?: string[];
};

/**
 * @summary MotionSpan component for animating text.
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
  return (
    <span className={className} aria-hidden='true'>
      {textArray.map((char, index) => (
        <motion.span
          key={index}
          aria-hidden='true'
          className={cn(spanClassNames[index] ?? '')}
          {...spanAnimation(index, delay)}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
};

export default MotionSpan;
