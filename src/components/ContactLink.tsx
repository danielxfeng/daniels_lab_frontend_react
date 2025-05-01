import React from 'react';

/**
 * Type definition for the ContactLink component props.
 */
type ContactLinkProps = {
  key?: string;
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
  <a href={href} target='_blank' rel='noopener noreferrer' aria-label={ariaLabel}>
    <Icon className={className} />
  </a>
);

export default ContactLink;

export type { ContactLinkProps };
