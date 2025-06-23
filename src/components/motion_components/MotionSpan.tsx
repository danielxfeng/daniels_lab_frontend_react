import { motion } from 'framer-motion';

import { spanAnimation } from '@/lib/animations';

/**
 * @summary MotionSpan component for animating text.
 * @description
 * The motion span component animates each character of the text
 * with a fade-in and blur effect. It is useful for creating dynamic text.
 * @param text - The text to animate.
 * @param className - The CSS class to apply to the span.
 * @param delay - The delay between character.
 */
const MotionSpan = ({
  text,
  className,
  delay = 0.03,
}: {
  text: string;
  className: string;
  delay?: number;
}) => {
  const textArray = text.split('');
  return (
    <span className={className} aria-hidden='true'>
      {textArray.map((word, index) => (
        <motion.span key={index} aria-hidden='true' {...spanAnimation(index, delay)}>
          {word}
        </motion.span>
      ))}
    </span>
  );
};

export default MotionSpan;
