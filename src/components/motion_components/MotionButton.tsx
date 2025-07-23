/**
 * @file MotionButton.tsx
 */

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { HTMLMotionProps, motion } from 'framer-motion';
import { Loader } from 'lucide-react';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { btnAnimation, loaderAnimation } from '@/lib/animations';
import { cn } from '@/lib/utils';

type ButtonSize = 'sm' | 'md' | 'lg';
type ButtonType = 'button' | 'submit';
type ButtonVariant = 'highlight' | 'primary' | 'secondary' | 'ghost' | 'destructive' | 'tag';
type IconPosition = 'left' | 'right';

type CommonProps = {
  supportingText: string;
  size: ButtonSize;
  variant: ButtonVariant;
  dataRole: string;
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
  state?: object;
} & CommonProps;

type MotionButtonProps = MotionSubmitButtonProps | MotionLinkButtonProps;

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 text-sm',
  md: 'h-10 text-base',
  lg: 'h-12 text-lg',
};

const widthClasses: Record<ButtonSize, string> = {
  sm: 'px-3',
  md: 'px-4',
  lg: 'px-5',
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
};

// For primary and highlight buttons, or icon-only buttons, border is not applied. Otherwise, border is applied.
const getVariantClasses = (
  variant: ButtonVariant,
  text: string | undefined,
  size: ButtonSize,
  btnClass?: string,
  isFullWidth?: boolean,
): string => {
  // border is not applied if the button is Icon-only.
  const border = text && !btnClass?.includes('border-none') && 'border';
  const width = isFullWidth ? 'w-full' : text ? widthClasses[size] : 'aspect-square';

  switch (variant) {
    case 'highlight':
      return cn(
        'bg-gradient text-highlight-foreground shadow-highlight/20 shadow hover:shadow-highlight/30 transition-colors duration-150 ease-out',
        width,
      );
    case 'primary':
      return cn(
        'bg-primary text-primary-foreground hover:text-highlight transition-colors duration-150 ease-out',
        width,
      );
    case 'secondary':
      return cn(
        'border-border bg-transparent text-foreground hover:text-highlight transition-colors duration-150 ease-out',
        border,
        width,
      );
    case 'ghost':
      return cn(
        'border-border bg-transparent text-muted-foreground hover:text-highlight transition-colors duration-150 easeInOut',
        border,
        width,
      );
    case 'destructive':
      return cn(
        'border-destructive text-destructive bg-transparent hover:bg-destructive/5 transition-colors duration-150 easeInOut',
        border,
        width,
      );
    case 'tag':
      return cn(
        'h-6 border-border text-muted-foreground bg-transparent px-2.5 border py-0 rounded-2xl  hover:text-highlight hover:border-highlight transition-colors duration-150 easeInOut',
      );
    default:
      return '';
  }
};

// To pass the rest props to `btn`.
const getRestProps = (
  props: MotionButtonProps,
): HTMLMotionProps<'button'> | HTMLMotionProps<'a'> => {
  /* eslint-disable @typescript-eslint/no-unused-vars */ // To avoid unused variable warnings
  const {
    supportingText,
    size,
    variant,
    isFullWidth,
    iconPosition,
    icon,
    text,
    btnClass,
    iconClass,
    textClass,
    dataRole,
    ...restProps
  } = props;

  if ('buttonType' in props) {
    const { buttonType, isLoading, isDisabled, ...restBtnProps } =
      restProps as MotionSubmitButtonProps;
    return restBtnProps;
  }

  const { isExternal, to, ...restLinkProps } = restProps as MotionLinkButtonProps;
  /* eslint-enable @typescript-eslint/no-unused-vars */
  return restLinkProps;
};

const BaseButton = (props: MotionButtonProps) => {
  // disabled is true if the button is loading or disabled, only applicable for submit buttons.
  const disabled = 'buttonType' in props ? props.isDisabled || props.isLoading : undefined;

  const fullWidth = props.isFullWidth ? 'w-full' : '';
  const iconPosition = props.iconPosition === 'right' ? 'flex-row-reverse' : 'flex-row';

  // The class for the button, combining size, variant, and other classes
  const btnClass = cn(
    'relative inline-flex items-center justify-center rounded-lg transition-all cursor-pointer',
    sizeClasses[props.size],
    getVariantClasses(props.variant, props.text, props.size, props.btnClass, props.isFullWidth),
    props.btnClass,
    fullWidth,
    disabled && 'pointer-events-none cursor-not-allowed opacity-50', // Apply styles when the button is disabled
  );

  // The animation for the button, depending on the variant and whether it is disabled
  const animation = disabled ? undefined : btnAnimation(props.variant);

  // The icon and text inside the button
  const child = (
    <span
      className={cn(
        'flex items-center gap-[0.5em]',
        'buttonType' in props && props.isLoading && 'invisible',
        iconPosition,
      )}
    >
      {props.icon && (
        <span
          className={cn(
            'inline-flex items-center justify-center',
            iconSizeClasses[props.size],
            props.iconClass,
          )}
        >
          {props.icon}
        </span>
      )}
      {props.text && <span className={cn(props.textClass)}>{props.text}</span>}
    </span>
  );

  const restProps = getRestProps(props);
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
        data-role={props.dataRole}
        {...animation}
        {...(restProps as HTMLMotionProps<'button'>)}
      >
        {props.isLoading && (
          <motion.span {...loaderAnimation} className='inline-flex items-center'>
            <Loader className={cn('text-muted-foreground', iconSizeClasses[props.size])} />
          </motion.span>
        )}
        {child}
      </motion.button>
    );

  // link component
  const Cmp = props.isExternal ? motion.a : motion.create(Link);

  return (
    <Cmp
      className={btnClass}
      aria-label={props.supportingText}
      data-role={props.dataRole}
      {...animation}
      {...(props.isExternal
        ? { href: props.to, target: '_blank', rel: 'noopener noreferrer' }
        : { to: props.to, state: props.state })}
      {...(restProps as HTMLMotionProps<'a'>)}
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
  MotionLinkButtonProps,
  MotionSubmitButtonProps,
};
