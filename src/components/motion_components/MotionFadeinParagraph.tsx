import { ReactNode, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import { fadeInUp } from '@/lib/animations';

type MotionFadeInParagraphProp = {
  children: ReactNode;
  className?: string;
  dataRole?: string;
};

const MotionFadeInParagraph = ({ children, className, dataRole }: MotionFadeInParagraphProp) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: '-100px', once: true });

  return (
    <motion.p
      ref={ref}
      className={className}
      data-role={dataRole}
      initial={fadeInUp.initial}
      animate={isInView ? fadeInUp.animate : {}}
      transition={fadeInUp.transition}
    >
      {children}
    </motion.p>
  );
};

export default MotionFadeInParagraph;
