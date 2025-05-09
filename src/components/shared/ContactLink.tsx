import React from 'react';
import MotionIconLink from '@/components/motion_components/MotionIconLink';

/**
 * Type definition for the ContactLink component props.
 */
type ContactLinkProps = {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string;
  ariaLabel: string;
  className?: string;
};

/**
 * A reusable component for rendering a contact link with an icon.
 * @param - Icon: The icon component to be rendered
 * @param - href: The URL to link to
 * @param - ariaLabel: The aria-label for accessibility
 * @param - className: Additional classes for styling
 * @returns An reusable contact link component
 */
const ContactLink = ({ Icon, href, ariaLabel, className }: ContactLinkProps) => (
  <MotionIconLink
    to={href}
    icon={<Icon className='h-6 w-6' />}
    ariaLabel={ariaLabel}
    className={`text-primary bg-transparent underline-offset-4 transition-all hover:underline ${className}`}
    isExternal={true}
  />
);

export default ContactLink;

export type { ContactLinkProps };
