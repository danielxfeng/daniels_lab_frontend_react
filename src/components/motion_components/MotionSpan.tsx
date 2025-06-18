import { motion } from 'framer-motion';

import { spanAnimation } from '@/lib/animations';

/**
 * @summary MotionSpan component for animating text.
 * @description
 * The motion span component animates each character of the text
 * with a fade-in and blur effect. It is useful for creating dynamic text.
 * @param text - The text to animate.
 * @param className - The CSS class to apply to the span.
 */
const MotionSpan = ({ text, className }: { text: string; className: string }) => {
  const textArray = text.split('');
  return (
    <span className={className} aria-hidden='true'>
      {textArray.map((word, index) => (
        <motion.span key={index} aria-hidden='true' {...spanAnimation(index)}>
          {word}
        </motion.span>
      ))}
    </span>
  );
};

export default MotionSpan;
