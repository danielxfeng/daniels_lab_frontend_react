import React, { useState } from 'react';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

/**
 * @summary Motion Card component, based on:
 * @see https://ui.aceternity.com/components/wobble-card
 */
const MotionWobbleCard = ({
  children,
  containerClassName,
  className,
}: {
  children: React.ReactNode;
  containerClassName?: string;
  className?: string;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = event;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (clientX - (rect.left + rect.width / 2)) / 20;
    const y = (clientY - (rect.top + rect.height / 2)) / 20;
    setMousePosition({ x, y });
  };
  return (
    <motion.div
      data-role='motion-card'
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        transform: isHovering
          ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0) scale3d(1, 1, 1)`
          : 'translate3d(0px, 0px, 0) scale3d(1, 1, 1)',
        transition: 'transform 0.1s ease-out',
      }}
      className={cn(
        'hover:shadow-large relative mx-auto w-full overflow-hidden rounded-xl shadow-md hover:bg-white dark:hover:bg-neutral-950',
        containerClassName,
      )}
    >
      <motion.div
        style={{
          transform: isHovering
            ? `translate3d(${-mousePosition.x}px, ${-mousePosition.y}px, 0) scale3d(1.03, 1.03, 1)`
            : 'translate3d(0px, 0px, 0) scale3d(1, 1, 1)',
          transition: 'transform 0.1s ease-out',
        }}
        className={cn('h-full px-4 py-4 lg:py-20', className)}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default MotionWobbleCard;
