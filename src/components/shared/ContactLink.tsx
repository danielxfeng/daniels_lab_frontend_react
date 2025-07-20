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
 */
const ContactLink = ({ Icon, to, supportText }: ContactLinkProps) => (
  <MotionButton
    supportingText={supportText}
    size='md'
    variant='ghost'
    to={to}
    icon={<Icon />}
    isExternal={true}
    dataRole='button-contact-link'
  />
);

export default ContactLink;

export type { ContactLinkProps };
