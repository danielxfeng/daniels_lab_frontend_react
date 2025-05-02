import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { hoverEffect, tapEffect, springEffect } from '@/lib/animations';

type MotionIconButtonProps = {
  icon: React.ReactNode;
  ariaLabel: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

/**
 * MotionIconButton is a button component that uses framer-motion for animations.
 * It scales up on hover and scales down on tap.
 *
 * @param icon - The icon to be displayed inside the button.
 * @param ariaLabel - The aria-label for accessibility
 * @param type - The type of the button (button, submit, reset)
 * @param onClick - The function to be called when the button is clicked
 * @param className - Additional classes for styling
 * @param disabled - Whether the button is disabled
 */
const MotionIconButton = ({
  icon,
  ariaLabel,
  type,
  onClick,
  className,
  disabled = false,
}: MotionIconButtonProps) => {
  return (
    <motion.button
      whileHover={!disabled ? hoverEffect : undefined}
      whileTap={!disabled ? tapEffect : undefined}
      transition={!disabled ? springEffect : undefined}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'text-primary bg-transparent underline-offset-4 transition-all hover:underline',
        disabled && 'pointer-events-none cursor-not-allowed opacity-50',
        className,
      )}
      type={type}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {icon}
    </motion.button>
  );
};

export default MotionIconButton;
