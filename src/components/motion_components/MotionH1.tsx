import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { HTMLAttributes, ReactNode } from 'react';
import { slideIn, springEffect } from '@/lib/animations';

const MotionH1 = ({
  children,
  className,
}: HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }) => {
  return (
    <motion.h1 {...slideIn} transition={springEffect} className={cn(className)}>
      {children}
    </motion.h1>
  );
};

export default MotionH1;
