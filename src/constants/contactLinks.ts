import { FaGithub, FaLinkedin } from 'react-icons/fa6';
import { HiOutlineMail } from 'react-icons/hi';

import { ContactLinkProps } from '@/components/shared/ContactLink';

import siteMeta from './siteMeta';

/**
 * A constant list of contact links with icons.
 * @type {ContactLinkProps[]}
 */
const contactIconList: ContactLinkProps[] = [
  { Icon: FaGithub, to: siteMeta.myGithub, supportText: 'GitHub' },
  { Icon: FaLinkedin, to: siteMeta.myLinkedIn, supportText: 'LinkedIn' },
  { Icon: HiOutlineMail, to: siteMeta.myEmail, supportText: 'Email' },
];

export default contactIconList;
