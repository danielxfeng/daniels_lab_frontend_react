/**
 * @file MotionButton.tsx
 * @description
 * A button component:
 *  - uses framer-motion for animations;
 *  - supports `button` and `link` types;
 *  - supports icons and text, with customizable positions;
 *  - supports both icon-only buttons and mixed content (icon and text).
 *  - supports both internal and external links.
 *  - supports different sizes, variants, and states (loading, disabled);
 *  - supports tooltips for accessibility;
 *  - supports full-width buttons;
 */

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { HTMLMotionProps, motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { btnAnimation, btnPrimaryAnimation, loaderAnimation } from '@/lib/animations';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonType = 'button' | 'submit';
type ButtonVariant = 'highlight' | 'primary' | 'secondary' | 'ghost' | 'destructive';
type IconPosition = 'left' | 'right';

type CommonProps = {
  supportingText: string;
  size: ButtonSize;
  variant: ButtonVariant;
  isFullWidth?: boolean;
  iconPosition?: IconPosition;
  icon?: ReactNode;
  text?: string;
  btnClass?: string;
  iconClass?: string;
  textClass?: string;
} & Omit<HTMLMotionProps<'button'>, 'ref'>;

type MotionSubmitButtonProps = {
  buttonType: ButtonType;
  isLoading?: boolean;
  isDisabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & CommonProps;

type MotionLinkButtonProps = {
  to: string;
  isExternal: boolean;
  state?: string;
} & CommonProps;

type MotionButtonProps = MotionSubmitButtonProps | MotionLinkButtonProps;

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-4 w-4',
  lg: 'h-6 w-6',
};

// For primary and highlight buttons, or icon-only buttons, border is not applied. Otherwise, border is applied.
const getVariantClasses = (variant: ButtonVariant, text: string | undefined): string => {
  // border is not applied if the button is Icon-only.
  const border = text && 'border';

  switch (variant) {
    case 'highlight':
      return 'bg-gradient text-highlight-foreground shadow-highlight/20 shadow hover:shadow-highlight/30 transition-colors duration-150 ease-out';
    case 'primary':
      return 'bg-primary text-primary-foreground shadow-primary/20 shadow hover:shadow-primary/30 transition-colors duration-150 ease-out';
    case 'secondary':
      return cn(
        'border-border bg-transparent text-foreground hover:bg-foreground/5 transition-colors duration-150 ease-out',
        border,
      );
    case 'ghost':
      return cn(
        'bg-transparent text-muted-foreground hover:bg-foreground/5 transition-colors duration-150 easeInOut',
        border,
      );
    case 'destructive':
      return cn(
        'border-destructive text-destructive bg-transparent hover:bg-destructive/5 transition-colors duration-150 easeInOut',
        border,
      );
    default:
      return '';
  }
};

const BaseButton = (props: MotionButtonProps) => {
  // disabled is true if the button is loading or disabled, only applicable for submit buttons.
  const disabled = 'buttonType' in props ? props.isDisabled || props.isLoading : undefined;

  const fullWidth = props.isFullWidth ? 'w-full' : '';
  const iconPosition = props.iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row';

  // The class for the button, combining size, variant, and other classes
  const btnClass = cn(
    'relative inline-flex items-center justify-center rounded-md transition-all',
    sizeClasses[props.size],
    getVariantClasses(props.variant, props.text),
    disabled && 'pointer-events-none cursor-not-allowed opacity-50',
    props.btnClass,
  );

  // The animation for the button, depending on the variant and whether it is disabled
  const animation = disabled
    ? undefined
    : props.variant === 'primary' || props.variant === 'highlight'
      ? btnPrimaryAnimation
      : btnAnimation;

  // The icon and text inside the button
  const child = (
    <span
      className={cn(
        'flex items-center',
        'buttonType' in props && props.isLoading && 'invisible',
        fullWidth,
        iconPosition,
      )}
    >
      {props.icon && (
        <span
          className={cn('inline-flex items-center', props.iconClass, iconSizeClasses[props.size])}
        >
          {props.icon}
        </span>
      )}
      {props.text && <span className={cn(props.textClass)}>{props.text}</span>}
    </span>
  );

  // button component
  if ('buttonType' in props)
    return (
      <motion.button
        className={btnClass}
        type={props.buttonType}
        disabled={disabled}
        aria-label={props.supportingText}
        aria-disabled={disabled}
        aria-busy={props.isLoading}
        onClick={props.onClick}
        {...animation}
      >
        {props.isLoading && (
          <motion.span {...loaderAnimation}>
            <Loader className={cn('text-muted-foreground', iconSizeClasses[props.size])} />
          </motion.span>
        )}
        {child}
      </motion.button>
    );

  // link component
  const Cmp = props.isExternal ? motion.a : motion(Link);

  return (
    <Cmp
      className={btnClass}
      aria-label={props.supportingText}
      {...animation}
      {...(props.isExternal
        ? { href: props.to, target: '_blank', rel: 'noopener noreferrer' }
        : { to: props.to, state: props.state })}
    >
      {child}
    </Cmp>
  );
};

/**
 * @summary A button component with animations.
 * @description
 * Style:
 *  - For primary and highlight buttons, it uses a foreground color as the background and a shadow effect.
 *  - For other buttons, it uses a transparent background, and for not icon-only buttons, it applies a border.
 *  - There are 2 types of animations: one for primary and highlight buttons, and another for other buttons.
 *
 * @param props - The properties for the button.
 * @param props.supportingText - The supporting text for the button.
 * @param props.size - The size of the button (sm, md, lg).
 * @param props.variant - The variant of the button (highlight, primary, secondary, ghost, destructive).
 * @param props.icon - The optional icon to be displayed inside the button. Icon and text can not be null at the same time.
 * @param props.text - The optional text to be displayed inside the button. Icon and text can not be null at the same time.
 * @param props.isFullWidth - Whether the button should take the full width of its container.
 * @param props.iconPosition - The position of the icon relative to the text (left, right).
 * @param props.btnClass - Additional classes for the button.
 * @param props.iconClass - Additional classes for the icon.
 * @param props.textClass - Additional classes for the text.
 * @param props.buttonType - The type of the button (button, submit), only applicable for submit buttons.
 * @param props.onClick - The function to be called when the button is clicked, only applicable for submit buttons.
 * @param props.isLoading - Whether the button is in a loading state, only applicable for submit buttons.
 * @param props.isDisabled - Whether the button is disabled, only applicable for submit buttons.
 * @param props.to - The URL to navigate to, only applicable for link buttons.
 * @param props.isExternal - Whether the link button opens in a new tab, only applicable for link buttons.
 * @param props.state - Optional state to be passed to the link, only applicable for link buttons.
 * @returns
 */
const MotionButton = (props: MotionButtonProps) => {
  if (!props.icon && !props.text)
    throw new Error('MotionButton: either icon or text must be provided.');

  // If the text is provided, then tooltip is not needed.
  if (props.text) return <BaseButton {...props} />;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <BaseButton {...props} />
      </TooltipTrigger>
      <TooltipContent>{props.supportingText}</TooltipContent>
    </Tooltip>
  );
};

export default MotionButton;

export type {
  ButtonSize,
  ButtonType,
  ButtonVariant,
  MotionSubmitButtonProps,
  MotionLinkButtonProps,
};
