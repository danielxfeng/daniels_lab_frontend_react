import type { ComponentProps } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { linkAnimation } from '@/lib/animations';
import { cn } from '@/lib/utils';
interface MotionTextLinkProps extends ComponentProps<'a'> {
  to: string;
  label: string;
  isExternal: boolean;
  className?: string;
  variant?: 'default' | 'traditional';
}

/**
 * @summary MotionTextLink component
 */
const MotionTextLink = ({
  to,
  label,
  isExternal,
  className,
  variant,
  ...props
}: MotionTextLinkProps) => {
  const content = (
    <motion.span
      {...linkAnimation}
      className={cn(
        variant === 'traditional'
          ? 'text-highlight hover:text-highlight/80 underline decoration-[2px] underline-offset-2 transition-all hover:underline-offset-4'
          : 'hover:text-highlight transition-all hover:underline',
        className,
      )}
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
