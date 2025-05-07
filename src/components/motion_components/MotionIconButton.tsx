import { HTMLMotionProps, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { hoverOpacity, tapEffect } from '@/lib/animations';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type MotionIconButtonProps = {
  icon: React.ReactNode;
  ariaLabel: string;
  type?: 'button' | 'submit' | 'reset';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  tooltip?: string;
  isLoading?: boolean;
} & Omit<HTMLMotionProps<'button'>, 'ref'>;

const BtnWithoutTooltip = ({
  icon,
  ariaLabel,
  type = 'button',
  onClick,
  className,
  disabled = false,
  isLoading = false,
  ...prop
}: MotionIconButtonProps & Omit<HTMLMotionProps<'button'>, 'ref'>) => (
  <motion.button
    whileHover={!disabled && !isLoading ? hoverOpacity : undefined}
    whileTap={!disabled && !isLoading ? tapEffect : undefined}
    onClick={onClick}
    aria-label={ariaLabel}
    className={cn(
      'text-primary bg-transparent underline-offset-4 transition-all hover:underline',
      (disabled || isLoading) && 'pointer-events-none cursor-not-allowed opacity-50',
      className,
    )}
    type={type}
    disabled={disabled || isLoading}
    aria-disabled={disabled || isLoading}
    aria-busy={isLoading}
    {...prop}
  >
    {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : icon}
  </motion.button>
);

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
 * @param tooltip - The tooltip content to be displayed on hover
 */
const MotionIconButton = ({
  icon,
  ariaLabel,
  type,
  onClick,
  className,
  disabled = false,
  tooltip,
  isLoading = false,
  ...props
}: MotionIconButtonProps & Omit<HTMLMotionProps<'button'>, 'ref'>) =>
  tooltip ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <BtnWithoutTooltip
          icon={icon}
          ariaLabel={ariaLabel}
          type={type}
          onClick={onClick}
          className={className}
          disabled={disabled}
          isLoading={isLoading}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  ) : (
    <BtnWithoutTooltip
      icon={icon}
      ariaLabel={ariaLabel}
      type={type}
      onClick={onClick}
      className={className}
      disabled={disabled}
      isLoading={isLoading}
      {...props}
    />
  );

export default MotionIconButton;
