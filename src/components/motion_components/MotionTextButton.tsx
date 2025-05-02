import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { ButtonHTMLAttributes } from 'react';
import { hoverOpacity, tapEffect } from '@/lib/animations';

interface MotionTextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  ariaLabel: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

/**
 * @summary MotionTextButton component
 * @param label - The text to be displayed as the button
 * @param ariaLabel - The aria-label for accessibility
 * @param type - The type of the button (button, submit, reset)
 * @param onClick - The function to be called when the button is clicked
 * @param className - Additional classes for styling
 * @param disabled - Whether the button is disabled
 * @returns A button component with framer-motion animations
 */
const MotionTextButton = ({
  label,
  ariaLabel,
  type,
  onClick,
  className,
  disabled = false,
}: MotionTextButtonProps) => {
  return (
    <motion.button
      whileHover={!disabled ? hoverOpacity : undefined}
      whileTap={!disabled ? tapEffect : undefined}
      onClick={onClick}
      className={cn(
        'text-primary bg-transparent underline-offset-4 transition-all hover:underline',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50',
        className,
      )}
      aria-label={ariaLabel}
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {label}
    </motion.button>
  );
};

export default MotionTextButton;
