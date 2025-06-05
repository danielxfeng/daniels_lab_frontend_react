import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';
import { hoverOpacity, tapEffect } from '@/lib/animations';

interface MotionTextButtonLinkProps extends ComponentProps<'a'> {
  to: string;
  label: string;
  ariaLabel: string;
  isExternal?: boolean;
  className?: string;
  disabled?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state?: any;
}

/**
 * @summary MotionTextButtonLink component
 * @description A button-styled text link with framer-motion animation.
 * @param to - The destination URL
 * @param label - The text shown inside the button
 * @param ariaLabel - Aria label for accessibility
 * @param isExternal - Whether to use an external `<a>` link or internal `<Link>`
 * @param className - Additional classes for styling
 * @param disabled - Whether the button is disabled
 */
const MotionTextButtonLink = ({
  to,
  label,
  ariaLabel,
  isExternal = false,
  className,
  disabled = false,
  state,
}: MotionTextButtonLinkProps) => {
  const content = (
    <motion.button
      whileHover={!disabled ? hoverOpacity : undefined}
      whileTap={!disabled ? tapEffect : undefined}
      className={cn(
        'text-background bg-gradient; shadow-primary/20 rounded-lg px-6 py-2 text-center shadow transition-all',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50',
        className,
      )}
      aria-label={ariaLabel}
      type='button'
      disabled={disabled}
      aria-disabled={disabled}
    >
      {label}
    </motion.button>
  );

  return isExternal ? (
    <a
      href={to}
      target='_blank'
      rel='noopener noreferrer'
      className={className?.includes('w-full') ? 'w-full' : undefined}
    >
      {content}
    </a>
  ) : (
    <Link to={to} state={state} className={className?.includes('w-full') ? 'w-full' : undefined}>
      {content}
    </Link>
  );
};

export default MotionTextButtonLink;
