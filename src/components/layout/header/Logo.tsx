import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

import { logoImageMotion } from '@/lib/animations';

const Logo = () => (
  <Link to='/' className='flex items-end justify-start' data-role='logo-link' aria-label='Home'>
    <motion.img
      src='/icon.svg'
      alt='Logo light'
      className='h-12 dark:hidden'
      {...logoImageMotion}
    />
    <motion.img
      src='/icon-dark.svg'
      alt='Logo dark'
      className='hidden h-12 dark:block'
      {...logoImageMotion}
    />
  </Link>
);

export default Logo;
