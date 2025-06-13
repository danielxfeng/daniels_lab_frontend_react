import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';
import { h1Animation } from '@/lib/animations';

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
