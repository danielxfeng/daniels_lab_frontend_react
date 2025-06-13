import { ContactLinkProps } from '@/components/shared/ContactLink';
import { FaLinkedin, FaGithub } from 'react-icons/fa6';
import { HiOutlineMail } from 'react-icons/hi';

/**
 * A constant list of contact links with icons.
 * @type {ContactLinkProps[]}
 */
const contactIconList: ContactLinkProps[] = [
  { Icon: FaGithub, to: 'https://github.com', supportText: 'GitHub' },
  { Icon: FaLinkedin, to: 'https://linkedin.com', supportText: 'LinkedIn' },
  { Icon: HiOutlineMail, to: 'mailto:admin@fancyblog.com', supportText: 'Email' },
];

export default contactIconList;
