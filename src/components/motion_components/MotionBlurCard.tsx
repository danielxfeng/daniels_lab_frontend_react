import { ReactNode, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import { blurCardAnimation } from '@/lib/animations';

type MotionBlurCardProp = {
  children: ReactNode;
  className?: string;
  dataRole?: string;
};

/**
 * @summary A card component that fades in with a blur effect when it enters the viewport.
 */
const MotionBlurCard = ({ children, className, dataRole }: MotionBlurCardProp) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      className={className}
      data-role={dataRole}
      initial={blurCardAnimation.initial}
      animate={isInView ? blurCardAnimation.animate : {}}
      transition={blurCardAnimation.transition}
    >
      {children}
    </motion.div>
  );
};

export default MotionBlurCard;
