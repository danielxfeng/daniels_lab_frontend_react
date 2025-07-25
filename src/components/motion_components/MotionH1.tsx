import type { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

import { h1Animation } from '@/lib/animations';
import { cn } from '@/lib/utils';

// a motion h1 component that uses framer-motion for animations
const MotionH1 = ({
  children,
  className,
}: HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }) => {
  return (
    <motion.h1 {...h1Animation} className={cn(className)}>
      {children}
    </motion.h1>
  );
};

export default MotionH1;
