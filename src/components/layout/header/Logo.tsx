import { Link } from 'react-router';
import { motion } from 'framer-motion';

import { logoImageMotion } from '@/lib/animations';

const MotionLink = motion.create(Link);

const Logo = () => (
  <MotionLink
    to='/'
    className='font-space-grotesk flex items-center justify-center gap-1.5 text-base font-semibold drop-shadow-md lg:text-xl'
    data-role='logo-link'
    aria-label='Home'
    {...logoImageMotion}
  >
    <img src='/logo.svg' alt="Daniel's Lab Logo" className='h-6 w-6' aria-hidden='true' />
    Daniel's Lab
  </MotionLink>
);

export default Logo;
