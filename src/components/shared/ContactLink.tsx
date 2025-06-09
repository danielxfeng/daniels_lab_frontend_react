import React from 'react';
import MotionButton from '@/components/motion_components/MotionButton';

/**
 * Type definition for the ContactLink component props.
 */
type ContactLinkProps = {
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  to: string;
  supportText: string;
};

/**
 * A reusable component for rendering a contact link with an icon.
 * @param - Icon: The icon component to be rendered
 * @param - to: The URL to link to
 * @param - supportText: The aria-label for accessibility
 * @returns An reusable contact link component
 */
const ContactLink = ({ Icon, to, supportText }: ContactLinkProps) => (
  <MotionButton
    supportingText={supportText}
    size='md'
    variant='ghost'
    to={to}
    icon={<Icon />}
    isExternal={true}
  />
);

export default ContactLink;

export type { ContactLinkProps };
