import { motion } from 'framer-motion';
import type { ButtonHTMLAttributes } from 'react';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { hoverOpacity, tapEffect } from '@/lib/animations';
interface MotionTextButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  ariaLabel: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
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
  isLoading = false,
}: MotionTextButtonProps) => {
  const isButtonDisabled = disabled || isLoading;

  return (
    <motion.button
      whileHover={!isButtonDisabled ? hoverOpacity : undefined}
      whileTap={!isButtonDisabled ? tapEffect : undefined}
      onClick={onClick}
      className={cn(
        'text-background bg-highlight relative inline-flex items-center justify-center rounded-lg px-6 py-2 transition-all',
        isButtonDisabled && 'pointer-events-none cursor-not-allowed opacity-50',
        className,
      )}
      aria-label={ariaLabel}
      type={type}
      disabled={isButtonDisabled}
      aria-disabled={isButtonDisabled}
      aria-busy={isLoading}
    >
      <span className={cn(isLoading && 'invisible')}>{label}</span>

      {isLoading && (
        <span className='absolute inset-0 flex items-center justify-center'>
          <Loader className='text-muted-foreground h-4 w-4 animate-spin' />
        </span>
      )}
    </motion.button>
  );
};

export default MotionTextButton;
