import { useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'motion/react';

import { cn } from '@/lib/utils';

type MotionHoverWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

const radius = 100; // The radius of the circle

/**
 * @summary A wrapper to provide a hover effect with radial gradient background, based on:
 * @see https://ui.aceternity.com/components/signup-form
 *
 * @remarks
 * The idea is to wrap the component inside a `motion.div`,
 * and draw a radial background based on the mouse position.
 * Since the component covers most of the `motion.div`,
 * only the outer part of the gradient remains visible,
 * which looks a border effect.
 */
const MotionHoverWrapper = ({ children, className }: MotionHoverWrapperProps) => {
  const [visible, setVisible] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleMouseMove({ currentTarget, clientX, clientY }: any) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      style={{
        background: useMotionTemplate`
          radial-gradient(
            ${visible ? radius + 'px' : '0px'} circle at ${mouseX}px ${mouseY}px,
            var(--highlight),
            transparent 80%
          )
        `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className={cn('group/input rounded-xl p-[2px] transition duration-300', className)}
    >
      {children}
    </motion.div>
  );
};

export default MotionHoverWrapper;
