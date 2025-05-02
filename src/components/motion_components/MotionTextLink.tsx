import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';
import { hoverEffect, springEffect, tapEffect } from '@/lib/animations';

interface MotionTextLinkProps extends ComponentProps<'a'> {
  to: string;
  label: string;
  isExternal: boolean;
  className?: string;
}

/**
 * @summary MotionTextLink component
 * @description A link component that uses framer-motion for animations.
 * @param to - The URL to link to
 * @param label - The text to be displayed as the link
 * @param isExternal - Whether the link is external or internal
 * @param className - Additional classes for styling
 * @param props - Additional props to be passed to the link
 * @returns A link component with framer-motion animations
 */
const MotionTextLink = ({ to, label, isExternal, className, ...props }: MotionTextLinkProps) => {
  const content = (
    <motion.span
      whileHover={hoverEffect}
      whileTap={tapEffect}
      transition={springEffect}
      className={cn('transition-all hover:underline', className)}
    >
      {label}
    </motion.span>
  );

  return isExternal ? (
    <a href={to} target='_blank' rel='noopener noreferrer' aria-label={label} {...props}>
      {content}
    </a>
  ) : (
    <Link to={to} aria-label={label} {...props}>
      {content}
    </Link>
  );
};

export default MotionTextLink;
