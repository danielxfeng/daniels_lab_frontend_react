import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';
import { Link } from 'react-router-dom';
import { hoverOpacity, tapEffect } from '@/lib/animations';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type MotionIconLinkProps = {
  to: string;
  icon: React.ReactNode;
  className?: string;
  ariaLabel: string;
  isExternal: boolean;
  tooltip?: string;
} & Omit<ComponentProps<'a'>, 'href'>;

// Helper component for external links
const ExternalLink = ({
  to,
  icon,
  ariaLabel,
  ...props
}: {
  to: string;
  icon: React.ReactNode;
  ariaLabel: string;
} & Omit<ComponentProps<'a'>, 'href' | 'aria-label'>) => (
  <a
    href={to}
    target='_blank'
    rel='noopener noreferrer'
    className='inline-flex items-center justify-center transition-all'
    aria-label={ariaLabel}
    {...props}
  >
    {icon}
  </a>
);

// Helper component for Internal links
const InternalLink = ({
  to,
  icon,
  ariaLabel,
  ...props
}: {
  to: string;
  icon: React.ReactNode;
  ariaLabel: string;
} & Omit<ComponentProps<'a'>, 'href' | 'aria-label'>) => (
  <Link
    to={to}
    className='inline-flex items-center justify-center transition-all'
    aria-label={ariaLabel}
    {...props}
  >
    {icon}
  </Link>
);

// A link component without tooltip
const LinkWithoutTooltip = ({
  to,
  icon,
  className,
  ariaLabel,
  isExternal = false,
  ...props
}: MotionIconLinkProps) => {
  return (
    <motion.div
      whileHover={hoverOpacity}
      whileTap={tapEffect}
      className={cn('flex items-center', className)}
    >
      {isExternal ? (
        <ExternalLink to={to} icon={icon} ariaLabel={ariaLabel} {...props} />
      ) : (
        <InternalLink to={to} icon={icon} ariaLabel={ariaLabel} {...props} />
      )}
    </motion.div>
  );
};

/**
 * @summary MotionIconLink component
 * @description A link component that uses framer-motion for animations.
 * It scales up on hover and scales down on tap.
 * It can be used for both internal and external links.
 * @param to - The URL to link to.
 * @param icon - The icon to be displayed inside the link.
 * @param className - Additional class names for styling.
 * @param ariaLabel - The aria-label for accessibility.
 * @param external - Whether the link is external or not. If not provided, it will be determined based on the URL.
 * @param props - Additional props for the link.
 */
const MotionIconLink = ({
  to,
  icon,
  className,
  ariaLabel,
  isExternal = false,
  tooltip,
  ...props
}: MotionIconLinkProps) =>
  tooltip ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <LinkWithoutTooltip
          to={to}
          icon={icon}
          className={className}
          ariaLabel={ariaLabel}
          isExternal={isExternal}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  ) : (
    <LinkWithoutTooltip
      to={to}
      icon={icon}
      className={className}
      ariaLabel={ariaLabel}
      isExternal={isExternal}
      {...props}
    />
  );

export default MotionIconLink;
