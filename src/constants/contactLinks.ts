import { ContactLinkProps } from '@/components/ContactLink';

import { FaLinkedin, FaGithub } from 'react-icons/fa6';
import { HiOutlineMail } from 'react-icons/hi';

/**
 * A constant list of contact links with icons.
 * @type {ContactLinkProps[]}
 */
const contactIconList: ContactLinkProps[] = [
  { Icon: FaGithub, href: 'https://github.com', ariaLabel: 'GitHub' },
  { Icon: FaLinkedin, href: 'https://linkedin.com', ariaLabel: 'LinkedIn' },
  { Icon: HiOutlineMail, href: 'mailto:admin@fancyblog.com', ariaLabel: 'Email' },
];

export default contactIconList;
